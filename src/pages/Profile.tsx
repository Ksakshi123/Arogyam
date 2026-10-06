import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";
import { usePatientStore } from "../store/patientStore";
import { AlertTriangle, User, Target, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDietStore } from "../store/dietStore";
import { DietPlanService } from "../services/dietPlanService";
import PatientNavBar from "../components/patient/PatientNavBar";
const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile, doshaResult, userId } = usePatientStore();
  const { setWeeklyPlan } = useDietStore();

  const [allergiesInput, setAllergiesInput] = useState(profile?.allergies?.join(", ") || "");
  const [showWarning, setShowWarning] = useState(false);

  if (!profile) {
    return (
      <div className="min-h-screen gradient-wellness flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSavePreferences = () => {
    const newAllergies = allergiesInput.split(",").map(s => s.trim()).filter(Boolean);
    
    // Check if allergies changed
    const oldAllergiesStr = [...(profile.allergies || [])].sort().join(",");
    const newAllergiesStr = [...newAllergies].sort().join(",");

    if (oldAllergiesStr !== newAllergiesStr) {
      setShowWarning(true);
      updateProfile({ allergies: newAllergies });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved."
      });
    }
  };

  const handleUpdateDietPlan = () => {
    if (profile && doshaResult) {
      // Regenerate plan with new allergies
      const newPlan = DietPlanService.generateWeeklyPlan(profile, doshaResult, userId || undefined);
      setWeeklyPlan(newPlan);
      setShowWarning(false);
      toast({
        title: "Diet Plan Updated",
        description: "Your weekly plan now respects your updated allergy constraints."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PatientNavBar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Your Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your wellness preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Card className="wellness-card border-none bg-card/80">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-background shadow-sm">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{profile.fullName}</h3>
                <p className="text-sm text-muted-foreground">{profile.age} years • {profile.height} cm • {profile.weight} kg</p>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Constitution</span>
                  <span className="font-semibold text-primary">{doshaResult?.constitution || "Pending"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="wellness-card border-none bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {profile.wellnessGoals?.map((goal, i) => (
                    <li key={i} className="text-sm flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="wellness-card border-none bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5 text-primary" /> Dietary Preferences & Constraints
                </CardTitle>
                <CardDescription>Update your allergies to keep your diet plan safe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label>Primary Diet Type</Label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm font-medium">
                    {profile.dietPreference}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Food Allergies (Comma separated)</Label>
                  <Input 
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    placeholder="e.g. Peanuts, Dairy, Shellfish"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Allergies are treated as strict constraints in your generated meal plans.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Other Restrictions</Label>
                  <div className="flex gap-2 flex-wrap">
                    {profile.foodRestrictions?.length > 0 ? profile.foodRestrictions.map((r, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{r}</span>
                    )) : <span className="text-sm text-muted-foreground">None specified</span>}
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-muted/20 border-t py-4">
                <Button className="btn-wellness ml-auto" onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
            
            <div className="flex justify-end">
              <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => {
                navigate("/patient/login");
              }}>
                Sign Out
              </Button>
            </div>
          </div>

        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" /> Important Update
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Your updated allergy preferences may affect your current weekly meal plan. To ensure your safety, we recommend regenerating your diet plan immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowWarning(false)}>
              Keep Current Plan
            </Button>
            <Button onClick={handleUpdateDietPlan} className="bg-orange-600 hover:bg-orange-700 text-white">
              Review and Update Diet Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;