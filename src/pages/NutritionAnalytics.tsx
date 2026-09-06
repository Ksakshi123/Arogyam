import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDietStore } from "../store/dietStore";
import { usePatientStore } from "../store/patientStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  ArrowLeft,
  Calendar,
  Zap,
} from "lucide-react";
import PatientNavBar from "../components/patient/PatientNavBar";

const NutritionAnalytics = () => {
  const { weeklyPlan, completions, getStreak } = useDietStore();
  const { profile, doshaResult } = usePatientStore();
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const streak = getStreak();
  const proteinGoal = profile?.weight ? Math.round(profile.weight * 1.2) : 60;
  const calorieGoal = 2000;

  // Day breakdown
  const selectedDayData = weeklyPlan?.days?.[selectedDayIdx];
  const dayCompletions = useMemo(() => {
    if (!selectedDayData) return [];
    return completions.filter((c) => c.date === selectedDayData.date && c.status === "completed");
  }, [selectedDayData, completions]);

  const bDone = selectedDayData
    ? dayCompletions.some((c) => c.mealId === selectedDayData.breakfast.id)
    : false;
  const lDone = selectedDayData
    ? dayCompletions.some((c) => c.mealId === selectedDayData.lunch.id)
    : false;
  const dDone = selectedDayData
    ? dayCompletions.some((c) => c.mealId === selectedDayData.dinner.id)
    : false;

  // Current day consumed totals
  const todayConsumed = useMemo(() => {
    if (!selectedDayData) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    let cal = 0, pro = 0, carb = 0, fat = 0;
    if (bDone) {
      cal += selectedDayData.breakfast.calories;
      pro += selectedDayData.breakfast.protein;
      carb += selectedDayData.breakfast.carbohydrates;
      fat += selectedDayData.breakfast.fats;
    }
    if (lDone) {
      cal += selectedDayData.lunch.calories;
      pro += selectedDayData.lunch.protein;
      carb += selectedDayData.lunch.carbohydrates;
      fat += selectedDayData.lunch.fats;
    }
    if (dDone) {
      cal += selectedDayData.dinner.calories;
      pro += selectedDayData.dinner.protein;
      carb += selectedDayData.dinner.carbohydrates;
      fat += selectedDayData.dinner.fats;
    }
    return { calories: cal, protein: pro, carbs: carb, fats: fat };
  }, [selectedDayData, bDone, lDone, dDone]);

  // Current day planned totals
  const todayPlanned = useMemo(() => {
    if (!selectedDayData) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const m = [selectedDayData.breakfast, selectedDayData.lunch, selectedDayData.dinner];
    return {
      calories: m.reduce((acc, x) => acc + x.calories, 0),
      protein: m.reduce((acc, x) => acc + x.protein, 0),
      carbs: m.reduce((acc, x) => acc + x.carbohydrates, 0),
      fats: m.reduce((acc, x) => acc + x.fats, 0),
    };
  }, [selectedDayData]);

  // Weekly Chart Data
  const chartData = useMemo(() => {
    if (!weeklyPlan) return [];
    return weeklyPlan.days.map((day) => {
      let dailyProtein = 0;
      let dailyCalories = 0;
      const plannedProtein = day.breakfast.protein + day.lunch.protein + day.dinner.protein;
      const dayDone = completions.filter((c) => c.date === day.date && c.status === "completed");

      if (dayDone.some((c) => c.mealId === day.breakfast.id)) {
        dailyProtein += day.breakfast.protein;
        dailyCalories += day.breakfast.calories;
      }
      if (dayDone.some((c) => c.mealId === day.lunch.id)) {
        dailyProtein += day.lunch.protein;
        dailyCalories += day.lunch.calories;
      }
      if (dayDone.some((c) => c.mealId === day.dinner.id)) {
        dailyProtein += day.dinner.protein;
        dailyCalories += day.dinner.calories;
      }

      return {
        name: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
        date: day.date,
        consumedProtein: dailyProtein,
        plannedProtein,
        consumedCalories: dailyCalories,
      };
    });
  }, [weeklyPlan, completions]);

  const totalPlannedMeals = weeklyPlan ? weeklyPlan.days.length * 3 : 0;
  const totalCompletedMeals = completions.filter((c) => c.status === "completed").length;
  const adherenceScore = totalPlannedMeals > 0 ? Math.round((totalCompletedMeals / totalPlannedMeals) * 100) : 0;

  // Radial progress calculations
  const proteinPercent = Math.min(100, Math.round((todayConsumed.protein / (proteinGoal || 1)) * 100));
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (proteinPercent / 100) * circumference;

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen gradient-wellness flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 wellness-card">
          <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground">No active meal plan found</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Generate your personalized 7-day Ayurvedic meal plan first to view in-depth nutritional analytics.
          </p>
          <Button asChild className="btn-wellness w-full">
            <Link to="/patient/meal-plan">Go to Meal Planner</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-wellness pb-24">
      <PatientNavBar />
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                {doshaResult?.constitution || "Pitta-Kapha"} Nutrition
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Nutrition & Macro Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Live biological tracking against your Ayurvedic constitution
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-card px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Streak</div>
                <div className="font-bold text-sm text-foreground">{streak} Day{streak === 1 ? "" : "s"}</div>
              </div>
            </div>
            <div className="bg-card px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Adherence</div>
                <div className="font-bold text-sm text-emerald-600">{adherenceScore}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md bg-muted/60 p-1 mb-6">
            <TabsTrigger value="daily" className="font-semibold text-sm">
              Daily Macro Ring
            </TabsTrigger>
            <TabsTrigger value="weekly" className="font-semibold text-sm">
              Weekly Trends
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: DAILY VIEW */}
          <TabsContent value="daily" className="space-y-6">
            {/* Day Selector */}
            <div className="flex items-center justify-between bg-card p-3 rounded-2xl border shadow-sm">
              <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Viewing Day:
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {weeklyPlan.days.map((d, i) => (
                  <Button
                    key={d.date}
                    size="sm"
                    variant={selectedDayIdx === i ? "default" : "ghost"}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`text-xs px-3 py-1 h-8 rounded-lg ${
                      selectedDayIdx === i ? "btn-wellness shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Day {i + 1}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Radial Protein Gauge */}
              <Card className="wellness-card border shadow-sm flex flex-col items-center justify-center p-6 text-center">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-base font-bold text-foreground">Daily Protein Target</CardTitle>
                  <CardDescription className="text-xs">
                    Optimal metabolic threshold for muscle & tissue repair
                  </CardDescription>
                </CardHeader>

                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r={circleRadius}
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/40"
                      fill="transparent"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={circleRadius}
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-700 ease-out"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-foreground">{todayConsumed.protein}g</span>
                    <span className="text-xs text-muted-foreground font-medium">of {proteinGoal}g goal</span>
                    <Badge variant="secondary" className="mt-1 text-[10px] bg-primary/10 text-primary border-none">
                      {proteinPercent}% Complete
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  Planned for today: <strong className="text-foreground">{todayPlanned.protein}g</strong> protein
                </div>
              </Card>

              {/* 4 Macro Breakdown Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {/* Calories */}
                <Card className="wellness-card p-5 border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Planned: {todayPlanned.calories}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{todayConsumed.calories} kcal</div>
                  <div className="text-xs text-muted-foreground mt-1">Calories Consumed Today</div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (todayConsumed.calories / (calorieGoal || 1)) * 100)}%` }}
                    />
                  </div>
                </Card>

                {/* Protein */}
                <Card className="wellness-card p-5 border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Target: {proteinGoal}g
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{todayConsumed.protein}g</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Protein Intaken</div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proteinPercent}%` }}
                    />
                  </div>
                </Card>

                {/* Carbs */}
                <Card className="wellness-card p-5 border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Wheat className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Planned: {todayPlanned.carbs}g
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{todayConsumed.carbs}g</div>
                  <div className="text-xs text-muted-foreground mt-1">Carbohydrates (Complex Prana)</div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (todayConsumed.carbs / (todayPlanned.carbs || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </Card>

                {/* Healthy Fats */}
                <Card className="wellness-card p-5 border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Planned: {todayPlanned.fats}g
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{todayConsumed.fats}g</div>
                  <div className="text-xs text-muted-foreground mt-1">Beneficial Fats (Ghee & Seeds)</div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (todayConsumed.fats / (todayPlanned.fats || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* Daily Meals Timeline Check */}
            {selectedDayData && (
              <Card className="wellness-card p-6 border shadow-sm">
                <CardTitle className="text-base mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Meals Logged for {selectedDayData.dayOfWeek} (
                  {new Date(selectedDayData.date).toLocaleDateString()})
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { meal: selectedDayData.breakfast, done: bDone, type: "Breakfast" },
                    { meal: selectedDayData.lunch, done: lDone, type: "Lunch" },
                    { meal: selectedDayData.dinner, done: dDone, type: "Dinner" },
                  ].map((item) => (
                    <div
                      key={item.type}
                      className={`p-4 rounded-xl border transition-all ${
                        item.done
                          ? "bg-primary/5 border-primary/40 shadow-xs"
                          : "bg-muted/30 border-border opacity-70"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          {item.type}
                        </span>
                        {item.done ? (
                          <Badge className="bg-emerald-600 text-white text-[10px] hover:bg-emerald-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </div>
                      <div className="font-semibold text-sm text-foreground line-clamp-1 mt-1">
                        {item.meal.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                        <span>{item.meal.calories} kcal</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{item.meal.protein}g protein</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* TAB 2: WEEKLY VIEW */}
          <TabsContent value="weekly" className="space-y-6">
            <Card className="wellness-card p-6 border shadow-sm">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Weekly Protein Adherence</CardTitle>
                <CardDescription>
                  Comparison between your target consumption and actual logged intake across the week
                </CardDescription>
              </CardHeader>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--card))",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="plannedProtein"
                      name="Planned Protein (g)"
                      fill="hsl(var(--muted))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="consumedProtein"
                      name="Consumed Protein (g)"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.consumedProtein >= proteinGoal
                              ? "hsl(var(--primary))"
                              : "hsl(var(--primary)/0.4)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Holistic Insight */}
            <Card className="bg-gradient-to-br from-primary/10 via-emerald-500/5 to-teal-500/10 border-primary/20 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base">Ayurvedic Biometric Insight</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {adherenceScore > 75
                      ? `Exceptional digestive rhythm! By completing ${totalCompletedMeals} Ayurvedic meals, you are nurturing your Ojas (vital immunity) and keeping your primary ${doshaResult?.constitution || "dosha"} balance completely aligned.`
                      : `You're progressing nicely on your wellness path! Ensure your largest protein and carbohydrate portion is consumed between 12:00 PM and 1:30 PM, when solar energy naturally elevates your gastric fire.`}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NutritionAnalytics;
