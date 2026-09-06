import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, RefreshCw, Check, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";
import PatientNavBar from "../components/patient/PatientNavBar";

const MealPlans = () => {
  const currentMeals = [
    {
      name: "Ayurvedic Breakfast Bowl",
      nutrients: "Fiber, Protein, Minerals, Iron",
      description: "Quinoa porridge with almonds and seasonal fruits",
      goal: "Balance Vata dosha, boost morning energy"
    },
    {
      name: "Spiced Lentil Soup",
      nutrients: "Plant Protein, B-vitamins, Antioxidants", 
      description: "Yellow moong dal with turmeric and cumin",
      goal: "Digestive fire, Pitta balance"
    },
    {
      name: "Herbal Dinner Plate",
      nutrients: "Complex Carbs, Healthy Fats, Minerals",
      description: "Brown rice with seasonal vegetables and ghee",
      goal: "Kapha balance, peaceful sleep"
    }
  ];

  const oldMeals = [
    {
      name: "Week 3 - Detox Plan",
      completion: 92,
      result: "Excellent",
      date: "2 weeks ago"
    },
    {
      name: "Week 2 - Energy Boost",
      completion: 78,
      result: "Good", 
      date: "3 weeks ago"
    },
    {
      name: "Week 1 - Foundation",
      completion: 85,
      result: "Very Good",
      date: "4 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PatientNavBar />

      <div className="container mx-auto px-4 py-8">
        {/* Current Meal Plan */}
        <Card className="wellness-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Current Meal Plan
            </CardTitle>
            <CardDescription>Your personalized Ayurvedic nutrition plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {currentMeals.map((meal, index) => (
                <div key={index} className="p-4 border rounded-xl wellness-card">
                  <h4 className="font-semibold mb-2">{meal.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {meal.nutrients.split(', ').map((nutrient, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{nutrient}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-primary font-medium">Goal: {meal.goal}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button className="btn-wellness flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Change / New
              </Button>
              <Button variant="outline" className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Finalize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Old Meals History */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Meal History
            </CardTitle>
            <CardDescription>Previous meal plans and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oldMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{meal.completion}% Complete</p>
                      <Badge variant={meal.completion >= 90 ? 'default' : meal.completion >= 80 ? 'secondary' : 'outline'}>
                        {meal.result}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chatbot - Right Corner */}
      <Button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-wellness shadow-lg animate-glow"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default MealPlans;