import { MealRecipe } from "@/types/meal";

export const mealRecipesMap: Record<string, MealRecipe> = {
  // BREAKFASTS
  b1: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Bring 1 cup of almond milk to a gentle simmer in a small saucepan over medium-low heat.",
      "Add rolled oats, ground cardamom, and cinnamon. Stir continuously for 5-7 minutes until creamy.",
      "Remove from heat and let rest for 2 minutes to thicken.",
      "Transfer to a warm bowl, drizzle with raw honey, and top with peeled, soaked almonds.",
    ],
    tips: [
      "Soaking almonds overnight removes enzyme inhibitors and enhances nutrient assimilation.",
      "Never boil honey; adding it to warm rather than boiling porridge preserves its medicinal enzymes.",
    ],
  },
  b2: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Wash yellow moong dal thoroughly and blend with cumin, green chili, ginger, and turmeric into a smooth batter.",
      "Season with rock salt and finely chopped fresh coriander leaves.",
      "Heat an iron tawa or skillet and brush lightly with A2 cow ghee.",
      "Pour a ladle of batter, spread into a thin circle, and cook on medium heat until golden brown.",
      "Flip and cook the other side for 1-2 minutes until crisp. Serve with mint chutney.",
    ],
    tips: [
      "Moong dal is Tridoshic and considered the premier pulse in Ayurveda for strengthening Agni without aggravating Pitta.",
      "Cook on medium flame to ensure inside is cooked thoroughly for gentle digestion.",
    ],
  },
  b3: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Rinse quinoa under cold water for 1 minute to remove natural saponins.",
      "In a saucepan, bring 1 cup coconut milk and rinsed quinoa to a gentle boil.",
      "Lower the heat, cover, and simmer for 15 minutes until liquid is absorbed and grains are translucent.",
      "Fold in pure maple syrup and top with fresh antioxidant-rich seasonal berries and chia seeds.",
    ],
    tips: [
      "Quinoa is a complete plant protein with all 9 essential amino acids, pacifying both Pitta and Vata.",
      "Adding a pinch of cardamom helps assimilate coconut milk comfortably.",
    ],
  },
  b4: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Rinse thick poha in a colander under running water for 30 seconds and drain completely.",
      "Heat cold-pressed oil in a pan, add mustard seeds and curry leaves until they crackle.",
      "Add raw peanuts and sauté until golden and aromatic.",
      "Toss in finely diced carrots and green peas; cover and cook for 3 minutes.",
      "Add turmeric, salt, and drained poha. Gently toss together over low heat for 2 minutes.",
      "Garnish with freshly squeezed lime juice and chopped cilantro.",
    ],
    tips: [
      "Curry leaves enhance digestion, pacify Kapha, and promote hair & skin vibrancy.",
      "Do not soak poha in water; a quick rinse keeps the grains fluffy.",
    ],
  },
  b5: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Toast multi-grain or sourdough bread until golden and crisp.",
      "In a small bowl, mash ripe avocado with lemon juice, pink rock salt, and toasted sesame seeds.",
      "Spread avocado evenly over warm toast slices.",
      "Lightly steam or sauté a handful of baby spinach leaves and place on top.",
    ],
    tips: [
      "Avocado provides nourishing monounsaturated fats that lubricate dry Vata tissue.",
      "Sesame seeds provide bio-available plant calcium and warming potency.",
    ],
  },
  b6: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Blend soaked chia seeds, unsweetened almond milk, ground cardamom, and saffron threads in a jar.",
      "Whisk well, let sit for 10 minutes, whisk again to break any clumps, and refrigerate for at least 1 hour.",
      "Once set to a pudding consistency, top with fresh pomegranate arils and roasted pistachios.",
    ],
    tips: [
      "Saffron is an adaptogen and sattvic spice that elevates mood and harmonizes all three doshas.",
      "Pomegranate arils provide astringent and sweet tastes that tone the digestive tract.",
    ],
  },
  b7: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Combine fermented idli batter (urad dal and rice) with a pinch of rock salt.",
      "Grease idli steamer moulds with a drop of sesame or coconut oil.",
      "Pour batter into moulds and steam on high for 10-12 minutes until a toothpick inserted comes out clean.",
      "Serve warm with freshly ground coconut-mint chutney and warm vegetable sambar.",
    ],
    tips: [
      "Natural fermentation produces natural prebiotics and B-vitamins that nourish gut flora.",
      "Eat warm to ensure lightness on the stomach.",
    ],
  },
  b8: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Roast semolina (sooji) in 1 tsp ghee until fragrant and slightly pinkish.",
      "In a separate pan, sauté mustard seeds, ginger, curry leaves, grated carrots, and peas.",
      "Add 2.5 cups of boiling water with salt to the vegetables.",
      "Slowly stream in the roasted semolina while stirring vigorously to prevent lumps.",
      "Cover and steam on lowest heat for 3 minutes. Finish with coriander and lemon juice.",
    ],
    tips: [
      "Fresh ginger ignites Agni and prevents any heavy sensation from semolina.",
      "Pair with a warm herbal tea for complete morning hydration.",
    ],
  },
  b9: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "In a high-speed blender, combine soaked pitted dates, plant protein powder, ripe banana, and almond milk.",
      "Add 1/4 tsp organic cinnamon powder to stabilize blood glucose.",
      "Blend on high for 45 seconds until velvety smooth. Pour and enjoy immediately.",
    ],
    tips: [
      "Dates are classified as 'Brimhana' (nourishing and strengthening), ideal for recovery and active lifestyles.",
      "Drink at room temperature rather than ice-cold to protect digestion.",
    ],
  },
  b10: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "In a bowl, mix whole wheat flour, finely grated bottle gourd (lauki), carom seeds (ajwain), and turmeric.",
      "Knead into a soft dough using minimal water (lauki releases its own moisture).",
      "Roll into round parathas and cook on a hot tawa with drops of ghee until speckled golden on both sides.",
    ],
    tips: [
      "Ajwain seeds relieve bloating and soothe the digestive channel.",
      "Lauki is highly alkaline and cooling for the liver and stomach.",
    ],
  },
  b11: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Bring water and milk (or oat milk) to a gentle boil with 1 slice of fresh ginger and 1 crushed cardamom pod.",
      "Add cracked wheat (dalia) and simmer covered on low heat for 12 minutes.",
      "Stir in chopped walnuts and dried figs (anjeer). Sweeten lightly with jaggery.",
    ],
    tips: [
      "Anjeer and walnuts are potent Rasayanas that support brain vitality and reproductive tissue.",
      "Cracked wheat provides slow-release complex carbohydrates that prevent mid-morning crashes.",
    ],
  },
  b12: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Whisk fermented dosa batter with a pinch of salt.",
      "Heat a cast-iron skillet, pour a ladle of batter, and spread into a slightly thick round pancake.",
      "Top with finely chopped capsicum, tomatoes, and grated paneer or tofu.",
      "Drizzle ghee around the edges, cover for 2 minutes until base is golden, then flip gently.",
    ],
    tips: [
      "Capsicum adds mild pungent flavor that stimulates circulation without overheating.",
      "Cast iron cooking naturally fortifies dietary iron intake.",
    ],
  },
  b13: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Whisk 2 pasture-raised eggs (or crumbled organic tofu) with a pinch of turmeric, salt, and black pepper.",
      "Sauté chopped baby spinach and tomatoes in 1 tsp olive oil or ghee until wilted.",
      "Pour eggs over greens and gently fold on low heat until soft curds form. Do not overcook.",
    ],
    tips: [
      "Turmeric and black pepper are synergistic; piperine boosts curcumin bioavailability by up to 2000%.",
      "Soft, warm scrambles are easy to break down for sensitive digestions.",
    ],
  },
  b14: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "In a glass jar, combine rolled oats, chia seeds, oat milk, and a pinch of cinnamon.",
      "Refrigerate overnight (minimum 6 hours).",
      "In the morning, top with sliced seasonal crisp apples and raw walnut halves.",
    ],
    tips: [
      "Cold overnight oats should be brought to room temperature for 15 minutes before consuming to avoid cooling Agni.",
      "Apples contain pectin, a soluble prebiotic fiber that feeds beneficial colon bacteria.",
    ],
  },

  // LUNCHES
  l1: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Wash brown basmati rice and yellow moong dal together until water runs clear.",
      "Heat 1 tbsp ghee in a heavy pot; add cumin seeds, hing (asafoetida), and grated ginger.",
      "Add turmeric, diced carrots, and zucchini; stir for 1 minute.",
      "Add drained rice-dal mix, 4 cups of water, and rock salt.",
      "Bring to a boil, then cover tightly and simmer on low for 25-30 minutes until soft and porridge-like.",
    ],
    tips: [
      "Kitchari is the ultimate healing dish in Panchakarma, resetting digestion and balancing all three doshas.",
      "A dollop of warm ghee on top aids nutrient absorption across the intestinal wall.",
    ],
  },
  l2: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Rinse red split lentils and boil with water, turmeric, and sea salt until completely tender (15 mins).",
      "In a separate small pan, heat ghee or coconut oil; fry mustard seeds, cumin seeds, garlic, and curry leaves.",
      "Add fresh baby spinach to the tempering and cook until wilted (2 mins).",
      "Pour the hot tempering into the cooked dal and stir well.",
      "Serve hot with steamed basmati rice or fresh chapatis.",
    ],
    tips: [
      "The 'Tadka' (tempering) carries lipid-soluble phytonutrients throughout the pulse dish.",
      "Spinach provides plant iron, while lemon juice provides vitamin C to facilitate absorption.",
    ],
  },
  l3: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Soak chickpeas overnight with a pinch of baking soda, then pressure cook with bay leaves and cinnamon.",
      "In a pan, sauté onion, ginger-garlic paste, coriander powder, cumin, and fresh tomato purée until oil separates.",
      "Add cooked chickpeas and 1 cup of cooking broth; simmer on medium for 15 minutes.",
      "Crush a few chickpeas with the back of the spoon to thicken the gravy naturally.",
      "Garnish with ginger juliennes and fresh cilantro.",
    ],
    tips: [
      "Bay leaf and cinnamon mitigate the vata-producing dry nature of chickpeas.",
      "Chickpeas provide robust plant protein and sustained satiety.",
    ],
  },
  l4: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Cook quinoa in 2 cups of water with a pinch of turmeric and salt.",
      "Toss diced paneer or tofu in a pan with cumin powder until golden edges appear.",
      "Steam broccoli florets and zucchini for 4 minutes until vibrant green.",
      "Assemble bowl: warm quinoa base, sautéed paneer/tofu, steamed greens, and a drizzle of tahini-lemon dressing.",
    ],
    tips: [
      "Tahini provides sesame lignans and healthy calcium, grounding Vata energy.",
      "Steam vegetables lightly to preserve both enzymes and vibrant chlorophyll.",
    ],
  },
  l5: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Soak rajma (kidney beans) for 8 hours and boil until tender and creamy.",
      "Make a sauce with cumin, crushed whole spices, onions, tomatoes, and ginger paste.",
      "Simmer the beans in the gravy on low flame for 20 minutes so flavors penetrate the pulse.",
      "Serve with warm aged basmati rice.",
    ],
    tips: [
      "Eat Rajma Chawal at midday when your digestive fire (Pitta) is at its solar peak.",
      "Chew slowly and pair with digestive ginger tea.",
    ],
  },
  l6: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Blanch spinach leaves for 2 minutes, shock in ice water to retain color, and puree with green chili.",
      "Pan-sear paneer cubes in ghee until slightly golden, then set aside in warm salted water.",
      "Sauté garlic, cumin, and onion paste; add tomato and dry spices.",
      "Stir in spinach puree and simmer for 5 minutes. Fold in paneer cubes and a spoon of fresh cream or coconut cream.",
    ],
    tips: [
      "Soaking seared paneer in warm water keeps it soft and melt-in-the-mouth.",
      "Garlic and ginger balance the cold quality of spinach.",
    ],
  },
  l7: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Chop fresh zucchini, bell peppers, carrots, and sweet potato into bite-sized cubes.",
      "Toss with olive oil, rosemary, crushed coriander seeds, rock salt, and black pepper.",
      "Roast on a baking sheet at 200°C (400°F) for 25 minutes until tender and caramelized.",
      "Serve over warm cooked pearl barley or farro.",
    ],
    tips: [
      "Caramelized root vegetables bring sweet, stabilizing earth energy that grounds anxiety and fatigue.",
    ],
  },

  // DINNERS
  d1: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse split yellow moong dal and simmer with water, turmeric, ginger, and cumin powder for 20 minutes.",
      "Whisk dal until creamy and smooth.",
      "In a small ladle, heat 1 tsp ghee, add cumin seeds and hing until they crackle.",
      "Stir the fragrant ghee into the soup. Season with lemon juice and serve warm.",
    ],
    tips: [
      "Moong dal soup is the lightest possible dinner, allowing restful sleep and complete cellular repair overnight.",
      "Finish dinner at least 2.5 to 3 hours before sleep.",
    ],
  },
  d2: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Peel and cube bottle gourd (lauki) and zucchini.",
      "Steam with celery, grated ginger, and black peppercorns until soft.",
      "Puree in a blender until silky. Return to pot and season with pink salt.",
      "Garnish with roasted pumpkin seeds for crunch and zinc.",
    ],
    tips: [
      "Bottle gourd naturally hydrates cells and cools any excess metabolic heat accumulated during daytime.",
    ],
  },
  d3: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Heat sesame oil in a wok; add minced garlic, ginger, and sliced scallions.",
      "Add cubed firm tofu and brown gently on all sides.",
      "Toss in sliced bok choy, snow peas, and carrots; stir-fry on high heat for 3-4 minutes.",
      "Add tamari (gluten-free soy sauce) and toasted sesame seeds. Serve hot.",
    ],
    tips: [
      "Fast stir-frying retains vital vitamins and gives clean, invigorating energy without sluggishness.",
    ],
  },
  d4: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Boil whole brown lentils with bay leaf, carrots, celery, and cumin until soft.",
      "Blend half of the soup for body while leaving half textured.",
      "Finish with fresh lemon zest and chopped parsley.",
    ],
    tips: [
      "Brown lentils provide rich dietary fiber that regulates nighttime bowel motility.",
    ],
  },
  d5: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Roast cauliflower florets and whole garlic cloves in the oven until charred and fragrant.",
      "Simmer roasted cauliflower in vegetable broth with 1/2 cup almond milk and nutmeg.",
      "Blend into a velvety, creamy soup. Garnish with cracked black pepper.",
    ],
    tips: [
      "Nutmeg has natural sedative (Nidra-janaka) properties in Ayurveda, promoting deep, sound sleep.",
    ],
  },
};

export function getMealRecipe(mealId: string, mealName: string, ingredients: string[], doshas?: string[]): MealRecipe {
  if (mealRecipesMap[mealId]) {
    return mealRecipesMap[mealId];
  }

  // Smart fallback recipe generator for any customized or future meal
  const primaryIng = ingredients.slice(0, 3).join(", ");
  return {
    servings: 1,
    difficulty: "Easy",
    steps: [
      `Carefully clean and prepare the fresh ingredients: ${primaryIng}.`,
      `Heat 1 teaspoon of A2 cow ghee or organic cold-pressed oil in a heavy-bottom pan on medium flame.`,
      `Add digestive spices (cumin seeds, turmeric, or fresh ginger) to awaken medicinal aromas.`,
      `Incorporate the prepared ingredients, season with pure Himalayan pink salt, and gently simmer.`,
      `Garnish with freshly chopped garden herbs and consume warm to optimize digestion (Agni).`,
    ],
    tips: [
      "Eat mindfully in a calm environment without screens to maximize digestive secretion.",
      "Avoid cold refrigerated water during and right after eating.",
      `Specifically balancing for ${doshas?.join(" & ") || "all three doshas"}.`,
    ],
  };
}
