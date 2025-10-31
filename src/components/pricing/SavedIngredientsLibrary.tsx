import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IngredientCost } from "@/utils/pricingCalculator";
import { Save, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SavedIngredientsLibraryProps {
  onSelectIngredient: (ingredient: IngredientCost) => void;
}

interface SavedIngredient {
  id: string;
  name: string;
  package_cost: number;
  package_amount: number;
  package_unit: string;
}

export function SavedIngredientsLibrary({ onSelectIngredient }: SavedIngredientsLibraryProps) {
  const { user } = useAuth();
  const [savedIngredients, setSavedIngredients] = useState<SavedIngredient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [packageCost, setPackageCost] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [packageUnit, setPackageUnit] = useState<'g' | 'sticks' | 'count'>('g');
  const [selectedIngredient, setSelectedIngredient] = useState<SavedIngredient | null>(null);
  const [amountUsed, setAmountUsed] = useState("");
  const [amountUnit, setAmountUnit] = useState<'g' | 'sticks' | 'count'>('g');

  useEffect(() => {
    if (user) {
      loadIngredients();
    }
  }, [user]);

  const loadIngredients = async () => {
    const { data, error } = await supabase
      .from("saved_ingredients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading ingredients",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setSavedIngredients(data);
    }
  };

  const handleSaveIngredient = async () => {
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

    if (isNaN(pkgCost) || pkgCost <= 0 || isNaN(pkgSize) || pkgSize <= 0) {
      toast({
        title: "Invalid values",
        description: "Please enter valid cost and size values",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("saved_ingredients").insert({
      user_id: user?.id,
      name,
      package_cost: pkgCost,
      package_amount: pkgSize,
      package_unit: packageUnit,
    });

    if (error) {
      toast({
        title: "Error saving ingredient",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Ingredient saved",
        description: `${name} has been saved to your library`,
      });

      setName("");
      setPackageCost("");
      setPackageSize("");
      setIsDialogOpen(false);
      loadIngredients();
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    const { error } = await supabase.from("saved_ingredients").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting ingredient",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Ingredient deleted",
        description: "Ingredient has been removed from your library",
      });
      loadIngredients();
    }
  };

  const handleUseIngredient = () => {
    if (!selectedIngredient) return;

    const amtUsed = parseFloat(amountUsed);
    if (isNaN(amtUsed) || amtUsed <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount used",
        variant: "destructive",
      });
      return;
    }

    // Convert units if needed
    let finalAmountUsed = amtUsed;
    const pkgUnit = selectedIngredient.package_unit;
    
    // If units match, no conversion needed
    if (pkgUnit === amountUnit) {
      finalAmountUsed = amtUsed;
    } else if (pkgUnit === 'g' && amountUnit === 'sticks') {
      // Convert sticks to grams (1 stick = 113g)
      finalAmountUsed = amtUsed * 113;
    } else if (pkgUnit === 'sticks' && amountUnit === 'g') {
      // Convert grams to sticks
      finalAmountUsed = amtUsed / 113;
    }

    const costPerUnit = selectedIngredient.package_cost / selectedIngredient.package_amount;
    const totalCost = costPerUnit * finalAmountUsed;

    const ingredient: IngredientCost = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      name: selectedIngredient.name,
      packageCost: selectedIngredient.package_cost,
      packageSize: selectedIngredient.package_amount,
      packageUnit: selectedIngredient.package_unit as 'g' | 'sticks' | 'count',
      amountUsed: amtUsed,
      amountUnit: amountUnit,
      costPerUnit,
      totalCost,
    };

    onSelectIngredient(ingredient);
    setSelectedIngredient(null);
    setAmountUsed("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ingredient Library</CardTitle>
            <CardDescription>Saved ingredients for quick reuse</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Ingredient to Library</DialogTitle>
                <DialogDescription>
                  Save ingredient details for future use
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="save-name">Ingredient Name</Label>
                  <Input
                    id="save-name"
                    placeholder="e.g., All-Purpose Flour"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="save-cost">Package Cost ($)</Label>
                    <Input
                      id="save-cost"
                      type="number"
                      step="0.01"
                      placeholder="4.00"
                      value={packageCost}
                      onChange={(e) => setPackageCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="save-size">Package Size</Label>
                    <div className="flex gap-2">
                      <Input
                        id="save-size"
                        type="number"
                        step="0.01"
                        placeholder="2000"
                        value={packageSize}
                        onChange={(e) => setPackageSize(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={packageUnit} onValueChange={(value: any) => setPackageUnit(value)}>
                        <SelectTrigger className="w-20">
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
                <Button onClick={handleSaveIngredient} className="w-full">
                  Save Ingredient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {savedIngredients.length > 0 ? (
          <div className="space-y-2">
            {savedIngredients.map((ingredient) => (
              <div key={ingredient.id}>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                  <div className="flex-1">
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${ingredient.package_cost.toFixed(2)} / {ingredient.package_amount} {ingredient.package_unit}
                      {" "}(${(ingredient.package_cost / ingredient.package_amount).toFixed(4)} per {ingredient.package_unit})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setAmountUnit(ingredient.package_unit as any);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Use
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Use {ingredient.name}</DialogTitle>
                          <DialogDescription>
                            Enter the amount you're using in your recipe
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="use-amount">Amount Used</Label>
                              <Input
                                id="use-amount"
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
                          <Button onClick={handleUseIngredient} className="w-full">
                            Add to Recipe
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No saved ingredients yet</p>
            <p className="text-xs mt-1">Save ingredients for quick reuse</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
