import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Flame, Users, ChefHat, Sparkles, CheckCircle2, Utensils } from "lucide-react";
import { Meal } from "@/types/meal";
import { useState } from "react";

interface RecipeDialogProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDialog = ({ meal, isOpen, onClose }: RecipeDialogProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  if (!meal) return null;

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [ing]: !prev[ing] }));
  };

  // Curated or dynamic recipe data fallback
  const recipe = meal.recipe || {
    steps: [
      `Rinse and prepare the primary ingredients: ${meal.ingredients.slice(0, 3).join(", ")}.`,
      `Heat a skillet or pot with 1 tsp cold-pressed oil or A2 ghee over medium heat.`,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 pb-5 relative">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase tracking-wide text-xs">
              {meal.type}
            </Badge>
            <Badge className="bg-emerald-800/60 text-white border-none text-xs">
              <ChefHat className="w-3 h-3 mr-1 inline" /> {recipe.difficulty}
            </Badge>
            <Badge className="bg-emerald-800/60 text-white border-none text-xs">
              <Users className="w-3 h-3 mr-1 inline" /> {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
            </Badge>
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {meal.name}
          </DialogTitle>
          <DialogDescription className="text-emerald-100 mt-1 line-clamp-2 text-sm">
            {meal.description}
          </DialogDescription>

          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
            <div>
              <div className="text-xs uppercase text-emerald-200">Prep Time</div>
              <div className="font-bold flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-200" /> {meal.preparationTime}m
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-emerald-200">Calories</div>
              <div className="font-bold flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-300" /> {meal.calories}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-emerald-200">Protein</div>
              <div className="font-bold text-teal-200">{meal.protein}g</div>
            </div>
            <div>
              <div className="text-xs uppercase text-emerald-200">Dosha</div>
              <div className="font-bold text-amber-200 truncate">{meal.suitableDoshas?.join(", ") || "All"}</div>
            </div>
          </div>
        </div>

        {/* Recipe Body */}
        <ScrollArea className="flex-1 p-6 space-y-6">
          {/* Ingredients with checklist */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              Ingredients Checklist
              <span className="text-xs font-normal text-muted-foreground ml-auto">(tap to check off)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing];
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${
                      isChecked
                        ? "bg-primary/10 border-primary/40 text-primary line-through opacity-70"
                        : "bg-card border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${
                        isChecked ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate">{ing}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-primary" />
              Step-by-Step Instructions
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ayurvedic Wisdom & Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ayurvedic Nutrition & Mindful Eating Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-900/80 dark:text-amber-200/80 list-disc list-inside">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
