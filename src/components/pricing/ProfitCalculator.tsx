import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateProfitMargin } from "@/utils/pricingCalculator";

interface ProfitCalculatorProps {
  totalCost: number;
}

export function ProfitCalculator({ totalCost }: ProfitCalculatorProps) {
  const [sellingPrice, setSellingPrice] = useState("");

  const price = parseFloat(sellingPrice);
  const hasValidPrice = !isNaN(price) && price > 0;
  const profitData = hasValidPrice ? calculateProfitMargin(totalCost, price) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Margin Calculator</CardTitle>
        <CardDescription>Calculate your profit based on selling price</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price ($)</Label>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            placeholder="10.00"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </div>

        {hasValidPrice && profitData && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Cost:</span>
              <span className="font-semibold">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Selling Price:</span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Profit:</span>
              <span className={`font-bold text-lg ${profitData.profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                ${profitData.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Margin:</span>
              <span className={`font-bold text-lg ${profitData.marginPercentage >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {profitData.marginPercentage.toFixed(1)}%
              </span>
            </div>

            {profitData.marginPercentage < 30 && profitData.marginPercentage >= 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 Tip: A profit margin below 30% may be too low for sustainable business. Consider adjusting your pricing or reducing costs.
                </p>
              </div>
            )}

            {profitData.profit < 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <p className="text-xs text-destructive">
                  ⚠️ Warning: Your selling price is below the total cost. You're losing money on this recipe!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
