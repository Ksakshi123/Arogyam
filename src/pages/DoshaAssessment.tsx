import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "../store/patientStore";
import { doshaQuestions } from "../data/doshaQuestions";
import { RuleBasedDoshaPredictionService } from "../services/doshaService";
import { motion, AnimatePresence } from "framer-motion";

const DoshaAssessment = () => {
  const navigate = useNavigate();
  const setDoshaResult = usePatientStore((state) => state.setDoshaResult);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const question = doshaQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / doshaQuestions.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    // Build updated answers including this selection (state update is async)
    const updatedAnswers = { ...answers, [question.id]: optionId };
    setAnswers(updatedAnswers);
    
    // Auto advance after slight delay
    setTimeout(() => {
      if (currentQuestionIndex < doshaQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Pass the complete updated answers directly to avoid stale-state bug
        handleComplete(updatedAnswers);
      }
    }, 400);
  };

  const handleComplete = (finalAnswers?: Record<string, string>) => {
    setIsCalculating(true);
    // Use provided finalAnswers (avoids async state issue on last question)
    const answersToUse = finalAnswers ?? answers;
    const result = RuleBasedDoshaPredictionService.calculateDosha(answersToUse);
    setDoshaResult(result);
    // Small timeout just for the animation to show briefly
    setTimeout(() => {
      navigate("/patient/dosha-result");
    }, 600);
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen gradient-wellness flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">Ayurveda</span>
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-center">Understanding your wellness profile...</h2>
        <p className="text-muted-foreground mt-2">Analyzing your dosha constitution.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-wellness flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestionIndex + 1} of {doshaQuestions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Card className="w-full max-w-2xl wellness-card overflow-hidden">
        <CardHeader>
          <CardDescription className="text-primary font-medium tracking-wider uppercase">
            {question.category}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="min-h-[350px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <CardTitle className="text-2xl leading-relaxed">
                {question.question}
              </CardTitle>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                      answers[question.id] === option.id 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/10'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        
        <div className="p-6 border-t flex justify-between bg-card/50">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>
          
          <span className="text-sm text-muted-foreground flex items-center">
            Ayurvedic Assessment
          </span>
        </div>
      </Card>
      
      <p className="mt-8 text-xs text-muted-foreground max-w-md text-center opacity-70">
        Disclaimer: This assessment is for wellness and educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional for medical conditions.
      </p>
    </div>
  );
};

export default DoshaAssessment;
