// Pricing calculation utilities

export interface IngredientCost {
  id: string;
  name: string;
  packageCost: number;
  packageSize: number;
  packageUnit: 'g' | 'sticks' | 'count';
  costPerUnit: number;
  amountUsed: number;
  amountUnit: 'g' | 'sticks' | 'count';
  totalCost: number;
}

export interface SavedIngredient {
  id: string;
  name: string;
  packageCost: number;
  packageSize: number;
  packageUnit: 'g' | 'sticks' | 'count';
  costPerUnit: number;
  timestamp: number;
}

export function calculateCostPerUnit(
  packageCost: number,
  packageSize: number
): number {
  if (packageSize <= 0) return 0;
  return packageCost / packageSize;
}

export function calculateTotalCost(
  costPerUnit: number,
  amountUsed: number
): number {
  return costPerUnit * amountUsed;
}

export function calculateIngredientCost(
  name: string,
  packageCost: number,
  packageSize: number,
  packageUnit: 'g' | 'sticks' | 'count',
  amountUsed: number,
  amountUnit: 'g' | 'sticks' | 'count'
): IngredientCost {
  const costPerUnit = calculateCostPerUnit(packageCost, packageSize);
  const totalCost = calculateTotalCost(costPerUnit, amountUsed);

  return {
    id: Date.now().toString() + Math.random().toString(36).substring(7),
    name,
    packageCost,
    packageSize,
    packageUnit,
    costPerUnit,
    amountUsed,
    amountUnit,
    totalCost,
  };
}

export function calculateTotalRecipeCost(ingredients: IngredientCost[]): number {
  return ingredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
}

export function calculateProfitMargin(
  totalCost: number,
  sellingPrice: number
): {
  profit: number;
  marginPercentage: number;
} {
  const profit = sellingPrice - totalCost;
  const marginPercentage = totalCost > 0 ? (profit / sellingPrice) * 100 : 0;

  return {
    profit,
    marginPercentage,
  };
}
