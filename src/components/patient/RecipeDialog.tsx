import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Users, ChefHat, Sparkles, CheckCircle2, Utensils, Check, X } from "lucide-react";
import { Meal } from "@/types/meal";
import { useState } from "react";

interface RecipeDialogProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDialog = ({ meal, isOpen, onClose }: RecipeDialogProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!meal) return null;

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [ing]: !prev[ing] }));
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Curated or dynamic recipe data fallback
  const recipe = meal.recipe || {
    steps: [
      `Rinse and prepare the primary ingredients: ${meal.ingredients.slice(0, 3).join(", ")}.`,
      `Heat a skillet or pot with 1 tsp cold-pressed oil or A2 cow ghee over medium heat.`,
      `Add digestive spices (cumin seeds, turmeric, or ginger) to awaken medicinal aromas.`,
      `Combine the ingredients, season lightly with rock salt (Sendha Namak), and simmer gently.`,
      `Garnish with fresh herbs and serve warm to optimize Agni (digestive fire).`,
    ],
    tips: [
      "Consume freshly prepared for maximum Prana (vital life force).",
      "Avoid drinking cold water immediately before or after this meal.",
      `Balanced specifically for ${meal.suitableDoshas?.join(" & ") || "optimal digestion"}.`,
    ],
    servings: 1,
    difficulty: "Easy" as const,
  };

  const totalSteps = recipe.steps.length;
  const doneStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((doneStepsCount / totalSteps) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden h-[90vh] max-h-[90vh] flex flex-col border border-border/80 shadow-2xl bg-background rounded-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 sm:p-6 pb-4 sm:pb-5 relative flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase tracking-wider text-[11px] font-semibold">
              {meal.type}
            </Badge>
            <Badge className="bg-emerald-950/40 text-emerald-100 border border-emerald-400/20 text-xs">
              <ChefHat className="w-3.5 h-3.5 mr-1 inline text-emerald-200" /> {recipe.difficulty}
            </Badge>
            <Badge className="bg-emerald-950/40 text-emerald-100 border border-emerald-400/20 text-xs">
              <Users className="w-3.5 h-3.5 mr-1 inline text-emerald-200" /> {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
            </Badge>
            {doneStepsCount > 0 && (
              <Badge className="bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs ml-auto">
                {doneStepsCount}/{totalSteps} steps completed
              </Badge>
            )}
          </div>

          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {meal.name}
          </DialogTitle>
          <DialogDescription className="text-emerald-100/90 mt-1 line-clamp-2 text-xs sm:text-sm">
            {meal.description}
          </DialogDescription>

          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-200/90">Prep Time</div>
              <div className="font-bold text-sm sm:text-base flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" /> {meal.preparationTime}m
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-200/90">Calories</div>
              <div className="font-bold text-sm sm:text-base flex items-center justify-center gap-1 mt-0.5 text-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> {meal.calories}
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-200/90">Protein</div>
              <div className="font-bold text-sm sm:text-base text-teal-200">{meal.protein}g</div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-200/90">Dosha</div>
              <div className="font-bold text-xs sm:text-sm text-amber-200 truncate">{meal.suitableDoshas?.join(", ") || "All"}</div>
            </div>
          </div>
        </div>

        {/* Recipe Body - GUARANTEED SCROLLABLE */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6 focus:outline-none"
          tabIndex={0}
        >
          {/* Ingredients with checklist */}
          <div className="bg-card/60 p-4 sm:p-5 rounded-xl border border-border/70 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                Ingredients Checklist
              </h3>
              <span className="text-xs text-muted-foreground">
                Tap items to cross off
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing];
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs sm:text-sm transition-all ${
                      isChecked
                        ? "bg-primary/10 border-primary/40 text-primary line-through opacity-70"
                        : "bg-background border-border/80 hover:border-primary/40 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-card"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate font-medium">{ing}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Step-by-Step Cooking Guide
              </h3>
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                {totalSteps} Steps Total
              </Badge>
            </div>

            <div className="space-y-3.5">
              {recipe.steps.map((step, idx) => {
                const isStepDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`cursor-pointer group flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                      isStepDone
                        ? "bg-emerald-500/5 border-emerald-500/30 opacity-80"
                        : "bg-card hover:bg-accent/10 border-border hover:border-primary/40 shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                        isStepDone
                          ? "bg-emerald-600 text-white"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                    >
                      {isStepDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Step {idx + 1}
                        </span>
                        <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                          {isStepDone ? "Completed" : "Tap when done"}
                        </span>
                      </div>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isStepDone
                            ? "text-muted-foreground line-through"
                            : "text-foreground font-normal"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ayurvedic Wisdom & Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                Ayurvedic Nutrition & Mindful Eating Principles
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-950/80 dark:text-amber-200/90 list-disc list-inside leading-relaxed">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="marker:text-amber-500">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom spacing helper */}
          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Done & Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;

