import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";
import { usePatientStore } from "../store/patientStore";
import { login, register } from "@/lib/auth";
import { dbSaveDoshaAssessment, dbGetLatestDoshaAssessment } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowRight, Sparkles, Lock, Mail } from "lucide-react";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserId, loadFromDB } = usePatientStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success || !result.user) {
        setErrorMsg(result.error || "Invalid email or password. Please check and try again.");
        setIsLoading(false);
        return;
      }

      setUserId(result.user.id);
      loadFromDB(result.user.id);

      toast({
        title: "Welcome Back!",
        description: `Signed in successfully as ${result.user.email}`,
      });

      navigate("/patient/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while signing in.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo login for fast exploration
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");

    const demoEmail = "demo@arogyam.com";
    const demoPass = "arogyam123";

    // Try login first
    let res = await login(demoEmail, demoPass);
    if (!res.success) {
      // Auto-register demo account if not created yet
      await register(demoEmail, demoPass, {
        fullName: "Aarav Sharma",
        age: 29,
        gender: "Male",
        height: 175,
        weight: 68,
        activityLevel: "Moderately Active",
        wellnessGoals: ["Improve Digestion", "Improve Energy", "Muscle Support"],
        dietPreference: "Vegetarian",
        foodPreferences: ["Prefer Indian Food", "Prefer Maharashtrian Food"],
        allergies: [],
      });
      res = await login(demoEmail, demoPass);
    }

    if (res.success && res.user) {
      const existingAssessment = dbGetLatestDoshaAssessment(res.user.id);
      if (!existingAssessment) {
        dbSaveDoshaAssessment({
          userId: res.user.id,
          vata: 25,
          pitta: 50,
          kapha: 25,
          primaryDosha: "Pitta",
          secondaryDosha: "Kapha",
          constitution: "Pitta-Kapha",
          assessedAt: new Date().toISOString(),
        });
      }
      setUserId(res.user.id);
      loadFromDB(res.user.id);
      toast({
        title: "Demo Mode Active 🌿",
        description: "Logged in as Aarav Sharma with sample wellness data.",
      });
      navigate("/patient/dashboard");
    } else {
      setErrorMsg("Could not initialize demo profile.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-md wellness-card shadow-xl border-border/80">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-block mx-auto hover:opacity-90 transition-opacity">
            <img src={logoImage} alt="Arogyam" className="w-16 h-16 mx-auto mb-2 drop-shadow-sm" />
          </Link>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Patient Portal
          </CardTitle>
          <CardDescription>Sign in to access your personalized wellness & diet plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{errorMsg}</p>
                {errorMsg.includes("No account") && (
                  <Link to="/patient/signup" className="underline font-medium text-xs mt-1 block">
                    Click here to create an account →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Mail className="w-3.5 h-3.5 text-primary" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full btn-wellness flex items-center justify-center gap-2">
              {isLoading ? "Authenticating..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or Explore Instant Demo</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleDemoLogin}
            className="w-full border-primary/40 hover:bg-primary/10 text-primary font-medium flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Explore with Demo Account (Aarav Sharma)
          </Button>

          <div className="text-center pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/patient/signup" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLogin;