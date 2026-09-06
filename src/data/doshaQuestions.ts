import { QuizQuestion } from "../types/dosha";

export const doshaQuestions: QuizQuestion[] = [
  {
    id: "q1",
    category: "Body Frame",
    question: "How would you describe your natural physical frame?",
    options: [
      { id: "o1", text: "Thin, bony, prominent joints, hard to gain weight", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Medium build, proportionate, muscular", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Broad, heavy bone structure, gain weight easily", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q2",
    category: "Skin Characteristics",
    question: "What is your typical skin type?",
    options: [
      { id: "o1", text: "Dry, rough, thin, prone to cracking", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Warm, oily in T-zone, prone to freckles or acne", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Thick, smooth, well-hydrated, slightly oily", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q3",
    category: "Appetite",
    question: "How would you describe your appetite?",
    options: [
      { id: "o1", text: "Irregular, can skip meals easily", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Strong, sharp, get irritable if I miss a meal", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Slow but steady, can easily delay eating", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q4",
    category: "Digestion",
    question: "How is your digestion typically?",
    options: [
      { id: "o1", text: "Irregular, prone to bloating or gas", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Quick, strong, prone to acidity or heartburn", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Slow, heavy feeling after meals", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q5",
    category: "Energy Pattern",
    question: "What is your daily energy level like?",
    options: [
      { id: "o1", text: "Comes in bursts, quickly exhausted", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Moderate and focused, driven", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Slow to start, but steady endurance all day", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q6",
    category: "Sleep Pattern",
    question: "How do you usually sleep?",
    options: [
      { id: "o1", text: "Light, easily interrupted, trouble falling asleep", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Sound sleep, usually 7-8 hours, wake up alert", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Deep, heavy sleep, hard to wake up", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q7",
    category: "Reaction to Stress",
    question: "How do you typically react under stress?",
    options: [
      { id: "o1", text: "Anxious, worried, overwhelmed", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Irritable, frustrated, demanding", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Avoidant, withdrawn, seek comfort", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q8",
    category: "Emotional Tendencies",
    question: "Which emotions do you experience most frequently?",
    options: [
      { id: "o1", text: "Fear, nervousness, excitement", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Anger, ambition, determination", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Attachment, calmness, contentment", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q9",
    category: "Preferred Weather",
    question: "Which weather do you dislike the most?",
    options: [
      { id: "o1", text: "Cold, dry, windy", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Hot, humid, intense sun", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Cold, damp, rainy", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q10",
    category: "Body Temperature Preference",
    question: "How do you usually feel regarding temperature?",
    options: [
      { id: "o1", text: "Often cold, hands and feet get cold easily", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Often warm, sweat easily", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Comfortable, steady, mild sweating", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q11",
    category: "Physical Activity",
    question: "What is your natural pace in daily activities?",
    options: [
      { id: "o1", text: "Fast, always active, sometimes restless", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Purposeful, focused, intense", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Slow, relaxed, methodical", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q12",
    category: "Learning and Memory",
    question: "How do you learn and remember information?",
    options: [
      { id: "o1", text: "Learn quickly but forget quickly", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Learn moderately fast, remember clearly", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Learn slowly but never forget", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q13",
    category: "Speech and Communication",
    question: "How do you typically speak?",
    options: [
      { id: "o1", text: "Fast, talkative, sometimes change topics quickly", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Clear, sharp, precise, articulate", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Slow, calm, soothing, thoughtful", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q14",
    category: "Weight Tendency",
    question: "How does your body typically handle weight?",
    options: [
      { id: "o1", text: "Hard to gain weight, lose it easily", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Easy to gain and lose weight", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Gain weight easily, hard to lose it", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  },
  {
    id: "q15",
    category: "General Lifestyle Pattern",
    question: "Which best describes your routine?",
    options: [
      { id: "o1", text: "Irregular, changes daily, dislike routine", vataScore: 3, pittaScore: 0, kaphaScore: 0 },
      { id: "o2", text: "Structured, planned, goal-oriented", vataScore: 0, pittaScore: 3, kaphaScore: 0 },
      { id: "o3", text: "Consistent, habitual, comfortable with same routine", vataScore: 0, pittaScore: 0, kaphaScore: 3 }
    ]
  }
];
