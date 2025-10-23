// Unit conversion utilities for recipe scaling
// Using standard average densities for MVP

interface UnitConversion {
  toGrams: (value: number) => number;
  fromGrams: (value: number) => number;
}

// Standard densities in g/ml or g/unit
const UNIT_CONVERSIONS: Record<string, UnitConversion> = {
  // Volume to weight (using water/flour average density ~0.5g/ml for dry, 1g/ml for liquids)
  cup: {
    toGrams: (value) => value * 120, // ~120g for general ingredients
    fromGrams: (value) => value / 120,
  },
  cups: {
    toGrams: (value) => value * 120,
    fromGrams: (value) => value / 120,
  },
  tablespoon: {
    toGrams: (value) => value * 15,
    fromGrams: (value) => value / 15,
  },
  tablespoons: {
    toGrams: (value) => value * 15,
    fromGrams: (value) => value / 15,
  },
  tbsp: {
    toGrams: (value) => value * 15,
    fromGrams: (value) => value / 15,
  },
  teaspoon: {
    toGrams: (value) => value * 5,
    fromGrams: (value) => value / 5,
  },
  teaspoons: {
    toGrams: (value) => value * 5,
    fromGrams: (value) => value / 5,
  },
  tsp: {
    toGrams: (value) => value * 5,
    fromGrams: (value) => value / 5,
  },
  ounce: {
    toGrams: (value) => value * 28.35,
    fromGrams: (value) => value / 28.35,
  },
  ounces: {
    toGrams: (value) => value * 28.35,
    fromGrams: (value) => value / 28.35,
  },
  oz: {
    toGrams: (value) => value * 28.35,
    fromGrams: (value) => value / 28.35,
  },
  milliliter: {
    toGrams: (value) => value * 1, // 1ml = 1g for water-like liquids
    fromGrams: (value) => value / 1,
  },
  milliliters: {
    toGrams: (value) => value * 1,
    fromGrams: (value) => value / 1,
  },
  ml: {
    toGrams: (value) => value * 1,
    fromGrams: (value) => value / 1,
  },
  liter: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
  liters: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
  l: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
  pound: {
    toGrams: (value) => value * 453.592,
    fromGrams: (value) => value / 453.592,
  },
  pounds: {
    toGrams: (value) => value * 453.592,
    fromGrams: (value) => value / 453.592,
  },
  lb: {
    toGrams: (value) => value * 453.592,
    fromGrams: (value) => value / 453.592,
  },
  lbs: {
    toGrams: (value) => value * 453.592,
    fromGrams: (value) => value / 453.592,
  },
  gram: {
    toGrams: (value) => value,
    fromGrams: (value) => value,
  },
  grams: {
    toGrams: (value) => value,
    fromGrams: (value) => value,
  },
  g: {
    toGrams: (value) => value,
    fromGrams: (value) => value,
  },
  kilogram: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
  kilograms: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
  kg: {
    toGrams: (value) => value * 1000,
    fromGrams: (value) => value / 1000,
  },
};

export function convertToGrams(value: number, unit: string): number {
  const unitLower = unit.toLowerCase().trim();
  const converter = UNIT_CONVERSIONS[unitLower];
  
  if (converter) {
    return Math.round(converter.toGrams(value) * 10) / 10; // Round to 1 decimal
  }
  
  // If no unit or unrecognized unit, assume it's already grams or a count (eggs, etc)
  return value;
}

export function scaleValue(value: number, multiplier: number): number {
  return Math.round(value * multiplier * 10) / 10; // Round to 1 decimal
}
