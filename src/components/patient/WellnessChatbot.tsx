import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, RefreshCw, Zap, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbotStore } from "../../store/chatbotStore";
import { usePatientStore } from "../../store/patientStore";
import { useDietStore } from "../../store/dietStore";
import { chatApi } from "../../services/chatApi";
import { DietPlanService } from "../../services/dietPlanService";
import { dietApi } from "../../services/dietApi";
import { ChatMessage, MealReplacementOption } from "../../types/chatbot";
import { Meal } from "../../types/meal";
import { useToast } from "@/hooks/use-toast";

const WellnessChatbot = () => {
  const { isOpen, setIsOpen, messages, addMessage, setMessages } = useChatbotStore();
  const { profile, doshaResult, userId } = usePatientStore();
  const { weeklyPlan, setWeeklyPlan, updateMeal } = useDietStore();
  const { toast } = useToast();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  // Load chat history from PostgreSQL when chatbot opens
  const loadHistory = useCallback(async () => {
    if (!profile) return;
    try {
      const history = await chatApi.getChatHistory(userId || undefined);
      if (history && history.length > 0) {
        // If local store only has default welcome message or empty, restore database history
        const currentCount = useChatbotStore.getState().messages.length;
        if (currentCount <= 1) {
          setMessages(history);
        }
      }
    } catch (err) {
      console.warn("Could not load previous chat history:", err);
    }
  }, [profile, userId, setMessages]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  // Don't render chatbot if patient is not onboarded
  if (!profile) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await chatApi.sendMessage(userText, userId || undefined);
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
        intent: aiResponse.intent,
        target: aiResponse.target,
        replacement_options: aiResponse.replacement_options,
        proposed_changes: aiResponse.proposed_changes,
        requires_confirmation: aiResponse.requires_confirmation,
      };

      addMessage(assistantMsg);
    } catch (err) {
      console.error("Ayu Chatbot error:", err);
      addMessage({
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyReplacement = (opt: MealReplacementOption, targetMealType?: string | null) => {
    if (!weeklyPlan) return;
    
    // Find day index (today's plan or default to day 0)
    const todayStr = new Date().toISOString().split("T")[0];
    let dayIndex = weeklyPlan.days.findIndex(d => d.date === todayStr);
    if (dayIndex < 0) dayIndex = 0;

    const mealTypeKey = (targetMealType?.toLowerCase() || "breakfast") as "breakfast" | "lunch" | "dinner";

    const newMeal: Meal = {
      id: `rep-${Date.now()}`,
      name: opt.meal_name,
      type: mealTypeKey,
      description: opt.description,
      ingredients: opt.ingredients || [],
      calories: opt.calories || 350,
      protein: opt.protein || 15,
      carbohydrates: opt.carbohydrates || 45,
      fats: opt.fats || 10,
      preparationTime: opt.preparation_time || 20,
      suitableDoshas: [doshaResult?.primaryDosha || "Vata"],
      tags: opt.tags || ["Ayurvedic", "Balanced"],
      explanation: opt.dosha_reason || "Balanced replacement option",
    };

    // Update in Zustand & sync to backend
    updateMeal(dayIndex, mealTypeKey, newMeal);

    addMessage({
      id: `confirm-${Date.now()}`,
      role: "assistant",
      content: `Your meal has been updated successfully! I've placed **${opt.meal_name}** into your ${mealTypeKey} for ${weeklyPlan.days[dayIndex].dayOfWeek}.`,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Meal Updated ✨",
      description: `${opt.meal_name} added to your plan.`,
    });
  };

  const handleConfirmGlobalUpdate = async () => {
    if (!profile || !doshaResult) return;
    
    setIsTyping(true);
    addMessage({
      id: `req-${Date.now()}`,
      role: "user",
      content: "Update My Plan",
      timestamp: new Date().toISOString()
    });

    try {
      const activeUid = userId || localStorage.getItem("arogyam_session");
      // 1. Generate new plan respecting updated constraints
      const newPlan = DietPlanService.generateWeeklyPlan(profile, doshaResult, activeUid || undefined);
      setWeeklyPlan(newPlan);

      // 2. Sync to PostgreSQL if backend is active
      if (activeUid && !isNaN(Number(activeUid))) {
        await dietApi.regeneratePlan(activeUid).catch(() => {});
      }

      addMessage({
        id: `ack-${Date.now()}`,
        role: "assistant",
        content: `Your complete weekly plan has been regenerated successfully, tailored to your new preferences while maintaining **${doshaResult.constitution}** balance!`,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Weekly Plan Refreshed 🌿",
        description: "Your 21-meal plan has been completely refreshed.",
      });
    } catch {
      addMessage({
        id: `err-up-${Date.now()}`,
        role: "assistant",
        content: "Could not refresh the weekly plan. Please try again from the diet planner.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl btn-wellness z-50 flex items-center justify-center p-0 hover:scale-105 transition-transform"
          aria-label="Open Ayu Wellness Assistant"
        >
          <Bot className="w-7 h-7 text-white" />
        </Button>
      )}

      {/* Chat Dialogue Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] sm:w-[420px] h-[600px] shadow-2xl flex flex-col z-50 border-primary/20 bg-background overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-glow text-white py-4 px-6 flex flex-row items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Ayu</CardTitle>
                <div className="text-xs text-primary-foreground/90 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                  AI Wellness & Nutrition Assistant
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl p-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted/80 text-foreground rounded-tl-sm border border-border/60 shadow-xs'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      
                      {/* Structured AI Meal Replacement Options */}
                      {msg.intent === "replace_meal" && msg.replacement_options && msg.replacement_options.length > 0 && (
                        <div className="mt-3 space-y-2.5">
                          {msg.replacement_options.map((opt, idx) => (
                            <div key={idx} className="bg-background rounded-xl p-3 border border-border/80 shadow-sm space-y-1.5 hover:border-primary/40 transition-all">
                              <div className="flex justify-between items-start gap-1">
                                <div className="font-semibold text-xs text-foreground leading-tight">{opt.meal_name}</div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                                  {opt.protein}g Protein
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {opt.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground pt-0.5">
                                <span>🔥 {opt.calories} kcal</span>
                                <span>•</span>
                                <span>⏱️ {opt.preparation_time} min</span>
                                {opt.dosha_reason && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary font-medium flex items-center">
                                      <Zap className="w-3 h-3 mr-0.5 text-amber-500" /> {opt.dosha_reason}
                                    </span>
                                  </>
                                )}
                              </div>
                              <Button
                                size="sm"
                                className="w-full h-7 text-xs btn-wellness mt-1 font-medium"
                                onClick={() => handleApplyReplacement(opt, msg.target)}
                              >
                                Select Replacement
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Structured AI Whole Plan Update Confirmation */}
                      {msg.intent === "update_weekly_plan" && msg.requires_confirmation && (
                        <div className="mt-3 p-3 bg-background rounded-xl border border-primary/20 shadow-sm space-y-2">
                          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 text-primary" /> Proposed Plan Adjustments:
                          </div>
                          {msg.proposed_changes && msg.proposed_changes.length > 0 && (
                            <ul className="space-y-1 text-[11px] text-muted-foreground">
                              {msg.proposed_changes.map((ch, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-primary shrink-0" /> {ch}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs bg-muted/50 hover:bg-muted"
                              onClick={() => addMessage({
                                id: `cancel-${Date.now()}`,
                                role: "user",
                                content: "Keep my current plan",
                                timestamp: new Date().toISOString()
                              })}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs btn-wellness"
                              onClick={handleConfirmGlobalUpdate}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" /> Update My Plan
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5 border border-border/50 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">Ayu is thinking</span>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 bg-background border-t">
            <form 
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input 
                placeholder="Ask Ayu about your Dosha, protein, or diet..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background text-xs"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full btn-wellness w-10 h-10 shrink-0 shadow-sm" 
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default WellnessChatbot;
