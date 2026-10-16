import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePatientStore } from "../store/patientStore";
import { register } from "@/lib/auth";
import { dbGetSession } from "@/lib/db";
import { ActivityLevel, WellnessGoal, DietPreference, FoodPreference, PatientProfile } from "../types/patient";
import logoImage from "@/assets/arogyam-logo.png";
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

const PatientSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setProfile, setUserId, userId } = usePatientStore();
  const activeUser = userId || dbGetSession();

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Account State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile State
  const [formData, setFormData] = useState<Partial<PatientProfile>>({
    fullName: "",
    age: 26,
    gender: "Female",
    height: 165,
    weight: 60,
    activityLevel: "Moderately Active",
    wellnessGoals: ["Improve Digestion", "Improve Energy"],
    dietPreference: "Vegetarian",
    foodPreferences: ["Prefer Indian Food"],
    allergies: [],
    foodRestrictions: [],
    dislikedFoods: [],
  });

  // If already logged in, keep user on dashboard
  useEffect(() => {
    if (activeUser) {
      navigate("/patient/dashboard", { replace: true });
    }
  }, [activeUser, navigate]);

  if (activeUser) {
    return null;
  }

  const nextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (!formData.fullName?.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const fullProfile: PatientProfile = {
        fullName: formData.fullName || email.split("@")[0],
        age: formData.age || 28,
        gender: formData.gender || "Other",
        height: formData.height || 170,
        weight: formData.weight || 65,
        activityLevel: formData.activityLevel || "Moderately Active",
        wellnessGoals: formData.wellnessGoals || ["General Wellness"],
        dietPreference: formData.dietPreference || "Vegetarian",
        foodPreferences: formData.foodPreferences || ["Prefer Indian Food"],
        allergies: formData.allergies || [],
        foodRestrictions: formData.foodRestrictions || [],
        dislikedFoods: formData.dislikedFoods || [],
      };

      const result = await register(email, password, fullProfile);

      if (!result.success || !result.user) {
        setErrorMsg(result.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      setUserId(result.user.id);
      setProfile(fullProfile);

      toast({
        title: "Account Created! 🎉",
        description: `Welcome to Arogyam, ${fullProfile.fullName}! Let's find your unique Dosha.`,
      });

      navigate("/patient/dosha-assessment", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="border-b pb-3 mb-2">
              <h3 className="text-base font-semibold text-foreground">Step 1: Account & Identity</h3>
              <p className="text-xs text-muted-foreground">Create your secure login and basic profile</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Email Address *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm-password">Confirm Password *</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <Label htmlFor="signup-name">Full Name *</Label>
                <Input
                  id="signup-name"
                  placeholder="e.g. Sakshi Patil"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-age">Age</Label>
                  <Input
                    id="signup-age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-gender">Gender</Label>
                  <select
                    id="signup-gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.gender || "Female"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-height">Height (cm)</Label>
                  <Input
                    id="signup-height"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-weight">Weight (kg)</Label>
                  <Input
                    id="signup-weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-activity">Activity Level</Label>
                  <select
                    id="signup-activity"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                  >
                    <option value="Sedentary">Sedentary (desk job)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days)</option>
                    <option value="Very Active">Very Active (daily workout)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="border-b pb-3 mb-2">
              <h3 className="text-base font-semibold text-foreground">Step 2: Wellness Aspirations</h3>
              <p className="text-xs text-muted-foreground">Select the goals you want Ayurvedic nutrition to target</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(
                [
                  "Weight Management",
                  "Improve Digestion",
                  "Improve Energy",
                  "Better Sleep",
                  "Healthy Lifestyle",
                  "Muscle Support",
                  "Skin Wellness",
                  "General Wellness",
                ] as WellnessGoal[]
              ).map((goal) => {
                const isSelected = formData.wellnessGoals?.includes(goal);
                return (
                  <div
                    key={goal}
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          wellnessGoals: formData.wellnessGoals?.filter((g) => g !== goal),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          wellnessGoals: [...(formData.wellnessGoals || []), goal],
                        });
                      }
                    }}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-medium shadow-sm"
                        : "bg-card border-border hover:bg-muted/40"
                    }`}
                  >
                    <Checkbox id={`goal-${goal}`} checked={isSelected} />
                    <Label htmlFor={`goal-${goal}`} className="flex-1 cursor-pointer text-sm">
                      {goal}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="border-b pb-3 mb-2">
              <h3 className="text-base font-semibold text-foreground">Step 3: Dietary Foundation</h3>
              <p className="text-xs text-muted-foreground">Tailor meal plans to your ethical and culinary preferences</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Primary Diet Preference</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian", "Jain", "Other"] as DietPreference[]).map(
                    (pref) => (
                      <div
                        key={pref}
                        onClick={() => setFormData({ ...formData, dietPreference: pref })}
                        className={`border p-3 rounded-xl text-center cursor-pointer text-sm font-medium transition-all ${
                          formData.dietPreference === pref
                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                            : "bg-card border-border hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        {pref}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="pt-3 border-t">
                <Label className="text-sm font-medium mb-2 block">Regional Cuisines You Enjoy</Label>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    [
                      "Prefer Indian Food",
                      "Prefer Maharashtrian Food",
                      "Prefer South Indian Food",
                      "Prefer North Indian Food",
                      "Open to Different Cuisines",
                    ] as FoodPreference[]
                  ).map((pref) => {
                    const isChecked = formData.foodPreferences?.includes(pref);
                    return (
                      <div
                        key={pref}
                        onClick={() => {
                          if (isChecked) {
                            setFormData({
                              ...formData,
                              foodPreferences: formData.foodPreferences?.filter((p) => p !== pref),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              foodPreferences: [...(formData.foodPreferences || []), pref],
                            });
                          }
                        }}
                        className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked ? "bg-primary/5 border-primary/40 text-primary" : "border-border hover:bg-muted/30"
                        }`}
                      >
                        <Checkbox id={`cuisine-${pref}`} checked={isChecked} />
                        <Label htmlFor={`cuisine-${pref}`} className="cursor-pointer text-sm">
                          {pref}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="border-b pb-3 mb-2">
              <h3 className="text-base font-semibold text-foreground">Step 4: Allergies & Food Safety</h3>
              <p className="text-xs text-muted-foreground">Strict exclusions for automatic recipe filtering</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                Our recipe algorithm guarantees that none of your selected allergens will ever appear in your generated meal
                plans.
              </span>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Select Any Allergies</Label>
              <div className="flex flex-wrap gap-2">
                {["Peanuts", "Dairy", "Gluten", "Soy", "Shellfish", "Eggs", "Tree Nuts", "Mustard", "Sesame"].map(
                  (allergy) => {
                    const isAllergic = formData.allergies?.includes(allergy);
                    return (
                      <button
                        type="button"
                        key={allergy}
                        onClick={() => {
                          const current = formData.allergies || [];
                          if (isAllergic) {
                            setFormData({ ...formData, allergies: current.filter((a) => a !== allergy) });
                          } else {
                            setFormData({ ...formData, allergies: [...current, allergy] });
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isAllergic
                            ? "bg-destructive text-destructive-foreground border-destructive shadow-sm"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {allergy} {isAllergic ? "✕" : "+"}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="pt-2">
              <Label htmlFor="custom-dislikes" className="text-xs text-muted-foreground block mb-1">
                Other ingredients you strictly dislike or avoid (comma separated)
              </Label>
              <Input
                id="custom-dislikes"
                placeholder="e.g. bitter gourd, raw onion, mushrooms"
                value={formData.dislikedFoods?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dislikedFoods: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-wellness flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-xl wellness-card shadow-xl border-border/80">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-block mx-auto hover:opacity-90 transition-opacity">
            <img src={logoImage} alt="Arogyam" className="w-14 h-14 mx-auto mb-2 drop-shadow-sm" />
          </Link>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Begin Your Wellness Journey
          </CardTitle>
          <CardDescription className="text-sm">
            Create your account & personalize your Ayurvedic nutrition profile
          </CardDescription>

          {/* Stepper Progress Bar */}
          <div className="mt-4 pt-2">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1.5">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2 bg-muted/60" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t gap-3">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className="btn-wellness flex items-center gap-1.5 ml-auto">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="btn-wellness flex items-center gap-2 ml-auto shadow-lg"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Complete & Find My Dosha <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Already have an Arogyam account?{" "}
              <Link to="/patient/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSignup;
