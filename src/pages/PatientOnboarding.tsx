import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePatientStore } from "../store/patientStore";
import { useDietStore } from "../store/dietStore";
import { ActivityLevel, WellnessGoal, DietPreference, FoodPreference, PatientProfile } from "../types/patient";

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const setProfile = usePatientStore((state) => state.setProfile);
  const setDoshaResult = usePatientStore((state) => state.setDoshaResult);
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<Partial<PatientProfile>>({
    fullName: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    activityLevel: "Moderately Active",
    wellnessGoals: [],
    dietPreference: "Vegetarian",
    foodPreferences: [],
    allergies: [],
    foodRestrictions: [],
    dislikedFoods: []
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    // Clear any previous user's diet plan & dosha assessment
    useDietStore.getState().reset();
    setDoshaResult(null);
    // Save to store
    setProfile(formData as PatientProfile);
    // Move to dosha assessment (Phase 3)
    navigate("/patient/dosha-assessment");
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-semibold">Step 1: Personal Information</h3>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                placeholder="e.g. Sakshi"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number" 
                  value={formData.age || ""} 
                  onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Gender (Optional)</Label>
                <Input 
                  value={formData.gender || ""} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.height || ""} 
                  onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input 
                  type="number" 
                  value={formData.weight || ""} 
                  onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Activity Level</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.activityLevel}
                onChange={(e) => setFormData({...formData, activityLevel: e.target.value as ActivityLevel})}
              >
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-semibold">Step 2: Wellness Goals</h3>
            <p className="text-sm text-muted-foreground mb-4">Select all that apply.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(["Weight Management", "Improve Digestion", "Improve Energy", "Better Sleep", "Healthy Lifestyle", "Muscle Support", "Skin Wellness", "General Wellness"] as WellnessGoal[]).map(goal => (
                <div key={goal} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent/20 transition-colors">
                  <Checkbox 
                    id={goal} 
                    checked={formData.wellnessGoals?.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({...formData, wellnessGoals: [...(formData.wellnessGoals || []), goal]});
                      } else {
                        setFormData({...formData, wellnessGoals: formData.wellnessGoals?.filter(g => g !== goal)});
                      }
                    }}
                  />
                  <Label htmlFor={goal} className="flex-1 cursor-pointer">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-semibold">Step 3: Diet Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label>Primary Diet Preference</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {(["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian", "Jain", "Other"] as DietPreference[]).map(pref => (
                    <div 
                      key={pref}
                      onClick={() => setFormData({...formData, dietPreference: pref})}
                      className={`border p-3 rounded-lg text-center cursor-pointer transition-all ${formData.dietPreference === pref ? 'bg-primary/10 border-primary text-primary font-medium' : 'hover:bg-accent/20'}`}
                    >
                      {pref}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <Label>Food Preferences</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {(["Prefer Indian Food", "Prefer Maharashtrian Food", "Prefer South Indian Food", "Prefer North Indian Food", "Open to Different Cuisines"] as FoodPreference[]).map(pref => (
                    <div key={pref} className="flex items-center space-x-2 p-2">
                      <Checkbox 
                        id={pref}
                        checked={formData.foodPreferences?.includes(pref)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, foodPreferences: [...(formData.foodPreferences || []), pref]});
                          } else {
                            setFormData({...formData, foodPreferences: formData.foodPreferences?.filter(p => p !== pref)});
                          }
                        }}
                      />
                      <Label htmlFor={pref} className="cursor-pointer">{pref}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-semibold">Step 4: Allergies & Restrictions</h3>
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg text-sm mb-4">
              <strong>Note:</strong> We treat allergies as strict constraints when generating meal recommendations.
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Common Allergies to Avoid</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Peanuts", "Dairy", "Gluten", "Soy", "Shellfish", "Eggs", "Tree Nuts"].map(allergy => (
                    <div 
                      key={allergy}
                      onClick={() => {
                        const current = formData.allergies || [];
                        if (current.includes(allergy)) {
                          setFormData({...formData, allergies: current.filter(a => a !== allergy)});
                        } else {
                          setFormData({...formData, allergies: [...current, allergy]});
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${formData.allergies?.includes(allergy) ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-background hover:bg-accent/20'}`}
                    >
                      {allergy} {formData.allergies?.includes(allergy) && "✕"}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Additional Restrictions or Disliked Foods (comma separated)</Label>
                <Input 
                  placeholder="e.g. Mushrooms, Olives, Spicy food"
                  value={formData.foodRestrictions?.join(", ") || ""}
                  onChange={(e) => {
                    const vals = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                    setFormData({...formData, foodRestrictions: vals});
                  }}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl wellness-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to Arogyam</CardTitle>
          <CardDescription>Let's personalize your wellness journey.</CardDescription>
          
          <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="min-h-[400px] flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>
          
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={nextStep} className="btn-wellness">
                Next
              </Button>
            ) : (
              <Button onClick={handleFinish} className="btn-wellness bg-primary">
                Complete Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOnboarding;
