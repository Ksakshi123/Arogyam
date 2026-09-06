import re
from typing import List
from app.schemas.chat import MealReplacementOption


ALLERGY_SYNONYMS = {
    "peanut": ["peanut", "peanuts", "groundnut", "groundnuts", "peanut butter", "arachis"],
    "nuts": ["nut", "nuts", "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan"],
    "dairy": ["milk", "cheese", "paneer", "curd", "yogurt", "butter", "ghee", "cream", "whey", "lactose", "dahi"],
    "milk": ["milk", "cheese", "paneer", "curd", "yogurt", "butter", "ghee", "cream", "whey", "lactose", "dahi"],
    "lactose": ["milk", "cheese", "paneer", "curd", "yogurt", "butter", "ghee", "cream", "whey", "lactose", "dahi"],
    "gluten": ["wheat", "gluten", "barley", "rye", "maida", "atta", "semolina", "sooji", "rava"],
    "wheat": ["wheat", "gluten", "maida", "atta", "semolina", "sooji", "rava"],
    "soy": ["soy", "soya", "tofu", "edamame", "soy sauce", "soy milk"],
    "egg": ["egg", "eggs", "albumin", "mayonnaise"],
    "seafood": ["fish", "prawn", "prawns", "shrimp", "crab", "lobster", "salmon", "tuna"],
    "onion": ["onion", "onions", "shallot", "shallots", "scallion"],
    "garlic": ["garlic", "garlic paste"],
}

NON_VEG_KEYWORDS = [
    "chicken", "mutton", "lamb", "beef", "pork", "bacon", "fish", "prawn", "shrimp",
    "crab", "seafood", "meat", "poultry", "tuna", "salmon"
]


def is_ingredient_conflicting(text_to_check: str, forbidden_term: str) -> bool:
    target = forbidden_term.lower().strip()
    source = text_to_check.lower().strip()

    if not target or not source:
        return False

    # Direct substring / regex word boundary check
    escaped = re.escape(target)
    if re.search(rf"\b{escaped}\b", source, re.IGNORECASE):
        return True

    # Synonyms check
    synonyms = ALLERGY_SYNONYMS.get(target, [target])
    for syn in synonyms:
        syn_escaped = re.escape(syn)
        if re.search(rf"\b{syn_escaped}\b", source, re.IGNORECASE):
            return True

    return False


def is_meal_safe_for_patient(
    meal_name: str,
    ingredients: List[str],
    allergies: List[str],
    restrictions: List[str],
    diet_preference: str = "Vegetarian"
) -> bool:
    """
    Deterministically validates a proposed meal against all patient health constraints.
    Returns True if safe, False if any allergen or dietary restriction is violated.
    """
    full_text = f"{meal_name} " + " ".join(ingredients)

    # 1. Allergies validation
    for allergy in allergies or []:
        if is_ingredient_conflicting(full_text, allergy):
            return False

    # 2. Food restrictions validation
    for restriction in restrictions or []:
        if is_ingredient_conflicting(full_text, restriction):
            return False

    # 3. Diet preference validation
    diet_pref = (diet_preference or "").lower()
    if "vegetarian" in diet_pref and "non-vegetarian" not in diet_pref:
        for non_veg in NON_VEG_KEYWORDS:
            if re.search(rf"\b{re.escape(non_veg)}\b", full_text, re.IGNORECASE):
                return False

    if "vegan" in diet_pref:
        # Exclude non-veg and dairy
        for non_veg in NON_VEG_KEYWORDS:
            if re.search(rf"\b{re.escape(non_veg)}\b", full_text, re.IGNORECASE):
                return False
        for dairy_item in ALLERGY_SYNONYMS["dairy"]:
            if re.search(rf"\b{re.escape(dairy_item)}\b", full_text, re.IGNORECASE):
                return False

    return True


def filter_safe_replacements(
    options: List[MealReplacementOption],
    allergies: List[str],
    restrictions: List[str],
    diet_preference: str = "Vegetarian"
) -> List[MealReplacementOption]:
    """
    Filters replacement options, discarding any that violate patient allergies or diet rules.
    """
    safe_options = []
    for opt in options:
        if is_meal_safe_for_patient(
            meal_name=opt.meal_name,
            ingredients=opt.ingredients,
            allergies=allergies,
            restrictions=restrictions,
            diet_preference=diet_preference
        ):
            safe_options.append(opt)
    return safe_options
