import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "../store/patientStore";
import { useDietStore } from "../store/dietStore";
import { motion } from "framer-motion";

const DoshaResult = () => {
  const navigate = useNavigate();
  const { profile, doshaResult } = usePatientStore();

  useEffect(() => {
    if (!doshaResult) {
      navigate("/patient/onboarding");
    }
  }, [doshaResult, navigate]);

  if (!doshaResult) return null;

  return (
    <div className="min-h-screen gradient-wellness py-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-bold">Your Wellness Constitution</h1>
          <p className="text-muted-foreground text-lg">
            Hi {profile?.fullName?.split(" ")[0] || "there"}, here is your Ayurvedic profile.
          </p>
        </div>

        <Card className="wellness-card border-none shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
              <div className="text-center md:text-left space-y-4">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Constitution Type</h2>
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600 pb-2">
                  {doshaResult.constitution}
                </div>
                <p className="text-muted-foreground max-w-md">
                  Your profile shows a stronger {doshaResult.primaryDosha} influence 
                  {doshaResult.secondaryDosha ? ` with a significant ${doshaResult.secondaryDosha} influence` : ''}. 
                  Your wellness recommendations will focus on maintaining balance while considering these characteristics.
                </p>
              </div>
            </div>

            {/* Circular Rings Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { name: "Vata", percent: doshaResult.vata, color: "var(--vata)", bg: "dosha-vata" },
                { name: "Pitta", percent: doshaResult.pitta, color: "var(--pitta)", bg: "dosha-pitta" },
                { name: "Kapha", percent: doshaResult.kapha, color: "var(--kapha)", bg: "dosha-kapha" }
              ].map((dosha, index) => (
                <div key={dosha.name} className="flex flex-col items-center">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <motion.circle 
                        cx="80" cy="80" r="70" fill="transparent" 
                        stroke={`hsl(${dosha.color})`} strokeWidth="8"
                        strokeDasharray="440"
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * dosha.percent) / 100 }}
                        transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{dosha.percent}%</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-widest">{dosha.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t pt-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Wellness Focus Areas</h3>
                <ul className="space-y-3">
                  {[
                    "Maintain regular meal timing to ground energy",
                    "Favor warm, cooked, nourishing foods",
                    "Keep a consistent sleep schedule",
                    "Include moderate, steady exercise"
                  ].map((focus, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl flex flex-col justify-center items-center text-center">
                <h3 className="font-medium mb-2">Ready to transform your routine?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Based on your constitution, preferences, and {profile?.allergies?.length || 0} dietary restrictions, 
                  we have prepared your ideal wellness plan.
                </p>
                <Button 
                  onClick={() => {
                    useDietStore.getState().reset();
                    navigate("/patient/meal-plan");
                  }} 
                  className="btn-wellness w-full"
                >
                  Generate My Personalized Weekly Plan
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoshaResult;
