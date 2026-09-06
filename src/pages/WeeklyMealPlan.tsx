import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "../store/patientStore";
import { useDietStore } from "../store/dietStore";
import { DietPlanService } from "../services/dietPlanService";
import MealCard from "../components/patient/MealCard";
import RecipeDialog from "../components/patient/RecipeDialog";
import { ShoppingCart, RefreshCw, Zap, Search, Leaf, CheckCircle2, ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Meal } from "../types/meal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import PatientNavBar from "../components/patient/PatientNavBar";

const WeeklyMealPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, doshaResult, userId } = usePatientStore();
  const { weeklyPlan, setWeeklyPlan, updateMeal, markMealStatus, completions } = useDietStore();
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{meal: Meal, type: "breakfast"|"lunch"|"dinner"} | null>(null);
  const [recipeMeal, setRecipeMeal] = useState<Meal | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapOptions, setSwapOptions] = useState<Meal[]>([]);
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);

  const generateNewPlan = useCallback(() => {
    if (!profile || !doshaResult) return;
    setIsGenerating(true);
    setTimeout(() => {
      const plan = DietPlanService.generateWeeklyPlan(profile, doshaResult, userId || undefined);
      setWeeklyPlan(plan);
      setIsGenerating(false);
      toast({
        title: "Plan Generated 🌿",
        description: `Fresh 7-day plan prepared for ${profile.fullName} (${doshaResult.constitution}).`,
      });
    }, 1500);
  }, [profile, doshaResult, userId, setWeeklyPlan, toast]);

  useEffect(() => {
    if (!profile || !doshaResult) {
      navigate("/patient/onboarding");
      return;
    }
    
    // Check if existing plan belongs to another user or if no plan exists
    const currentUid = userId || localStorage.getItem("arogyam_session");
    const isOtherUserPlan = weeklyPlan?.userId && currentUid && String(weeklyPlan.userId) !== String(currentUid);

    if (!weeklyPlan || isOtherUserPlan) {
      generateNewPlan();
    }
  }, [profile, doshaResult, weeklyPlan, userId, navigate, generateNewPlan]);

  const handleMealClick = (meal: Meal, type: "breakfast"|"lunch"|"dinner") => {
    setSelectedMeal({ meal, type });
  };

  const handleSwapClick = () => {
    if (!selectedMeal || !profile || !doshaResult) return;
    const alternatives = DietPlanService.getAlternatives(selectedMeal.meal, profile, doshaResult);
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
              Personalized for {doshaResult?.constitution} • {profile?.dietPreference}
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
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
          {selectedMeal && (
            <>
              <div className="bg-primary/10 p-6 pb-4">
                <div className="uppercase text-xs font-bold tracking-wider text-primary mb-2">
                  {selectedMeal.type}
                </div>
                <DialogTitle className="text-2xl">{selectedMeal.meal.name}</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {selectedMeal.meal.description}
                </DialogDescription>
              </div>
              <div className="p-6">
                <Tabs defaultValue="nutrition">
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="nutrition">Nutrition & AI Insight</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  </TabsList>
                  <TabsContent value="nutrition" className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 bg-muted/50 p-4 rounded-xl text-center">
                      <div>
                        <div className="text-2xl font-bold text-orange-500">{selectedMeal.meal.calories}</div>
                        <div className="text-xs text-muted-foreground uppercase">Kcal</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{selectedMeal.meal.protein}g</div>
                        <div className="text-xs text-muted-foreground uppercase">Protein</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">{selectedMeal.meal.carbohydrates}g</div>
                        <div className="text-xs text-muted-foreground uppercase">Carbs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-500">{selectedMeal.meal.fats}g</div>
                        <div className="text-xs text-muted-foreground uppercase">Fats</div>
                      </div>
                    </div>
                    {selectedMeal.meal.explanation && (
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                        <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm mb-1 text-primary">Why this meal?</div>
                          <p className="text-sm text-muted-foreground">{selectedMeal.meal.explanation}</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="ingredients">
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedMeal.meal.ingredients.map(ing => (
                        <li key={ing} className="flex items-center gap-2 text-sm p-2 bg-accent/30 rounded-md border border-border/50">
                          <Leaf className="w-4 h-4 text-green-600" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                  <Button 
                    variant="secondary" 
                    className="flex-1 border border-border"
                    onClick={() => {
                      if (selectedMeal) setRecipeMeal(selectedMeal.meal);
                    }}
                  >
                    <ChefHat className="w-4 h-4 mr-2 text-primary" /> View Recipe
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleSwapClick}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Swap Meal
                  </Button>
                  {!isMealCompleted(selectedMeal.meal.id, selectedDay.date) ? (
                    <Button className="flex-1 btn-wellness" onClick={handleMarkComplete}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Done
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 bg-green-600 text-white opacity-100">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Completed
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
