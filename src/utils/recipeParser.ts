import { convertToGrams, scaleValue } from "./unitConverter";

export interface ParsedIngredient {
  original: string;
  amount: number;
  unit: string;
  ingredient: string;
  scaledAmount: number;
}

export interface ParsedRecipe {
  ingredients: ParsedIngredient[];
  instructions: string;
  scaledInstructions: string;
}

// Parse a single ingredient line
function parseIngredientLine(line: string): ParsedIngredient | null {
  // Helpers: sanitize bullets, normalize unicode fractions, and extract grams in parentheses
  const replaceUnicodeFractions = (input: string) => {
    const map: Record<string, string> = {
      '½': '1/2',
      '¼': '1/4',
      '¾': '3/4',
      '⅓': '1/3',
      '⅔': '2/3',
      '⅛': '1/8',
      '⅜': '3/8',
      '⅝': '5/8',
      '⅞': '7/8',
      '⅕': '1/5',
      '⅖': '2/5',
      '⅗': '3/5',
      '⅘': '4/5',
      '⅙': '1/6',
      '⅚': '5/6',
      '⅐': '1/7',
      '⅑': '1/9',
      '⅒': '1/10',
    };
    let out = input;
    for (const [k, v] of Object.entries(map)) {
      out = out.split(k).join(v);
    }
    return out;
  };

  const sanitizeLine = (input: string) => {
    // Remove common leading bullets/checkboxes and excess whitespace
    return input
      .replace(/^\s*[•▢\-\*\u2022]+\s*/u, '')
      .replace(/\s+\(/g, ' (') // ensure space before parentheses for readability
      .trim();
  };

  const trimmed = replaceUnicodeFractions(sanitizeLine(line));
  if (!trimmed) return null;

  // If the line contains grams in parentheses, e.g., "(113g)", capture it
  const gramsMatch = trimmed.match(/\((\s*\d+\.?\d*)\s*g\s*\)/i);

  // Match patterns like: "2 cups flour", "1/2 cup sugar", "3 eggs", "2.5 tablespoons butter", "1 1/3 cups flour"
  const pattern = /^(\d+\.?\d*|\d*\/\d+|\d+\s+\d+\/\d+)\s*([a-zA-Z]+)?\s+(.+)$/;
  const match = trimmed.match(pattern);

  if (match) {
    let amount = 0;
    const amountStr = match[1].trim();

    // Handle fractions / mixed numbers
    if (amountStr.includes('/')) {
      const parts = amountStr.split(/\s+/);
      if (parts.length === 2) {
        // Mixed fraction like "1 1/2"
        const whole = parseFloat(parts[0]);
        const [num, denom] = parts[1].split('/').map(parseFloat);
        amount = whole + num / denom;
      } else {
        // Simple fraction like "1/2"
        const [num, denom] = amountStr.split('/').map(parseFloat);
        amount = num / denom;
      }
    } else {
      amount = parseFloat(amountStr);
    }

    let unit = match[2] || '';
    let ingredient = match[3].trim();

    // If grams were specified in parentheses, prefer that for precise scaling
    if (gramsMatch) {
      const gramsVal = parseFloat(gramsMatch[1]);
      unit = 'g';
      amount = gramsVal;
      ingredient = ingredient.replace(/\((\s*\d+\.?\d*)\s*g\s*\)/i, '').trim();
    }

    return {
      original: trimmed,
      amount,
      unit,
      ingredient,
      scaledAmount: amount,
    };
  }

  // If no match but grams are present, use them directly
  if (gramsMatch) {
    const gramsVal = parseFloat(gramsMatch[1]);
    const ingredient = trimmed.replace(/\((\s*\d+\.?\d*)\s*g\s*\)/i, '').trim();
    return {
      original: trimmed,
      amount: gramsVal,
      unit: 'g',
      ingredient,
      scaledAmount: gramsVal,
    };
  }

  // If no match, return the line as-is (for items without measurements)
  return {
    original: trimmed,
    amount: 0,
    unit: '',
    ingredient: trimmed,
    scaledAmount: 0,
  };
}

// Parse ingredients text
export function parseIngredients(text: string): ParsedIngredient[] {
  const lines = text.split('\n');
  const ingredients: ParsedIngredient[] = [];
  
  for (const line of lines) {
    const parsed = parseIngredientLine(line);
    if (parsed) {
      ingredients.push(parsed);
    }
  }
  
  return ingredients;
}

// Scale ingredients
export function scaleIngredients(
  ingredients: ParsedIngredient[],
  multiplier: number
): ParsedIngredient[] {
  console.log('Scaling with multiplier:', multiplier);
  return ingredients.map((ingredient) => {
    if (ingredient.amount === 0) {
      return ingredient; // Keep non-measurable items as-is
    }
    
    const gramsOriginal = convertToGrams(ingredient.amount, ingredient.unit);
    const gramsScaled = scaleValue(gramsOriginal, multiplier);
    
    console.log(`Ingredient: ${ingredient.ingredient}, Original: ${ingredient.amount} ${ingredient.unit}, Grams: ${gramsOriginal}, Scaled: ${gramsScaled}`);
    
    return {
      ...ingredient,
      scaledAmount: gramsScaled,
    };
  });
}

// Scale instructions (find and scale numbers in instructions)
export function scaleInstructions(instructions: string, multiplier: number): string {
  // Match patterns like "8-inch pan", "350°F", "30 minutes", etc.
  const pattern = /(\d+\.?\d*)\s*(inch|inches|cm|centimeters|minutes?|mins?|hours?|hrs?|°F|°C|degrees?)/gi;
  
  return instructions.replace(pattern, (match, num, unit) => {
    const value = parseFloat(num);
    const scaled = scaleValue(value, multiplier);
    return `${scaled} ${unit}`;
  });
}

// Parse complete recipe
export function parseRecipe(
  ingredientsText: string,
  instructionsText: string,
  multiplier: number = 1
): ParsedRecipe {
  const ingredients = parseIngredients(ingredientsText);
  const scaledIngredients = scaleIngredients(ingredients, multiplier);
  const scaledInstructions = scaleInstructions(instructionsText, multiplier);
  
  return {
    ingredients: scaledIngredients,
    instructions: instructionsText,
    scaledInstructions,
  };
}
