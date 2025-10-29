import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { calculateIngredientCost, IngredientCost } from "@/utils/pricingCalculator";
import { toast } from "@/hooks/use-toast";

interface IngredientInputProps {
  onAddIngredient: (ingredient: IngredientCost) => void;
}

export function IngredientInput({ onAddIngredient }: IngredientInputProps) {
  const [name, setName] = useState("");
  const [packageCost, setPackageCost] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [packageUnit, setPackageUnit] = useState<'g' | 'sticks' | 'count'>('g');
  const [amountUsed, setAmountUsed] = useState("");
  const [amountUnit, setAmountUnit] = useState<'g' | 'sticks' | 'count'>('g');

  const handleAddIngredient = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter an ingredient name",
        variant: "destructive",
      });
      return;
    }

    const pkgCost = parseFloat(packageCost);
    const pkgSize = parseFloat(packageSize);
    const amtUsed = parseFloat(amountUsed);

    if (isNaN(pkgCost) || pkgCost <= 0) {
      toast({
        title: "Invalid package cost",
        description: "Please enter a valid package cost",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(pkgSize) || pkgSize <= 0) {
      toast({
        title: "Invalid package size",
        description: "Please enter a valid package size",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(amtUsed) || amtUsed <= 0) {
      toast({
        title: "Invalid amount used",
        description: "Please enter a valid amount used",
        variant: "destructive",
      });
      return;
    }

    const ingredient = calculateIngredientCost(
      name,
      pkgCost,
      pkgSize,
      packageUnit,
      amtUsed,
      amountUnit
    );

    onAddIngredient(ingredient);

    // Reset form
    setName("");
    setPackageCost("");
    setPackageSize("");
    setAmountUsed("");

    toast({
      title: "Ingredient added",
      description: `${name} has been added to the recipe`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Ingredient</CardTitle>
        <CardDescription>Enter ingredient details to calculate cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ingredient Name</Label>
          <Input
            id="name"
            placeholder="e.g., All-Purpose Flour"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageCost">Package Cost ($)</Label>
            <Input
              id="packageCost"
              type="number"
              step="0.01"
              placeholder="4.00"
              value={packageCost}
              onChange={(e) => setPackageCost(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageSize">Package Size</Label>
            <div className="flex gap-2">
              <Input
                id="packageSize"
                type="number"
                step="0.01"
                placeholder="2000"
                value={packageSize}
                onChange={(e) => setPackageSize(e.target.value)}
                className="flex-1"
              />
              <Select value={packageUnit} onValueChange={(value: any) => setPackageUnit(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="sticks">sticks</SelectItem>
                  <SelectItem value="count">count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amountUsed">Amount Used in Recipe</Label>
            <Input
              id="amountUsed"
              type="number"
              step="0.01"
              placeholder="150"
              value={amountUsed}
              onChange={(e) => setAmountUsed(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select value={amountUnit} onValueChange={(value: any) => setAmountUnit(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="sticks">sticks</SelectItem>
                <SelectItem value="count">count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleAddIngredient} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Ingredient
        </Button>
      </CardContent>
    </Card>
  );
}
