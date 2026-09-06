import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Info, ChefHat } from "lucide-react";
import { Meal } from "../../types/meal";
import { motion } from "framer-motion";

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
  onViewRecipe?: (meal: Meal) => void;
  isCompleted?: boolean;
}

const MealCard = ({ meal, onClick, onViewRecipe, isCompleted }: MealCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className={`wellness-card cursor-pointer h-full relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${isCompleted ? 'border-primary/50 opacity-80' : ''}`}
        onClick={onClick}
      >
        {isCompleted && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg z-10">
            COMPLETED
          </div>
        )}
        <div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="mb-2 capitalize border-primary/30 text-primary bg-primary/5">
                {meal.type}
              </Badge>
            </div>
            <CardTitle className="text-xl leading-tight text-foreground/90">{meal.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-4">
              {meal.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] uppercase">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{meal.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-primary">{meal.protein}g</span>
                <span>Protein</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{meal.preparationTime} mins prep</span>
              </div>
            </div>
            
            {meal.explanation && (
              <div className="mt-4 flex items-start gap-2 bg-accent/20 p-3 rounded-lg text-xs">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground italic line-clamp-2">{meal.explanation}</p>
              </div>
            )}
          </CardContent>
        </div>

        {onViewRecipe && (
          <div className="px-6 pb-5 pt-0 mt-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium border-primary/30 hover:bg-primary/10 hover:text-primary text-primary transition-all flex items-center justify-center gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onViewRecipe(meal);
              }}
            >
              <ChefHat className="w-3.5 h-3.5" />
              View Step-by-Step Recipe
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MealCard;
