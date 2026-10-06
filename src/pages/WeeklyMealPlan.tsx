import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "../store/patientStore";
import { useDietStore } from "../store/dietStore";
import { DietPlanService } from "../services/dietPlanService";
import { dietApi } from "../services/dietApi";
import MealCard from "../components/patient/MealCard";
import RecipeDialog from "../components/patient/RecipeDialog";
import { ShoppingCart, RefreshCw, Zap, Search, Leaf, CheckCircle2, ChefHat, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Meal } from "../types/meal";
import { DoshaResult, DoshaType } from "../types/dosha";
import { dbGetSession } from "@/lib/db";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import PatientNavBar from "../components/patient/PatientNavBar";

const WeeklyMealPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, doshaResult, userId, isLoading, loadFromDB } = usePatientStore();
  const { weeklyPlan, setWeeklyPlan, updateMeal, markMealStatus, completions } = useDietStore();
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{meal: Meal, type: "breakfast"|"lunch"|"dinner"} | null>(null);
  const [recipeMeal, setRecipeMeal] = useState<Meal | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapOptions, setSwapOptions] = useState<Meal[]>([]);
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);

  const effectiveDosha: DoshaResult = doshaResult || {
    vata: 33,
    pitta: 34,
    kapha: 33,
    primaryDosha: "Vata" as DoshaType,
    secondaryDosha: "Pitta" as DoshaType,
    constitution: "Tridoshic (Balanced)",
    assessmentDate: new Date().toISOString(),
  };

  const generateNewPlan = useCallback(async () => {
    if (!profile) return;
    setIsGenerating(true);
    const activeUid = userId || dbGetSession() || 1;

    try {
      // 1. Primary: Generate 7-day Ayurvedic meal plan via backend Groq LLM
      const remotePlan = await dietApi.generateWeeklyPlan(activeUid);
      if (remotePlan && remotePlan.days && remotePlan.days.length >= 7) {
        setWeeklyPlan(remotePlan);
        toast({
          title: "AI Meal Plan Generated 🌿",
          description: `Personalized 7-day plan prepared via Groq LLM for ${profile.fullName} (${effectiveDosha.constitution}).`,
        });
        return;
      }
    } catch (err) {
      console.warn("Backend Groq LLM generation error, falling back to local generator:", err);
    } finally {
      setIsGenerating(false);
    }

    // 2. Fallback to client-side rule-based generator if backend is unavailable
    const fallbackPlan = DietPlanService.generateWeeklyPlan(profile, effectiveDosha, userId || undefined);
    setWeeklyPlan(fallbackPlan);
    toast({
      title: "Plan Generated 🌿",
      description: `Fresh 7-day plan prepared for ${profile.fullName} (${effectiveDosha.constitution}).`,
    });
  }, [profile, effectiveDosha, userId, setWeeklyPlan, toast]);

  useEffect(() => {
    if (isLoading) return;

    if (!profile) {
      const activeUid = userId || dbGetSession();
      if (activeUid) {
        loadFromDB(activeUid);
      } else {
        navigate("/patient/login");
      }
      return;
    }
    
    // Check if existing plan belongs to another user or if no plan exists
    const currentUid = userId || dbGetSession() || 1;
    const isOtherUserPlan = weeklyPlan?.userId && currentUid && String(weeklyPlan.userId) !== String(currentUid);

    if (!weeklyPlan || isOtherUserPlan) {
      // Load active plan from backend first, or generate new
      dietApi.getCurrentPlan(currentUid)
        .then((remotePlan) => {
          if (remotePlan && remotePlan.days && remotePlan.days.length >= 7) {
            setWeeklyPlan(remotePlan);
          } else {
            generateNewPlan();
          }
        })
        .catch(() => {
          generateNewPlan();
        });
    }
  }, [profile, isLoading, weeklyPlan, userId, navigate, generateNewPlan, loadFromDB, setWeeklyPlan]);

  const handleMealClick = (meal: Meal, type: "breakfast"|"lunch"|"dinner") => {
    setSelectedMeal({ meal, type });
  };

  const handleSwapClick = () => {
    if (!selectedMeal || !profile) return;
    const alternatives = DietPlanService.getAlternatives(selectedMeal.meal, profile, effectiveDosha);
    setSwapOptions(alternatives);
    setIsSwapModalOpen(true);
  };

  const handleSwapConfirm = (newMeal: Meal) => {
    if (!selectedMeal) return;
    updateMeal(selectedDayIndex, selectedMeal.type, newMeal);
    setIsSwapModalOpen(false);
    setSelectedMeal(null);
    toast({
      title: "Meal Swapped",
      description: `Your ${selectedMeal.type} has been updated to ${newMeal.name}.`,
    });
  };

  const handleMarkComplete = () => {
    if (!selectedMeal || !weeklyPlan) return;
    const date = weeklyPlan.days[selectedDayIndex].date;
    markMealStatus({
      mealId: selectedMeal.meal.id,
      date,
      status: "completed"
    });
    setSelectedMeal(null);
    toast({
      title: "Meal Completed",
      description: `Great job staying on track with your wellness goals!`,
    });
  };

  const isMealCompleted = (mealId: string, date: string) => {
    return completions.some(c => c.mealId === mealId && c.date === date && c.status === "completed");
  };

  const getGroceryList = () => {
    if (!weeklyPlan) return [];
    const ingredients = new Map<string, number>();
    weeklyPlan.days.forEach(day => {
      [day.breakfast, day.lunch, day.dinner].forEach(meal => {
        meal.ingredients.forEach(ing => {
          ingredients.set(ing, (ingredients.get(ing) || 0) + 1);
        });
      });
    });
    return Array.from(ingredients.entries()).sort((a, b) => b[1] - a[1]);
  };

  if (isGenerating || !weeklyPlan) {
    return (
      <div className="min-h-screen gradient-wellness flex flex-col items-center justify-center p-4">
        <div className="space-y-4 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-center mb-6">Creating your personalized plan...</h2>
          <div className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="text-primary w-5 h-5"/> Analyzing dosha profile</div>
          <div className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="text-primary w-5 h-5"/> Applying allergy constraints</div>
          <div className="flex items-center gap-3 text-primary font-medium animate-pulse"><RefreshCw className="w-5 h-5 animate-spin"/> Curating 21 Ayurvedic meals</div>
        </div>
      </div>
    );
  }

  const selectedDay = weeklyPlan.days[selectedDayIndex];

  return (
    <div className="min-h-screen gradient-wellness pb-24">
      <PatientNavBar />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Weekly Diet Plan</h1>
            <p className="text-muted-foreground mt-1">
              Personalized for {effectiveDosha.constitution} • {profile?.dietPreference || "Ayurvedic Nutrition"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-card px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{weeklyPlan.compatibilityScore.overall}% Match</span>
            </div>
            <Button
              variant="outline"
              className="bg-card hover:bg-primary/10 hover:text-primary transition-all"
              onClick={generateNewPlan}
              disabled={isGenerating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              Regenerate Plan
            </Button>
            <Button variant="outline" className="bg-card" onClick={() => setIsGroceryModalOpen(true)}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Grocery List
            </Button>
          </div>
        </div>

        {/* Banner if Dosha Quiz is pending */}
        {!doshaResult && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Showing Balanced Tridoshic Meal Plan</h4>
                <p className="text-xs text-muted-foreground">Complete your 15-question Dosha Assessment to customize meals specifically to your body constitution.</p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate("/patient/dosha-assessment")} className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-sm">
              Personalize via Quiz <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}

        {/* Horizontal Day Selector */}
        <div className="bg-card border shadow-sm rounded-xl p-2 mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex min-w-max">
            {weeklyPlan.days.map((day, idx) => (
              <button
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedDayIndex === idx 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                <div className="uppercase text-[10px] opacity-80 mb-1">{new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                <div>Day {idx + 1}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MealCard 
            meal={selectedDay.breakfast} 
            onClick={() => handleMealClick(selectedDay.breakfast, "breakfast")}
            onViewRecipe={(m) => setRecipeMeal(m)}
            isCompleted={isMealCompleted(selectedDay.breakfast.id, selectedDay.date)}
          />
          <MealCard 
            meal={selectedDay.lunch} 
            onClick={() => handleMealClick(selectedDay.lunch, "lunch")}
            onViewRecipe={(m) => setRecipeMeal(m)}
            isCompleted={isMealCompleted(selectedDay.lunch.id, selectedDay.date)}
          />
          <MealCard 
            meal={selectedDay.dinner} 
            onClick={() => handleMealClick(selectedDay.dinner, "dinner")}
            onViewRecipe={(m) => setRecipeMeal(m)}
            isCompleted={isMealCompleted(selectedDay.dinner.id, selectedDay.date)}
          />
        </div>
      </div>

      {/* Meal Detail Dialog */}
      <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden max-h-[90vh] flex flex-col rounded-2xl">
          {selectedMeal && (
            <>
              <div className="bg-primary/10 p-6 pb-4 flex-shrink-0 border-b border-border/50">
                <div className="uppercase text-xs font-bold tracking-wider text-primary mb-2 flex items-center gap-2">
                  <span>{selectedMeal.type}</span>
                  <span>•</span>
                  <span>{selectedMeal.meal.preparationTime} mins prep</span>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedMeal.meal.name}</DialogTitle>
                <DialogDescription className="text-sm mt-1.5 line-clamp-2">
                  {selectedMeal.meal.description}
                </DialogDescription>
              </div>
              <div className="p-6 flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-6">
                <Tabs defaultValue="nutrition">
                  <TabsList className="w-full grid grid-cols-3 mb-6">
                    <TabsTrigger value="nutrition" className="text-xs">Nutrition & AI</TabsTrigger>
                    <TabsTrigger value="ingredients" className="text-xs">Ingredients</TabsTrigger>
                    <TabsTrigger value="recipe" className="text-xs flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-primary" /> Recipe Steps
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="nutrition" className="space-y-4">
                    <div className="grid grid-cols-4 gap-3 bg-muted/50 p-4 rounded-xl text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-orange-500">{selectedMeal.meal.calories}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">Kcal</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-500">{selectedMeal.meal.protein}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">Protein</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-green-500">{selectedMeal.meal.carbohydrates}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">Carbs</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-yellow-500">{selectedMeal.meal.fats}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">Fats</div>
                      </div>
                    </div>
                    {selectedMeal.meal.explanation && (
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                        <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm mb-1 text-primary">Why this meal?</div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{selectedMeal.meal.explanation}</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="ingredients">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-2">Required fresh ingredients:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedMeal.meal.ingredients.map((ing) => (
                          <li key={ing} className="flex items-center gap-2 text-sm p-2.5 bg-accent/30 rounded-lg border border-border/50">
                            <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="truncate">{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="recipe" className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Step-by-step instructions:</p>
                      <Badge variant="outline" className="text-[10px]">
                        {selectedMeal.meal.recipe?.steps.length || 5} Steps
                      </Badge>
                    </div>
                    <div className="space-y-2.5">
                      {(selectedMeal.meal.recipe?.steps || [
                        `Prepare and rinse ${selectedMeal.meal.ingredients.slice(0, 3).join(", ")}.`,
                        `Heat 1 tsp ghee or cold-pressed oil with cumin seeds on medium flame.`,
                        `Add the fresh ingredients, Himalayan pink salt, and spices.`,
                        `Simmer gently until tender and aromatic.`,
                        `Garnish with fresh cilantro and serve warm for optimal Agni.`
                      ]).map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/70 text-left">
                          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-border">
                  <Button 
                    variant="secondary" 
                    className="flex-1 text-xs"
                    onClick={() => {
                      if (selectedMeal) setRecipeMeal(selectedMeal.meal);
                    }}
                  >
                    <ChefHat className="w-3.5 h-3.5 mr-1.5 text-primary" /> Full Recipe Modal
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs" onClick={handleSwapClick}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Swap Meal
                  </Button>
                  {!isMealCompleted(selectedMeal.meal.id, selectedDay.date) ? (
                    <Button className="flex-1 btn-wellness text-xs" onClick={handleMarkComplete}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark Done
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 bg-green-600 text-white opacity-100 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Completed
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Swap Meal Dialog */}
      <Dialog open={isSwapModalOpen} onOpenChange={setIsSwapModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Swap Meal</DialogTitle>
            <DialogDescription>
              Select an alternative {selectedMeal?.type}. These options match your {doshaResult?.constitution} profile and strict allergy requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {swapOptions.map(opt => (
              <div 
                key={opt.id} 
                className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                onClick={() => handleSwapConfirm(opt)}
              >
                <div>
                  <div className="font-semibold">{opt.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                    <span>{opt.calories} kcal</span>
                    <span>•</span>
                    <span className="text-primary font-medium">{opt.protein}g protein</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Select</Button>
              </div>
            ))}
            {swapOptions.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No direct alternatives found that perfectly match all your constraints. 
                Ask the AI Chatbot to generate a completely new recipe!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Grocery List Dialog */}
      <Dialog open={isGroceryModalOpen} onOpenChange={setIsGroceryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Smart Grocery List 🛒</DialogTitle>
            <DialogDescription>
              Combined ingredients for your current 7-day personalized plan.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4 pr-4">
            <div className="space-y-2">
              {getGroceryList().map(([ing, count]) => (
                <div key={ing} className="flex justify-between items-center p-3 border-b last:border-0">
                  <span className="font-medium">{ing}</span>
                  <Badge variant="secondary">Used in {count} meals</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Recipe Dialog */}
      <RecipeDialog
        meal={recipeMeal}
        isOpen={!!recipeMeal}
        onClose={() => setRecipeMeal(null)}
      />
    </div>
  );
};

export default WeeklyMealPlan;
