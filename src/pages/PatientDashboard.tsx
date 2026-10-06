import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Target,
  Calendar,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  LogOut,
  Flame,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PatientNavBar from "../components/patient/PatientNavBar";
import { usePatientStore } from "../store/patientStore";
import { useDietStore } from "../store/dietStore";
import { useChatbotStore } from "../store/chatbotStore";
import { dbDaysSinceJoined, dbGetSession } from "@/lib/db";
import RecipeDialog from "../components/patient/RecipeDialog";
import { Meal } from "../types/meal";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { profile, doshaResult, logout, userId, isLoading, loadFromDB } = usePatientStore();
  const { weeklyPlan, completions, markMealStatus, getStreak, loadWeeklyPlan } = useDietStore();
  const setIsChatOpen = useChatbotStore((state) => state.setIsOpen);

  const [greeting, setGreeting] = useState("Good Morning");
  const [recipeMeal, setRecipeMeal] = useState<Meal | null>(null);
  const attemptedLoadRef = useRef(false);
  const attemptedPlanRef = useRef<string | null>(null);

  useEffect(() => {
    // Keep user on their dashboard when pressing browser Back button
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      const activeUid = usePatientStore.getState().userId || dbGetSession();
      if (activeUid) {
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const activeUid = userId || dbGetSession();
    if (!activeUid) {
      navigate("/patient/login", { replace: true });
      return;
    }

    if (!profile) {
      if (!attemptedLoadRef.current && !isLoading) {
        attemptedLoadRef.current = true;
        loadFromDB(activeUid).then(() => {
          const currentProfile = usePatientStore.getState().profile;
          if (!currentProfile) {
            navigate("/patient/onboarding");
          }
        });
      }
      return;
    }

    if (activeUid && attemptedPlanRef.current !== activeUid) {
      attemptedPlanRef.current = activeUid;
      loadWeeklyPlan(activeUid);
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [profile, userId, isLoading, navigate, loadWeeklyPlan, loadFromDB]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen gradient-wellness flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  const effectiveDosha = doshaResult || {
    vata: 33,
    pitta: 34,
    kapha: 33,
    primaryDosha: "Tridoshic",
    constitution: "Pending Quiz",
  };

  const currentStreak = getStreak();
  const activeUserId = userId || dbGetSession() || "";
  const daysSinceJoined = activeUserId ? dbDaysSinceJoined(activeUserId) : 1;

  // Calculate adherence
  const totalPlannedMeals = weeklyPlan ? weeklyPlan.days.length * 3 : 0;
  const totalCompletedMeals = completions.filter((c) => c.status === "completed").length;
  const adherenceScore = totalPlannedMeals > 0 ? Math.round((totalCompletedMeals / totalPlannedMeals) * 100) : 0;

  // Find today's plan matching local date or fallback to first day
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysPlan =
    weeklyPlan?.days.find((d) => d.date === todayStr) ||
    weeklyPlan?.days[0];
  const activeDate = todaysPlan ? todaysPlan.date : todayStr;

  const getMealStatus = (mealId?: string) => {
    if (!mealId) return "pending";
    const comp = completions.find((c) => c.mealId === mealId && c.date === activeDate);
    return comp ? comp.status : "pending";
  };

  const todaysMeals = todaysPlan
    ? [
        {
          rawMeal: todaysPlan.breakfast,
          name: todaysPlan.breakfast.name,
          type: "Breakfast" as const,
          id: todaysPlan.breakfast.id,
          status: getMealStatus(todaysPlan.breakfast.id),
          protein: todaysPlan.breakfast.protein,
          calories: todaysPlan.breakfast.calories,
        },
        {
          rawMeal: todaysPlan.lunch,
          name: todaysPlan.lunch.name,
          type: "Lunch" as const,
          id: todaysPlan.lunch.id,
          status: getMealStatus(todaysPlan.lunch.id),
          protein: todaysPlan.lunch.protein,
          calories: todaysPlan.lunch.calories,
        },
        {
          rawMeal: todaysPlan.dinner,
          name: todaysPlan.dinner.name,
          type: "Dinner" as const,
          id: todaysPlan.dinner.id,
          status: getMealStatus(todaysPlan.dinner.id),
          protein: todaysPlan.dinner.protein,
          calories: todaysPlan.dinner.calories,
        },
      ]
    : [];

  const completedTodayCount = todaysMeals.filter((m) => m.status === "completed").length;
  const proteinGoal = Math.round((profile?.weight || 65) * 1.2);
  const consumedProteinToday = todaysMeals
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.protein, 0);

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen gradient-wellness pb-24">
      <PatientNavBar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                Day {daysSinceJoined} of your Journey
              </span>
              {currentStreak > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 flex items-center gap-1 animate-pulse">
                  🔥 {currentStreak} Day Streak
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {greeting}, {profile.fullName ? profile.fullName.split(" ")[0] : "Seeker"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Here is your holistic health summary and nutrition guidance for today.
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-card px-4 py-2.5 rounded-2xl shadow-sm border self-start md:self-auto">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                Constitution
              </span>
              <span className="font-bold text-primary text-base">{effectiveDosha.constitution}</span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex gap-2 text-xs font-semibold">
              <span className="px-2 py-0.5 rounded bg-[hsl(var(--vata)/0.15)] text-[hsl(var(--vata))]">
                V {effectiveDosha.vata ?? 0}%
              </span>
              <span className="px-2 py-0.5 rounded bg-[hsl(var(--pitta)/0.15)] text-[hsl(var(--pitta))]">
                P {effectiveDosha.pitta ?? 0}%
              </span>
              <span className="px-2 py-0.5 rounded bg-[hsl(var(--kapha)/0.15)] text-[hsl(var(--kapha))]">
                K {effectiveDosha.kapha ?? 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Banner if Dosha Assessment is Pending */}
        {!doshaResult && (
          <Card className="mb-8 border-amber-300/80 bg-amber-50/80 dark:bg-amber-950/20 shadow-sm overflow-hidden">
            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-base">Complete Your Dosha Assessment</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Take the 15-question Ayurvedic Prakriti assessment to discover your body constitution and unlock personalized weekly meal plans.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/patient/dosha-assessment")}
                className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 4 Dynamic Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="wellness-card border-none bg-card/90 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight text-foreground">
                  {completedTodayCount}/3 Logged
                </p>
                <p className="text-xs text-muted-foreground">Today's Meals</p>
              </div>
            </CardContent>
          </Card>

          <Card className="wellness-card border-none bg-card/90 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight text-foreground">
                  {consumedProteinToday}g / {proteinGoal}g
                </p>
                <p className="text-xs text-muted-foreground">Protein Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="wellness-card border-none bg-card/90 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-600">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight text-foreground flex items-center gap-1">
                  {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                  {currentStreak > 0 && <span className="text-sm">🔥</span>}
                </p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="wellness-card border-none bg-card/90 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight text-foreground">{adherenceScore}%</p>
                <p className="text-xs text-muted-foreground">Diet Adherence</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Meal Plan */}
          <Card className="wellness-card border-none bg-card/90 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Today's Nutrition Plan</CardTitle>
                <CardDescription className="text-xs">
                  {todaysPlan && weeklyPlan?.days
                    ? `Day ${Math.max(0, weeklyPlan.days.findIndex((d) => d.date === todaysPlan.date)) + 1} (${todaysPlan.dayOfWeek})`
                    : "Personalized daily menu"}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 text-xs font-semibold"
                onClick={() => navigate("/patient/meal-plan")}
              >
                View Full Week <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>

            <CardContent>
              {todaysMeals.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {todaysMeals.map((meal) => (
                    <div
                      key={meal.type}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-2xl bg-card transition-all ${
                        meal.status === "completed"
                          ? "border-primary/40 bg-primary/5"
                          : "hover:border-primary/40"
                      }`}
                    >
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            {meal.type}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-medium text-teal-600">{meal.protein}g Protein</span>
                        </div>
                        <h4 className="font-semibold text-foreground text-base">{meal.name}</h4>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-xs h-8 px-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => setRecipeMeal(meal.rawMeal)}
                        >
                          <ChefHat className="w-3.5 h-3.5 mr-1" /> Recipe
                        </Button>

                        {meal.status === "completed" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="h-8 text-xs bg-emerald-600/10 text-emerald-600 border-emerald-600/30 opacity-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs btn-wellness shadow-sm"
                            onClick={() =>
                              markMealStatus({
                                mealId: meal.id,
                                date: activeDate,
                                status: "completed",
                              })
                            }
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Done
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-background/50 rounded-xl border border-dashed">
                  <p className="text-muted-foreground mb-4">No meal plan active yet.</p>
                  <Button onClick={() => navigate("/patient/meal-plan")} className="btn-wellness">
                    Generate 7-Day Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar Widgets */}
          <div className="space-y-6">


            {/* Dosha Assessment Card */}
            <Card className="wellness-card border-none bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Dosha Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Your primary constitution is <strong className="text-foreground">{effectiveDosha.constitution}</strong>. Re-assess periodically if seasons change or your energy fluctuates.
                </p>
                <Button
                  onClick={() => navigate("/patient/dosha-assessment")}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 text-xs"
                >
                  {doshaResult ? "Retake Dosha Quiz" : "Take Dosha Quiz"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recipe Dialog */}
      <RecipeDialog
        meal={recipeMeal}
        isOpen={!!recipeMeal}
        onClose={() => setRecipeMeal(null)}
      />
    </div>
  );
};

export default PatientDashboard;