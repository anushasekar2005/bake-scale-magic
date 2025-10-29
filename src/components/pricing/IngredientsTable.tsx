import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Download } from "lucide-react";
import { IngredientCost } from "@/utils/pricingCalculator";
import { toast } from "@/hooks/use-toast";

interface IngredientsTableProps {
  ingredients: IngredientCost[];
  onRemoveIngredient: (id: string) => void;
  totalCost: number;
}

export function IngredientsTable({ ingredients, onRemoveIngredient, totalCost }: IngredientsTableProps) {
  const handleExport = () => {
    const headers = [
      "Ingredient",
      "Package Cost",
      "Package Size",
      "Cost Per Unit",
      "Amount Used",
      "Total Cost"
    ];

    const rows = ingredients.map(ing => [
      ing.name,
      `$${ing.packageCost.toFixed(2)}`,
      `${ing.packageSize} ${ing.packageUnit}`,
      `$${ing.costPerUnit.toFixed(4)} per ${ing.packageUnit}`,
      `${ing.amountUsed} ${ing.amountUnit}`,
      `$${ing.totalCost.toFixed(2)}`
    ]);

    rows.push(["", "", "", "", "Total:", `$${totalCost.toFixed(2)}`]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recipe-pricing-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Recipe pricing has been exported to CSV",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recipe Cost Breakdown</CardTitle>
            <CardDescription>Detailed cost analysis for your recipe</CardDescription>
          </div>
          {ingredients.length > 0 && (
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {ingredients.length > 0 ? (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead className="text-right">Package Cost</TableHead>
                    <TableHead className="text-right">Package Size</TableHead>
                    <TableHead className="text-right">Cost Per Unit</TableHead>
                    <TableHead className="text-right">Amount Used</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="font-medium">{ingredient.name}</TableCell>
                      <TableCell className="text-right">${ingredient.packageCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {ingredient.packageSize} {ingredient.packageUnit}
                      </TableCell>
                      <TableCell className="text-right">
                        ${ingredient.costPerUnit.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right">
                        {ingredient.amountUsed} {ingredient.amountUnit}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ${ingredient.totalCost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveIngredient(ingredient.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={5} className="text-right">
                      Total Recipe Cost:
                    </TableCell>
                    <TableCell className="text-right text-lg text-primary">
                      ${totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No ingredients added yet</p>
            <p className="text-sm mt-2">Add ingredients to see the cost breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
