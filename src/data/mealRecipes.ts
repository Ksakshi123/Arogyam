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
  l8: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Cube sweet potato and toss with olive oil, cumin, and sea salt. Roast at 200°C (400°F) for 20 minutes.",
      "Press firm tofu, cut into cubes, and pan-sear in sesame oil until golden on all sides.",
      "Steam chopped kale lightly for 2 minutes until bright emerald.",
      "Whisk tahini with warm water, lemon juice, and crushed black pepper to make a creamy dressing.",
      "Assemble bowl with warm quinoa, roasted sweet potatoes, seared tofu, and steamed kale. Drizzle with tahini dressing and toasted sesame seeds.",
    ],
    tips: [
      "Quinoa and tofu provide complete plant-based amino acid coverage.",
      "Tahini's healthy sesamin lignans support cellular antioxidant defenses.",
    ],
  },
  l9: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Marinate fish fillets with turmeric powder, salt, and 1 tsp lemon juice for 10 minutes.",
      "Heat coconut oil in a clay pot; crackle mustard seeds, fenugreek seeds, and fresh curry leaves.",
      "Sauté sliced shallots, green chilies, ginger, and garlic until translucent and fragrant.",
      "Add coriander powder, mild Kashmiri chili powder, and fresh thin coconut milk; bring to a gentle simmer.",
      "Gently slide in fish fillets and simmer on low heat for 7-8 minutes. Pour in thick coconut milk and turn off heat immediately.",
      "Serve warm over steamed basmati or brown rice.",
    ],
    tips: [
      "Clay pot cooking enhances alkaline mineral infusion and cooks fish gently without hardening delicate fibers.",
      "Fenugreek seeds pacify Kapha while coconut milk calms Pitta dosha.",
    ],
  },
  l10: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Boil toor dal in a pressure cooker with turmeric, a drop of ghee, and water until soft and mashable.",
      "In a pot, boil drumsticks, shallots, and diced tomatoes with tamarind pulp and sambar powder.",
      "Add the mashed toor dal to the vegetable stew; season with rock salt and simmer for 5-7 minutes.",
      "Prepare Tadka: heat ghee, crackle mustard seeds, cumin, dried red chili, hing (asafoetida), and curry leaves.",
      "Pour hot tadka over bubbling sambar and garnish with fresh coriander.",
      "Steam fermented idlis for 10 minutes and serve warm immersed in fresh sambar.",
    ],
    tips: [
      "Fermentation of idli batter enriches B-complex vitamins and generates gut-friendly lactic acid bacteria.",
      "Drumstick (Moringa) is a premier Ayurvedic superfood that reduces systemic inflammation.",
    ],
  },
  l11: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Soak kabuli chana overnight with a tea bag or dried amla for deep color; pressure cook until tender.",
      "In a heavy pan, heat ghee or mustard oil; sauté cumin seeds, bay leaf, and finely chopped onions until golden brown.",
      "Add ginger-garlic paste, tomato puree, coriander powder, cumin powder, and freshly ground chana masala.",
      "Cook masala until oil releases from the sides, then add cooked chickpeas along with their spiced broth.",
      "Simmer for 15 minutes, lightly mashing a portion of chickpeas to create a naturally thick gravy.",
      "Finish with kasuri methi (dried fenugreek leaves), ginger juliennes, and serve with fresh rotis.",
    ],
    tips: [
      "Adding ginger and hing neutralizes intestinal gas and balances Vata dosha.",
      "High dietary fiber promotes smooth bowel transit and steady glucose release.",
    ],
  },
  l12: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Boil pasture-raised eggs for 9 minutes, peel, and make light slits on each egg.",
      "Heat 1 tsp ghee with a pinch of turmeric and chili; lightly roll eggs in the pan until outer skin is blistered and golden.",
      "In the same pan, sauté finely diced onions, ginger-garlic paste, and green chili until fragrant.",
      "Stir in tomato puree, turmeric, garam masala, and rock salt; cook until thick and aromatic.",
      "Add 1/2 cup warm water, gently submerge eggs into the gravy, and simmer on low for 5 minutes.",
      "Garnish with chopped cilantro and serve with hot steamed rice.",
    ],
    tips: [
      "Eggs provide easily absorbable choline for liver and cognitive vitality.",
      "Cooking eggs in warm spices ensures Agni efficiently breaks down proteins.",
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
      "Preheat oven to 190°C (375°F). Line a baking tray with parchment paper.",
      "Place fresh wild salmon fillets on the tray; season with lemon juice, minced fresh dill, black pepper, and Himalayan pink salt.",
      "Trim woody ends of fresh asparagus and arrange alongside salmon; drizzle lightly with cold-pressed olive oil.",
      "Bake for 12-14 minutes until salmon flakes gently with a fork and asparagus is tender-crisp.",
      "Serve warm with a fresh lemon wedge.",
    ],
    tips: [
      "Wild salmon provides EPA and DHA omega-3s that soothe vascular tension and reduce Pitta inflammation.",
      "Asparagus is a natural diuretic that gently cleanses the urinary tract without depleting electrolytes.",
    ],
  },
  d3: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Spiralize fresh firm zucchini into long noodle ribbons.",
      "In a food processor, blend ripe avocado, fresh basil leaves, pine nuts, lemon juice, garlic, and olive oil into a silky pesto.",
      "Gently toss zucchini noodles in a pan over low heat for 90 seconds just to take the chill off (do not overcook).",
      "Fold in the creamy avocado pesto until noodles are thoroughly coated.",
      "Garnish with toasted pine nuts and cracked black pepper.",
    ],
    tips: [
      "Warm zucchini ribbons preserve digestive fire while avocado provides oleic acid for brain cell regeneration.",
      "Basil aids upper respiratory and digestive circulation.",
    ],
  },
  d4: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Peel and chop carrots, red beets, and sweet potatoes into uniform 1-inch chunks.",
      "Heat olive oil in a soup pot; sauté fresh rosemary and thyme until aromatic.",
      "Add the chopped root vegetables, vegetable broth, and sea salt.",
      "Bring to a boil, reduce heat to low, cover, and gently simmer for 30 minutes until vegetables are fork-tender.",
      "Ladle warm grounding stew into bowls and serve with fresh black pepper.",
    ],
    tips: [
      "Earth and water elements in root vegetables stabilize nervous Vata energy before bedtime.",
      "Beets support gentle liver detoxification pathways during nightly rest.",
    ],
  },
  d5: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Press firm organic tofu to remove moisture; cut into 1-inch cubes.",
      "Heat sesame oil in a wok; add minced garlic, grated ginger, and cubed tofu. Sear until golden on all sides.",
      "Add fresh broccoli florets and 2 tbsp water; cover and steam for 3 minutes until tender-crisp.",
      "Uncover, stir in low-sodium tamari soy sauce, and toss on high flame for 1 minute.",
      "Sprinkle with toasted white sesame seeds and serve immediately.",
    ],
    tips: [
      "Broccoli stimulates liver phase-2 enzymes and clears sluggish Kapha accumulation.",
      "Sesame oil is deeply penetrating and pacifies joint dryness.",
    ],
  },
  d6: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Knead whole wheat flour (atta) with warm water and 1/2 tsp ghee into a pliable, smooth dough; rest for 15 minutes.",
      "In a pan, heat 1 tsp ghee; crackle cumin seeds and add diced seasonal vegetables (such as zucchini, carrots, or French beans).",
      "Season vegetables with turmeric, coriander powder, and pink salt; cover and cook on low heat until tender.",
      "Roll dough balls into thin rounds and cook on a hot cast-iron tawa until puffed and golden brown on both sides.",
      "Brush warm roti lightly with ghee and serve alongside the freshly cooked spiced sabzi.",
    ],
    tips: [
      "Freshly puffed Phulkas are light, warm, and exceptionally easy for evening digestion.",
      "Eating freshly cooked sabzi ensures maximum Prana absorption.",
    ],
  },
  d7: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse red split lentils and boil with water, turmeric, diced tomatoes, and salt until creamy (15 minutes).",
      "In a small pan, heat 1 tsp ghee; sauté minced garlic, cumin seeds, and crushed coriander seeds.",
      "Add chopped fresh spinach to the tempering and cook for 1 minute until wilted.",
      "Pour the spinach tempering directly into the simmering lentil soup and stir gently.",
      "Finish with freshly squeezed lemon juice and serve steaming hot.",
    ],
    tips: [
      "Red lentils dissolve rapidly and are far less gassy than whole pulses, making them ideal for dinner.",
      "Lemon juice vitamin C enhances the assimilation of non-heme spinach iron.",
    ],
  },
  d8: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Cut fresh paneer into thick steaks; rub gently with turmeric, roasted cumin powder, rock salt, and black pepper.",
      "Heat a cast-iron grill pan or skillet with 1 tsp ghee; sear paneer slices for 2 minutes per side until lightly charred.",
      "In another pan, heat olive oil; sauté minced garlic and add washed baby kale and spinach leaves.",
      "Cook greens on medium flame for 2-3 minutes until wilted; season with sea salt and fresh lemon juice.",
      "Plate the warm grilled paneer steaks over the bed of garlic-sautéed greens.",
    ],
    tips: [
      "Paneer provides slow-digesting casein protein that feeds muscles through the overnight fasting period.",
      "Dark leafy greens provide magnesium to support relaxed muscles and restorative sleep.",
    ],
  },
  d9: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Cut skinless chicken breast into bite-sized tender pieces.",
      "Rinse red lentils until water runs clear; set aside.",
      "Heat 1 tbsp cold-pressed oil in a deep pot; sauté cumin seeds, minced ginger, garlic, turmeric, and coriander powder until fragrant.",
      "Add diced carrots, celery, and chicken; sear on medium heat for 4 minutes until chicken changes color.",
      "Pour in red lentils and 3 cups vegetable or bone broth; bring to a boil, then cover and simmer on low for 18 minutes until lentils melt into the soup.",
      "Stir in light coconut milk and simmer for an additional 3 minutes. Do not boil vigorously after adding coconut milk.",
      "Finish with fresh lime juice and chopped fresh cilantro. Serve hot and steaming.",
    ],
    tips: [
      "A classical Anglo-Indian Ayurvedic soup that perfectly balances lean protein with soothing soluble fiber.",
      "Turmeric and ginger break down heavy animal protein structures, making the soup effortless to digest in the evening.",
      "Coconut milk pacifies internal heat (Pitta) and soothes the gastric lining.",
    ],
  },
  d10: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Heat 1 teaspoon of A2 cow ghee or olive oil in a saucepan on medium flame.",
      "Add cumin seeds and a slit green chili; let them crackle and release their aroma.",
      "Add finely chopped onions and sauté until soft and translucent (2 minutes).",
      "Stir in chopped tomatoes, green peas, turmeric powder, and Himalayan pink salt; cook until tomatoes soften.",
      "Add rolled oats and roast with the vegetable masala for 1 minute.",
      "Pour in 1.5 cups of warm water; bring to a gentle boil and simmer for 4-5 minutes, stirring occasionally until porridge reaches desired creamy consistency.",
      "Garnish with freshly chopped coriander leaves and a squeeze of fresh lemon juice before serving warm.",
    ],
    tips: [
      "Masala Oats provides warm beta-glucan soluble fiber that binds excess stomach acids without overloading Agni.",
      "An exceptionally light, comforting dinner choice when you feel slightly fatigued or have mild digestive sluggishness.",
      "The combination of cumin and turmeric counteracts any mucous-forming tendency of oats.",
    ],
  },
  d11: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Cook 1/2 cup quinoa in 1 cup of salted water until fluffy (15 minutes).",
      "Slice the tops off bell peppers, remove seeds and membranes, and steam hollow peppers for 5 minutes to tenderize.",
      "In a skillet, combine cooked quinoa, black beans, sweet corn, ground cumin, and fresh cilantro.",
      "Spoon the warm seasoned filling generously into the prepared bell pepper cavities.",
      "Top with a light sprinkle of grated cheese or nutritional yeast.",
      "Bake in preheated oven at 190°C (375°F) for 15 minutes until peppers are soft and topping is golden.",
    ],
    tips: [
      "Bell peppers contain cooling bioflavonoids that soothe metabolic heat.",
      "Quinoa combined with black beans offers a complete amino acid profile with zero heavy cholesterol.",
    ],
  },
  d12: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Wash pearl barley and yellow split moong dal together; soak in water for 30 minutes, then drain.",
      "Heat 1 tbsp ghee in a pressure cooker or heavy pot; add cumin seeds, grated ginger, and a pinch of hing.",
      "Add drained barley and moong dal; toast in ghee for 2 minutes to release a nutty aroma.",
      "Pour in 4 cups of water, add turmeric and rock salt, and seal.",
      "Pressure cook for 4 whistles on medium flame (or simmer covered in a pot for 35 minutes) until barley is tender and porridge-like.",
      "Garnish with fresh coriander and serve warm with a spoonful of melted ghee.",
    ],
    tips: [
      "Barley (Yava) is celebrated in Charaka Samhita as the finest grain for Kapha, absorbing water and scraping sluggish metabolic toxins (Ama).",
      "Its low glycemic index keeps overnight blood glucose remarkably stable.",
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
