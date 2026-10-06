import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PatientNavBar from "../components/patient/PatientNavBar";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, Star, Heart, Leaf, Baby, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";
import RecipeDialog from "../components/patient/RecipeDialog";
import { Meal } from "../types/meal";
import { getMealRecipe } from "../data/mealRecipes";

const FindDiet = () => {
  const [selectedRecipeMeal, setSelectedRecipeMeal] = useState<Meal | null>(null);
  const dietRecommendations = [
    {
      title: "Anti-Inflammatory Turmeric Latte",
      category: "Inflammatory Conditions",
      description: "Golden milk with turmeric, ginger, and warming spices to reduce inflammation",
      rating: 4.8,
      suitableFor: ["Arthritis", "Joint Pain", "Digestive Issues"],
      icon: Leaf
    },
    {
      title: "Pregnancy Nutrition Bowl",
      category: "Pregnancy Support", 
      description: "Nutrient-dense meal with folate-rich greens, iron sources, and gentle spices",
      rating: 4.9,
      suitableFor: ["Pregnancy", "Lactation", "Women's Health"],
      icon: Baby
    },
    {
      title: "Allergy-Free Quinoa Salad",
      category: "Food Allergies",
      description: "Gluten-free, nut-free quinoa salad with anti-histamine herbs",
      rating: 4.6,
      suitableFor: ["Gluten Sensitivity", "Nut Allergies", "Seasonal Allergies"],
      icon: Heart
    }
  ];

  const categories = [
    "Pregnancy Support",
    "Food Allergies", 
    "Digestive Issues",
    "Weight Management",
    "Inflammatory Conditions",
    "Diabetes Care",
    "Heart Health",
    "Skin Conditions"
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PatientNavBar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="wellness-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Personalized Diet
            </CardTitle>
            <CardDescription>Search for diet recommendations based on your specific needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input 
                placeholder="Search by condition, allergy, or dietary preference..." 
                className="flex-1"
              />
              <Button className="btn-wellness">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="wellness-card mb-8">
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>Quick access to specialized diet plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diet Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
          {dietRecommendations.map((diet, index) => (
            <Card key={index} className="wellness-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <diet.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{diet.title}</h3>
                        <Badge variant="secondary" className="text-xs">{diet.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(diet.rating)}
                        </div>
                        <span className="text-sm font-medium">{diet.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{diet.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Suitable for:</p>
                      <div className="flex flex-wrap gap-1">
                        {diet.suitableFor.map((condition, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button size="sm" className="btn-wellness">
                        Add to Plan
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const ingredients = diet.title.includes("Turmeric")
                            ? ["Turmeric Root", "Almond Milk", "Ginger", "Black Pepper", "Raw Honey", "Cinnamon"]
                            : diet.title.includes("Pregnancy")
                            ? ["Spinach", "Quinoa", "Lentils", "Avocado", "Pomegranate Seeds", "Sesame Oil"]
                            : ["Quinoa", "Cucumber", "Parsley", "Lemon Juice", "Olive Oil", "Pumpkin Seeds"];

                          setSelectedRecipeMeal({
                            id: `diet-${index}`,
                            name: diet.title,
                            type: "lunch",
                            description: diet.description,
                            ingredients,
                            calories: 220,
                            protein: 10,
                            carbohydrates: 28,
                            fats: 8,
                            preparationTime: 15,
                            tags: [diet.category],
                            suitableDoshas: ["Tridoshic"],
                            explanation: diet.description,
                            recipe: getMealRecipe(`diet-${index}`, diet.title, ingredients, ["Vata", "Pitta", "Kapha"]),
                          });
                        }}
                      >
                        <ChefHat className="w-3.5 h-3.5 mr-1" /> View Recipe
                      </Button>
                      <Button size="sm" variant="outline">
                        Rate Diet
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Chatbot - Right Corner */}
      <Button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-wellness shadow-lg animate-glow"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Recipe Dialog */}
      <RecipeDialog
        meal={selectedRecipeMeal}
        isOpen={!!selectedRecipeMeal}
        onClose={() => setSelectedRecipeMeal(null)}
      />
    </div>
  );
};

export default FindDiet;