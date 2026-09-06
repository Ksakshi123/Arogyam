import { ChatMessage, ChatIntent } from "../types/chatbot";
import { Meal, WeeklyMealPlan } from "../types/meal";
import { PatientProfile } from "../types/patient";
import { DoshaResult } from "../types/dosha";
import { DietPlanService } from "./dietPlanService";

export class ChatbotService {
  /**
   * Simulates an AI intent parser and response generator.
   */
  public static async processMessage(
    message: string, 
    context: { profile: PatientProfile, dosha: DoshaResult, weeklyPlan: WeeklyMealPlan }
  ): Promise<ChatMessage> {
    const text = message.toLowerCase();
    
    // 1. Check for Global Plan Update (e.g., "avoid dairy", "more protein")
    if (text.includes("avoid") || text.includes("don't want") || text.includes("higher protein") || text.includes("more protein")) {
      return this.handleGlobalUpdate(message);
    }
    
    // 2. Check for Single Meal Replacement (e.g., "don't have oats", "replace monday breakfast")
    if (text.includes("don't have") || text.includes("replace") || text.includes("alternative")) {
      return this.handleMealReplacement(message, context);
    }

    // Default general response
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: "I understand. I am here to help you personalize your wellness journey. Would you like to swap a specific meal, or regenerate your entire weekly plan?",
      timestamp: new Date().toISOString(),
      intent: "general_inquiry"
    };
  }

  private static handleMealReplacement(text: string, context: { profile: PatientProfile, dosha: DoshaResult, weeklyPlan: WeeklyMealPlan }): ChatMessage {
    // Determine target day and meal type from context or text (Simulated)
    // For prototype, we'll pick the first meal in the plan or look for keywords
    
    const targetDay = context.weeklyPlan.days[0].date;
    let targetType: "breakfast" | "lunch" | "dinner" = "breakfast";
    let mealToReplace = context.weeklyPlan.days[0].breakfast;

    if (text.toLowerCase().includes("lunch")) {
      targetType = "lunch";
      mealToReplace = context.weeklyPlan.days[0].lunch;
    } else if (text.toLowerCase().includes("dinner")) {
      targetType = "dinner";
      mealToReplace = context.weeklyPlan.days[0].dinner;
    }

    const alternatives = DietPlanService.getAlternatives(mealToReplace, context.profile, context.dosha);

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `I can help you replace your ${targetType}. Here are some suitable alternatives that match your ${context.dosha.constitution} dosha and dietary constraints.`,
      timestamp: new Date().toISOString(),
      intent: "replace_meal",
      structuredData: {
        targetMeal: mealToReplace.id,
        targetDay: targetDay,
        suggestedMeals: alternatives
      }
    };
  }

  private static handleGlobalUpdate(text: string): ChatMessage {
    // Simulate detecting a global preference change
    const detectedChanges: string[] = [];
    if (text.toLowerCase().includes("dairy")) detectedChanges.push("Avoid Dairy");
    if (text.toLowerCase().includes("protein")) detectedChanges.push("Increase Protein");
    if (text.toLowerCase().includes("gluten")) detectedChanges.push("Gluten Free");

    if (detectedChanges.length === 0) detectedChanges.push("Adjust plan based on new preferences");

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `I understand you want to change your diet. I can update your complete weekly plan according to these preferences: \n\n- ${detectedChanges.join('\n- ')}\n\nWould you like me to regenerate the entire plan?`,
      timestamp: new Date().toISOString(),
      intent: "update_weekly_plan",
      structuredData: {
        planChangesSummary: detectedChanges,
        isConfirmation: true
      }
    };
  }
}
