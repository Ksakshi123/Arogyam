const fs = require('fs');
const path = require('path');

const recipes = {
  b1: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Bring 1 cup of almond milk and 1/2 cup of water to a gentle boil in a small saucepan.",
      "Add 1/2 cup rolled oats, crushed cardamom pods, and a pinch of ground cinnamon.",
      "Reduce heat to low and simmer for 5 to 7 minutes, stirring occasionally until thick and creamy.",
      "Remove from heat and let rest for 2 minutes. Stir in 1 tsp pure honey or maple syrup.",
      "Top with 6-8 soaked and sliced almonds before serving warm."
    ],
    tips: [
      "In Ayurveda, soaking almonds overnight and peeling the skin removes phytic acid and makes them easier to digest.",
      "Never cook honey at high heat; always add it once the porridge has cooled slightly below cooking temperature."
    ]
  },
  b2: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse and soak 1 cup yellow moong dal for at least 2 hours or overnight, then drain.",
      "Blend the dal with ginger, cumin seeds, a pinch of turmeric, green chilli, and 1/4 cup water into a smooth batter.",
      "Pour batter into a bowl and stir in finely chopped fresh coriander leaves and rock salt (sendha namak).",
      "Heat a cast-iron skillet or non-stick tawa over medium heat and grease lightly with A2 cow ghee.",
      "Pour a ladleful of batter and spread into a thin round pancake. Cook for 2 minutes until edges lift.",
      "Flip, drizzle a few drops of ghee, and cook the other side until golden-brown and crisp. Serve warm with mint chutney."
    ],
    tips: [
      "Yellow moong dal pacifies Pitta and Kapha. It is considered 'laghu' (light) and 'satvik' in Ayurveda.",
      "Add a pinch of hing (asafoetida) to the batter if you have sensitive digestion or Vata imbalance."
    ]
  },
  b3: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse 1/2 cup quinoa thoroughly under cold running water in a fine-mesh strainer to remove saponins.",
      "In a medium pot, combine quinoa, 1 cup light coconut milk, and 1/2 cup water.",
      "Bring to a boil, then lower flame, cover tightly, and simmer for 15 minutes until liquid is absorbed.",
      "Remove lid, fluff with a fork, and stir in 1 tbsp pure maple syrup and 1/2 tsp vanilla extract.",
      "Divide into bowls and garnish with fresh blueberries, raspberries, and a sprinkle of chia seeds."
    ],
    tips: [
      "Quinoa is a complete plant protein containing all nine essential amino acids.",
      "Coconut milk brings a cooling Virya (potency) that balances internal heat for Pitta constitutions."
    ]
  },
  b4: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Place 1.5 cups medium-thick poha (flattened rice) in a colander. Rinse gently under water for 30 seconds, drain completely and let sit for 5 minutes.",
      "Heat 1 tbsp cold-pressed groundnut oil or ghee in a pan. Add 1/2 tsp mustard seeds and let them crackle.",
      "Add raw peanuts and fry on low flame until crunchy and golden.",
      "Add curry leaves, sliced green chillies, finely chopped carrots, and green peas. Sauté for 3-4 minutes.",
      "Stir in 1/2 tsp turmeric powder and rock salt to taste.",
      "Gently add the softened poha, fold everything together, cover with a lid on low heat for 2 minutes, and finish with fresh lemon juice and chopped cilantro."
    ],
    tips: [
      "Turmeric and curry leaves stimulate 'Deepana' (digestive fire) without overheating the stomach.",
      "Always serve poha freshly prepared and warm; reheated poha can be heavy and dry for Vata."
    ]
  },
  b5: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Wash and roughly chop 2 cups of fresh baby spinach.",
      "In a bowl, beat 2-3 organic eggs with a pinch of pink Himalayan salt and fresh cracked black pepper.",
      "Heat 1 tsp extra virgin olive oil or ghee in a skillet over low-medium heat.",
      "Add spinach and cook for 60 seconds until gently wilted.",
      "Pour in beaten eggs. Using a spatula, gently push eggs from edges toward the center to form soft, creamy curds.",
      "Remove from heat while eggs are still soft and glossy. Serve immediately with warm sourdough or toasted roti."
    ],
    tips: [
      "Cooking eggs gently on low heat retains their moisture and makes them easier on digestion.",
      "Fresh black pepper boosts assimilation of nutrients and aids the breakdown of proteins."
    ]
  },
  b6: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "In a mixing bowl, combine 1 cup chickpea flour (besan), finely diced onion, tomatoes, and green chilli.",
      "Crush 1/2 tsp carom seeds (ajwain) between your palms and add to the bowl along with chopped cilantro, turmeric, and salt.",
      "Whisk in 3/4 cup water gradually to form a smooth, lump-free pouring batter.",
      "Heat a tawa on medium, grease with a drop of mustard or sesame oil, and pour a ladle of batter.",
      "Spread evenly, cook for 2 minutes until bubbles appear, flip, and cook until golden spots develop on both sides."
    ],
    tips: [
      "Ajwain (carom seeds) is essential when cooking with chickpea flour as it neutralizes gas and bloating.",
      "Besan is naturally high in soluble fiber, which keeps blood sugar levels balanced throughout the morning."
    ]
  },
  b7: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Dry roast 1/2 cup foxtail millet in a pan for 2-3 minutes until warm and fragrant; set aside.",
      "Heat 1 tbsp ghee in a pot. Splutter mustard seeds, cumin seeds, curry leaves, and grated ginger.",
      "Add chopped carrots, green beans, and peas. Sauté for 3 minutes.",
      "Add 1.5 cups water and salt, and bring to a rolling boil.",
      "Slowly pour the roasted millet while stirring continuously to prevent clumps.",
      "Cover and simmer on low heat for 12-15 minutes until the millet is tender and water is fully absorbed.",
      "Rest covered for 5 minutes, fluff gently, and garnish with fresh coriander and grated coconut."
    ],
    tips: [
      "Millets are alkaline, tridoshic, and produce sustainable slow-burning energy.",
      "Ghee balances the slightly dry nature (Ruksha) of millets, making it ideal for daily consumption."
    ]
  },
  b8: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Soak 4-5 walnut halves and 2 pitted Medjool dates in warm water for 15 minutes.",
      "Peel 1 ripe banana and break into pieces.",
      "Add banana, soaked walnuts, dates, 1 cup almond milk, 1/4 tsp ground cardamom, and a pinch of cinnamon to a high-speed blender.",
      "Blend on high for 60-90 seconds until completely smooth, silky, and frothy.",
      "Pour into a tall glass and sprinkle crushed walnuts on top. Drink at room temperature."
    ],
    tips: [
      "Ayurveda recommends drinking smoothies at room temperature rather than ice-cold to preserve your Agni (digestive fire).",
      "Cardamom aids digestion of banana and prevents mucus accumulation."
    ]
  },
  b9: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "In a small bowl, mix 3 tbsp finger millet (ragi) flour with 1/2 cup room temperature water until completely dissolved without lumps.",
      "Bring 1 cup of water to a boil in a heavy-bottomed pot.",
      "Pour the ragi slurry into the boiling water while whisking constantly on low heat.",
      "Cook for 5-6 minutes until the porridge turns glossy and thickens.",
      "Stir in 2 tbsp organic jaggery powder and 1/4 tsp crushed cardamom powder.",
      "Turn off flame, stir in 1/2 cup warm coconut milk and 1/2 tsp ghee. Serve warm."
    ],
    tips: [
      "Ragi (Nachni) is exceptional for bone density and stamina due to its high natural calcium content.",
      "Never boil coconut milk vigorously; stir it in at the very end to preserve beneficial medium-chain fats."
    ]
  },
  b10: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "In a wide dessert bowl or mason jar, spoon 1/2 cup of creamy, strained Greek yogurt.",
      "Scatter a tablespoon of chia seeds and roasted flaxseeds over the yogurt layer.",
      "Add a generous handful of fresh blueberries or blackberries.",
      "Drizzle 1 tsp raw organic honey over the fruit.",
      "Top with 2 tablespoons of whole grain rolled oats granola for a crunchy finish. Enjoy fresh."
    ],
    tips: [
      "Greek yogurt provides bioavailable probiotic cultures that nurture your gut microbiome.",
      "Ayurveda advises eating yogurt during daylight hours and balancing it with warming seeds and spices."
    ]
  },
  l1: {
    servings: 3,
    difficulty: "Easy",
    steps: [
      "Wash 1/2 cup basmati rice and 1/2 cup yellow split moong dal together until water runs clear. Soak for 20 minutes.",
      "Heat 1.5 tbsp pure cow ghee in a pressure cooker or heavy pot. Add cumin seeds, a small cinnamon stick, bay leaf, and freshly grated ginger.",
      "Add diced carrots, green beans, and 1/2 tsp turmeric powder. Sauté for 2 minutes.",
      "Drain and add the soaked rice and lentils. Gently sauté for 1 minute so the grains are coated in ghee.",
      "Add 4 cups water and 1 tsp rock salt. Stir well.",
      "If using a pressure cooker, cook for 3-4 whistles on medium. If using a pot, cover and simmer for 25 minutes until soft and porridge-like.",
      "Stir well, drizzle 1 tsp fresh ghee, and garnish with fresh cilantro."
    ],
    tips: [
      "Khichdi is the foundation of Ayurvedic rejuvenation (Panchakarma) as it cleanses Ama (toxins) while giving full nutrition.",
      "Ghee acts as a Yogavahi (catalytic agent) that carries the medicinal qualities of spices deep into tissues."
    ]
  },
  l2: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Cut 200g firm paneer into bite-sized cubes. Dice 1 bell pepper and 1 small red onion into square chunks.",
      "In a bowl, mix 3 tbsp hung curd, 1/2 tsp turmeric, 1 tsp coriander powder, 1/2 tsp garam masala, 1 tsp lemon juice, and salt to make marinade.",
      "Coat paneer and vegetable chunks evenly in the marinade. Let rest for 15 minutes.",
      "Meanwhile, cook 1/2 cup rinsed quinoa in 1 cup water with a pinch of salt until fluffy (approx 15 minutes).",
      "Thread paneer and vegetables onto skewers or place on a greased grill pan over medium-high heat.",
      "Grill for 8-10 minutes, turning periodically until edges are charred and fragrant.",
      "Serve hot grilled paneer tikka over the bed of warm fluffy quinoa with a lemon wedge."
    ],
    tips: [
      "Paneer is a sattvic food that strengthens Ojas (vital immunity) and builds Dhatus (bodily tissues).",
      "Quinoa balances the richness of paneer by supplying high dietary fiber and all essential amino acids."
    ]
  },
  l3: {
    servings: 3,
    difficulty: "Easy",
    steps: [
      "Rinse 3/4 cup toor dal (split pigeon peas) and pressure cook with 2.5 cups water, 1/2 tsp turmeric, and salt for 4 whistles until tender. Whisk lightly.",
      "Cook brown rice: simmer 1 cup brown rice in 2.5 cups water for 35 minutes until tender; let steam rest.",
      "For tadka (tempering): Heat 1.5 tbsp ghee in a pan. Add 1 tsp cumin seeds and let them sizzle.",
      "Add 4 cloves minced garlic and sauté until light golden and aromatic.",
      "Add 1 finely chopped tomato and 1 chopped green chilli. Cook until tomatoes turn soft and pulpy.",
      "Pour the cooked dal into the tempering, bring to a gentle simmer for 3-4 minutes, adjust salt and water consistency.",
      "Finish with fresh coriander and serve piping hot over brown rice."
    ],
    tips: [
      "Tempering (Tadka) releases fat-soluble phytochemicals from spices directly into ghee for maximum therapeutic effect.",
      "Brown rice provides enduring complex carbs that prevent post-lunch fatigue."
    ]
  },
  l4: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Season 200g chicken breast fillets with cumin powder, turmeric, black pepper, and lemon juice.",
      "Heat 1 tbsp cold-pressed oil in a grill pan over medium heat. Grill chicken for 5-6 minutes per side until cooked through and nicely browned. Let rest for 5 minutes before slicing.",
      "In a large bowl, combine fresh mixed greens, diced seedless cucumber, and halved cherry tomatoes.",
      "Prepare dressing: Whisk together 2 tbsp creamy tahini, 1 tbsp fresh lemon juice, 2 tbsp warm water, garlic powder, and sea salt until smooth.",
      "Arrange the greens in bowls, top with sliced warm chicken breast, and drizzle generously with lemon-tahini dressing."
    ],
    tips: [
      "Tahini (sesame paste) provides healthy calcium, magnesium, and healthy fats that balance lean chicken.",
      "Lemon juice activates digestive enzymes and assists in the efficient breakdown of animal protein."
    ]
  },
  l5: {
    servings: 3,
    difficulty: "Medium",
    steps: [
      "Soak 1 cup chickpeas overnight and boil until fork-tender (or use organic cooked chickpeas).",
      "Peel and dice 1 large sweet potato into bite-sized cubes.",
      "Heat 1 tbsp coconut oil in a Dutch oven. Sauté 1 diced onion, 2 cloves minced garlic, and 1 tsp grated ginger for 4 minutes.",
      "Add 1 tbsp mild curry powder, 1/2 tsp ground cumin, and 1/2 tsp coriander powder. Toast spices for 30 seconds.",
      "Add sweet potato cubes, cooked chickpeas, 1 cup coconut milk, and 1 cup vegetable broth.",
      "Bring to a simmer, cover, and cook on low heat for 20 minutes until sweet potatoes are buttery soft.",
      "Stir in 2 cups baby spinach and let wilt for 2 minutes. Season with salt and cilantro. Serve with warm whole wheat rotis."
    ],
    tips: [
      "Sweet potatoes have a Madhura (sweet) taste and Guru (grounding) quality that deeply pacifies aggravated Vata.",
      "Coconut milk buffers strong spices, making this curry soothing for Pitta and gentle on the gut lining."
    ]
  },
  l6: {
    servings: 3,
    difficulty: "Medium",
    steps: [
      "Soak 1 cup dried red kidney beans (rajma) overnight for 8-10 hours in ample water.",
      "Rinse and pressure cook with 3.5 cups water, 1 bay leaf, and 1 black cardamom for 6-8 whistles until completely soft.",
      "Heat 1.5 tbsp ghee in a pot. Sauté 1 tsp cumin seeds, then add 1 cup finely pureed onions. Cook until golden brown.",
      "Add 1 tbsp ginger-garlic paste and sauté for 1 minute. Add 1.5 cups fresh tomato puree, turmeric, chili powder, and coriander powder.",
      "Cook the masala until ghee separates from the sides of the pan.",
      "Add the boiled rajma along with its cooking broth. Mash a few beans with the back of a spoon to thicken the gravy.",
      "Simmer on low flame for 20 minutes to allow the flavors to penetrate the beans. Serve with fluffy basmati rice."
    ],
    tips: [
      "Cooking rajma with ginger, hing, and black cardamom breaks down complex oligosaccharides and prevents digestive discomfort.",
      "The combination of Rajma and Chawal provides a balanced amino acid profile matching animal protein quality."
    ]
  },
  l7: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Blanch 250g fresh washed spinach leaves in boiling water for 2 minutes, then plunge into ice water to preserve bright green color.",
      "Puree the blanched spinach with 1 green chilli and 1/2 inch ginger into a smooth velvet paste.",
      "Heat 1 tbsp ghee in a pan. Splutter 1 tsp cumin seeds and sauté 1 finely chopped onion and 4 cloves minced garlic until fragrant.",
      "Add 1 chopped tomato and cook until soft. Stir in 1/2 tsp coriander powder and salt.",
      "Pour in the vibrant spinach puree and simmer on low for 5 minutes. Stir in 2 tbsp fresh cream or cashew cream.",
      "Gently fold in 150g fresh paneer cubes and warm through for 2-3 minutes.",
      "Serve warm alongside soft whole wheat rotis or parathas."
    ],
    tips: [
      "Spinach is packed with bioavailable iron, magnesium, and chlorophyll that purify the Rakta Dhatu (blood tissue).",
      "Adding a touch of dairy fat (ghee/cream) enhances absorption of fat-soluble vitamins A, D, E, and K."
    ]
  },
  l8: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Preheat oven to 200°C (400°F). Press 200g firm tofu dry with a towel and cut into bite-sized cubes. Toss with 1 tbsp olive oil, 1 tbsp tamari, and garlic powder.",
      "Peel and dice 1 sweet potato. Toss with oil, salt, and pepper.",
      "Spread tofu and sweet potato cubes on a baking sheet. Roast for 25 minutes, turning halfway, until golden and crisp.",
      "Rinse and cook 1/2 cup quinoa in 1 cup water until tender (15 minutes). Steam chopped kale leaves for 3 minutes.",
      "Whisk 2 tbsp tahini, 1 tbsp lemon juice, 2 tbsp water, and sea salt into a smooth dressing.",
      "Assemble bowls: Add warm quinoa base, arrange baked tofu, roasted sweet potato, and steamed kale in vibrant sections.",
      "Drizzle with lemon-tahini dressing and garnish with toasted sesame seeds."
    ],
    tips: [
      "Tofu is an easily absorbed plant protein that strengthens muscle tissue without clogging micro-circulatory channels.",
      "Sesame seeds provide zinc and healthy fats, nourishing the reproductive and nervous systems (Shukra & Majja)."
    ]
  },
  l9: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Marinate 300g fresh fish steaks (such as pomfret, rohu, or cod) with 1/2 tsp turmeric, lemon juice, and salt for 10 minutes.",
      "Heat 1.5 tbsp coconut oil in a clay pot or skillet. Splutter 1/2 tsp mustard seeds, 1 sprig fresh curry leaves, and 1 sliced shallot.",
      "Add 1 tsp minced ginger, 1 slit green chilli, 1 tsp Kashmiri red chilli powder, and 1 tsp coriander powder. Sauté for 30 seconds.",
      "Add 1 chopped tomato and 1/2 cup water. Simmer until tomatoes disintegrate into a rich gravy.",
      "Pour in 3/4 cup thick coconut milk and bring to a gentle simmer (do not let it boil vigorously).",
      "Gently place marinated fish pieces into the sauce. Cover and cook on low heat for 7-8 minutes until fish is tender and flaky.",
      "Rest for 5 minutes before serving alongside warm steamed rice."
    ],
    tips: [
      "Fish provides clean, light protein and anti-inflammatory omega-3 fatty acids that soothe joint stiffness.",
      "Coconut oil and curry leaves are cooling agents that balance the heating nature of fish."
    ]
  },
  l10: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Steam fermented idli batter in an idli steamer for 10-12 minutes until soft, spongy, and toothpick comes out clean.",
      "For Sambar: Cook 1/2 cup toor dal with turmeric and 2 cups water until soft and mashable.",
      "In a separate pot, cook 1 drumstick cut into pieces, 1 small onion, and 1 tomato in 1.5 cups water until tender.",
      "Add 2 tbsp tamarind extract, 1.5 tbsp sambar masala, and rock salt to the vegetables. Boil for 5 minutes.",
      "Combine the mashed cooked dal into the tamarind-vegetable broth and simmer for another 5 minutes.",
      "Tempering: In a small pan, heat 1 tsp oil, add mustard seeds, dry red chillies, curry leaves, and a pinch of hing. Pour over sambar.",
      "Serve piping hot sambar with warm, fluffy idlis."
    ],
    tips: [
      "Fermented foods like idli enhance digestive fire (Agni) and synthesize beneficial B-vitamins in the gut.",
      "Drumsticks (moringa pods) are a revered Ayurvedic superfood known for cleansing lymphatic pathways."
    ]
  },
  l11: {
    servings: 3,
    difficulty: "Medium",
    steps: [
      "Soak 1 cup white chickpeas (kabuli chana) for 8 hours with a tea bag (for rich authentic dark color). Cook in pressure cooker for 5-6 whistles.",
      "Heat 1.5 tbsp cold-pressed oil in a heavy pot. Add cumin seeds, 1 black cardamom, and 1 cinnamon stick.",
      "Add 1 cup finely grated onions and cook until deep golden brown (approx 8 minutes).",
      "Stir in 1 tbsp ginger-garlic paste, 1 cup tomato puree, 1.5 tbsp chole masala, turmeric, and dry mango powder (amchur).",
      "Cook until oil separates. Add boiled chickpeas along with some of the cooking water.",
      "Simmer uncovered on medium-low for 15 minutes, crushing a few chickpeas against the pot wall to create a thick gravy.",
      "Garnish with julienned ginger, fresh green chillies, and cilantro. Serve with warm whole wheat rotis."
    ],
    tips: [
      "Amchur (dried green mango) imparts a tart digestive spark that activates pancreatic enzymes.",
      "Cooking chickpeas with whole warming spices balances their natural astringent (Kashaya) qualities."
    ]
  },
  l12: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Boil 4 organic eggs for 9 minutes, then transfer to ice water, peel, and pierce gently with a fork.",
      "Heat 1 tbsp oil in a pan with a pinch of turmeric and chilli powder. Pan-fry the eggs for 2 minutes until blistered golden.",
      "In the same pan, sauté cumin seeds, 1 cup finely chopped onions until caramelized.",
      "Add 1 tbsp ginger-garlic paste and sauté for 1 minute. Add 2 pureed tomatoes, coriander powder, cumin powder, and garam masala.",
      "Cook until the masala is thick and glossy. Add 3/4 cup warm water and simmer for 5 minutes.",
      "Add the golden eggs and spoon the rich gravy over them. Simmer for 3 minutes to infuse.",
      "Garnish with chopped cilantro and serve with hot basmati rice."
    ],
    tips: [
      "Eggs provide high biological value protein with balanced amino acids for muscle and tissue repair.",
      "Turmeric and ginger in the curry neutralize any dampness and make the egg protein easy to assimilate."
    ]
  },
  d1: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Wash 1/2 cup split green mung beans thoroughly and soak for 30 minutes.",
      "Add soaked mung beans to a pot with 3.5 cups water, 1/2 tsp turmeric powder, and 1 tsp grated ginger. Bring to a boil.",
      "Lower heat, cover partially, and simmer for 25 minutes until beans are completely soft and broken down.",
      "Whisk soup lightly to create a smooth, comforting consistency. Season with rock salt.",
      "In a small pan, heat 1 tsp ghee, add 1/2 tsp cumin seeds and a pinch of freshly cracked black pepper. Sizzle for 20 seconds.",
      "Pour the fragrant ghee tempering into the soup, stir in fresh coriander, and serve warm in deep bowls."
    ],
    tips: [
      "Split green mung is the most gentle legume in Ayurveda; it cleanses without creating any intestinal gas.",
      "Having a warm light soup for dinner allows digestive organs to fully rest during restorative sleep cycles."
    ]
  },
  d2: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Preheat oven to 190°C (375°F). Line a baking tray with parchment paper.",
      "Trim the woody ends off 1 bunch of fresh asparagus. Arrange on the baking tray.",
      "Place 2 salmon fillets (approx 150g each) next to the asparagus.",
      "Drizzle everything with 1 tbsp extra virgin olive oil and fresh lemon juice.",
      "Season with sea salt, freshly cracked black pepper, and finely chopped fresh dill weed.",
      "Bake for 12-15 minutes until salmon flakes easily with a fork and asparagus is tender-crisp.",
      "Serve immediately with an extra lemon wedge on the side."
    ],
    tips: [
      "Salmon is rich in anti-inflammatory EPA and DHA fatty acids that nourish neural pathways and lubricate joints.",
      "Asparagus is a natural mild diuretic (Mutravirechaniya) that helps prevent evening water retention."
    ]
  },
  d3: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Spiralize 2 medium fresh zucchinis into long noodles using a spiralizer or julienne peeler. Place on a kitchen towel to absorb excess moisture.",
      "Prepare pesto: In a food processor, blend 1 ripe avocado, 1 cup fresh basil leaves, 2 tbsp toasted pine nuts, 1 small clove garlic, 1 tbsp lemon juice, and 2 tbsp olive oil until creamy.",
      "Heat 1 tsp olive oil in a wide skillet over medium-high heat.",
      "Add zucchini noodles and flash-sauté for just 90 seconds (do not overcook or they will release water).",
      "Remove pan from heat immediately, fold in the avocado pesto, and season with sea salt.",
      "Serve warm or at room temperature garnished with extra pine nuts and cracked pepper."
    ],
    tips: [
      "Zucchini is exceptionally cooling (Sheeta) and light (Laghu), relieving internal heat from Pitta.",
      "Avocado provides nourishing monounsaturated fats that calm the nervous system without heaviness."
    ]
  },
  d4: {
    servings: 3,
    difficulty: "Easy",
    steps: [
      "Peel and chop 2 carrots, 1 medium beet, and 2 small golden potatoes into uniform 1-inch chunks.",
      "Heat 1 tbsp olive oil or ghee in a heavy pot over medium heat.",
      "Add 1 diced onion and 2 minced garlic cloves; cook until soft and translucent.",
      "Add chopped carrots, beets, and potatoes. Sauté for 3 minutes.",
      "Pour in 3 cups low-sodium vegetable broth, 1 sprig fresh rosemary, and 2 sprigs fresh thyme.",
      "Bring to a boil, cover, reduce heat to low, and simmer for 30 minutes until vegetables are meltingly tender.",
      "Discard herb stems, season with sea salt and cracked black pepper. Ladle into warm bowls."
    ],
    tips: [
      "Root vegetables grow underground, absorbing dense minerals that provide grounding energy to unstable Vata.",
      "Beets stimulate liver bile production, aiding nighttime metabolic cleansing."
    ]
  },
  d5: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Press 200g firm tofu dry and slice into bite-sized rectangles. Cut 1 head of broccoli into small florets.",
      "Heat 1 tbsp toasted sesame oil in a wok or large skillet over high heat.",
      "Add tofu cubes and sear for 3-4 minutes until crispy and golden on all sides; set aside on a plate.",
      "Add 1 tbsp grated ginger and 2 minced garlic cloves to the wok; stir-fry for 20 seconds.",
      "Add broccoli florets and 2 tbsp water. Stir-fry for 3-4 minutes until broccoli turns vibrant green and tender-crisp.",
      "Return tofu to the wok. Pour in 1.5 tbsp tamari (or low-sodium soy sauce) and 1 tsp rice vinegar.",
      "Toss vigorously for 1 minute until coated. Sprinkle toasted sesame seeds and serve warm."
    ],
    tips: [
      "Broccoli has astringent and bitter tastes (Tikta & Kashaya) that pacify sluggish Kapha dosha.",
      "Fresh ginger counteracts the cool nature of vegetables and speeds up nighttime digestion."
    ]
  },
  d6: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Knead 1 cup whole wheat flour with warm water and 1/2 tsp ghee into a pliable, smooth dough. Rest for 10 minutes.",
      "For Sabzi: Heat 1 tbsp ghee in a pan. Add cumin seeds, turmeric, and coriander powder.",
      "Add 2 cups chopped seasonal vegetables (such as zucchini, green beans, or bottle gourd/lauki).",
      "Cover and cook on low heat for 12-15 minutes in their own steam until tender. Season with rock salt.",
      "Roll small balls of dough into thin circular rotis. Cook on a hot tawa until bubbles appear, flip, and cook until puffed.",
      "Brush rotis with a few drops of ghee and serve fresh alongside the light vegetable sabzi."
    ],
    tips: [
      "Freshly puffed rotis made from stone-ground whole wheat are easy on digestion and provide steady fiber.",
      "Bottle gourd and mild seasonal vegetables protect against acid reflux and promote tranquil sleep."
    ]
  },
  d7: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse 3/4 cup red lentils (masoor dal) thoroughly until water is clear.",
      "Heat 1 tbsp olive oil or ghee in a soup pot. Sauté 1 diced onion, 2 minced garlic cloves, and 1 tsp grated ginger for 3 minutes.",
      "Add 1 diced tomato, 1/2 tsp cumin powder, 1/2 tsp turmeric powder, and 1/2 tsp coriander powder.",
      "Add the red lentils and 3.5 cups vegetable broth or water. Bring to a boil.",
      "Lower heat, cover, and simmer for 15-20 minutes until lentils have completely softened into a soup.",
      "Stir in 2 cups of fresh baby spinach leaves and let wilt into the soup for 2 minutes.",
      "Season with sea salt, squeeze fresh lemon juice, and garnish with fresh cilantro."
    ],
    tips: [
      "Red lentils cook rapidly without prior soaking and are much lighter on the evening stomach than whole pulses.",
      "Spinach paired with vitamin C from lemon juice significantly boosts plant iron absorption."
    ]
  },
  d8: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Cut 200g firm paneer into thick steaks. Season with rock salt, cracked black pepper, and a pinch of turmeric.",
      "Heat 1 tsp olive oil or ghee in a grill pan over medium heat. Sear paneer for 2-3 minutes per side until golden grill marks form; set aside.",
      "In the same pan, heat another tsp of olive oil and add 2 cloves thinly sliced garlic. Sauté for 30 seconds.",
      "Add 3 cups washed seasonal greens (combination of baby spinach, kale, and chard).",
      "Sauté greens for 2-3 minutes until wilted and tender.",
      "Squeeze fresh lemon juice over the greens and season with sea salt.",
      "Serve the warm grilled paneer steaks over the fragrant bed of sautéed greens."
    ],
    tips: [
      "Paneer supplies casein protein which digests slowly over the night, preventing late-night hunger pangs.",
      "Garlic and lemon cut through dairy richness, ensuring smooth digestive transit."
    ]
  },
  d9: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Dice 150g skinless chicken breast into small bite-sized cubes. Rinse 1/3 cup red lentils.",
      "Heat 1 tbsp ghee or coconut oil in a pot. Sauté cumin seeds, 1 diced onion, 2 cloves garlic, and 1 tsp ginger for 4 minutes.",
      "Add 1 tsp mild curry powder, 1/2 tsp ground coriander, and 1/2 tsp turmeric powder; toast for 30 seconds.",
      "Add chicken cubes and cook for 3 minutes until exterior turns white.",
      "Add red lentils, 3 cups chicken or vegetable broth, and bring to a boil.",
      "Reduce heat to low, cover, and simmer for 20 minutes until lentils are soft and chicken is tender.",
      "Stir in 1/4 cup light coconut milk and simmer for 2 more minutes.",
      "Finish with a squeeze of fresh lime juice and chopped fresh cilantro."
    ],
    tips: [
      "Mulligatawny soup originates from South Indian 'Milagu-tannir' (pepper water), renowned for clearing respiratory congestion.",
      "Light chicken broth combined with lentils offers therapeutic warmth for seasonal transitions."
    ]
  },
  d10: {
    servings: 1,
    difficulty: "Easy",
    steps: [
      "Heat 1 tsp ghee or oil in a saucepan. Add 1/2 tsp cumin seeds and 1 slit green chilli.",
      "Add 1/4 cup finely chopped onions, 1/4 cup tomatoes, and 2 tbsp green peas. Sauté for 3 minutes.",
      "Add 1/4 tsp turmeric powder, 1/4 tsp garam masala, and rock salt.",
      "Add 1/2 cup rolled oats and toast with vegetables for 1 minute.",
      "Pour in 1.25 cups water. Bring to a boil, reduce flame to medium-low, and cook for 4-5 minutes stirring continuously.",
      "Once oatmeal reaches a rich savory consistency, turn off heat.",
      "Garnish with chopped cilantro and enjoy warm."
    ],
    tips: [
      "Savory oats are gentle on the glycemic index and prevent overnight spikes in cortisol or blood glucose.",
      "Adding cumin and turmeric balances the damp, cooling nature of oats."
    ]
  },
  d11: {
    servings: 2,
    difficulty: "Medium",
    steps: [
      "Preheat oven to 190°C (375°F). Cut 2 large bell peppers in half lengthwise and scoop out seeds and membranes.",
      "Cook 1/3 cup rinsed quinoa in 2/3 cup water with a pinch of salt for 15 minutes until tender.",
      "In a skillet, heat 1 tsp oil and sauté diced onions, 1/2 cup black beans, 1/4 cup corn kernels, and 1/2 tsp cumin for 3 minutes.",
      "Combine cooked quinoa with the black bean mixture and season with salt and pepper.",
      "Pack the quinoa-bean stuffing generously into each hollowed pepper half.",
      "Place stuffed peppers in a baking dish, add 2 tbsp water to the base of the dish, and top with a sprinkle of cheese.",
      "Cover with foil and bake for 25 minutes, then uncover and bake for 10 more minutes until peppers are tender."
    ],
    tips: [
      "Bell peppers provide massive amounts of vitamin C, an antioxidant that fortifies cellular health during sleep.",
      "Black beans and quinoa together form a complete amino acid profile while keeping dietary cholesterol at zero."
    ]
  },
  d12: {
    servings: 2,
    difficulty: "Easy",
    steps: [
      "Rinse 1/3 cup pearl barley and 1/3 cup yellow moong dal together. Soak in warm water for at least 1 hour.",
      "Heat 1 tbsp ghee in a pressure cooker or heavy soup pot. Add 1 tsp cumin seeds and 1 tsp freshly grated ginger.",
      "Drain and add the barley and moong dal. Sauté gently for 1 minute.",
      "Add 1/2 tsp turmeric powder, rock salt, and 3.5 cups water.",
      "If using pressure cooker: cook for 4-5 whistles on medium flame. If using a pot: cover and simmer on low for 35-40 minutes until barley is soft and chewy.",
      "Whisk gently to combine the comforting porridge.",
      "Drizzle 1/2 tsp ghee, sprinkle fresh cracked black pepper and cilantro, and serve warm."
    ],
    tips: [
      "Barley (Yava) is revered in Charaka Samhita as the premier grain for balancing Kapha, purifying fat tissue, and stabilizing blood sugar.",
      "Its gentle drying (Ruksha) quality relieves sluggishness and morning heaviness."
    ]
  }
};

const mealsFilePath = path.join(__dirname, '../src/data/meals.ts');
let content = fs.readFileSync(mealsFilePath, 'utf8');

// Parse through content and add recipe to each meal object
// Each meal has id: "xxx",
for (const [id, recipe] of Object.entries(recipes)) {
  const recipeStr = `\n    recipe: ${JSON.stringify(recipe, null, 6).replace(/\n/g, '\n    ')},`;
  // find id: "${id}",
  // We want to insert recipe before the closing of that meal object
  // Find where id: "${id}" is, then find the end of that object or after explanation: "..."
  const idPattern = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?)(explanation:\\s*"[^"]*")`, 'g');
  if (idPattern.test(content)) {
    content = content.replace(idPattern, `$1$2,${recipeStr}`);
  } else {
    console.warn(`Could not find explanation for ${id}`);
  }
}

fs.writeFileSync(mealsFilePath, content, 'utf8');
console.log('Successfully injected all 34 recipes into src/data/meals.ts');
