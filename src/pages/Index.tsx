import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { parseRecipe, ParsedRecipe } from "@/utils/recipeParser";
import { ChefHat, Save, Trash2 } from "lucide-react";

interface SavedRecipe {
  id: string;
  name: string;
  ingredientsText: string;
  instructionsText: string;
  timestamp: number;
}

const Index = () => {
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  // Load saved recipes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedRecipes");
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  const handleConvert = () => {
    if (!ingredientsText.trim() && !instructionsText.trim()) {
      toast({
        title: "Recipe is empty",
        description: "Please enter ingredients or instructions",
        variant: "destructive",
      });
      return;
    }

    const recipe = parseRecipe(ingredientsText, instructionsText, multiplier);
    setParsedRecipe(recipe);
    
    toast({
      title: "Recipe scaled!",
      description: `Recipe multiplied by ${multiplier}x`,
    });
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim()) {
      toast({
        title: "Recipe name required",
        description: "Please enter a name for your recipe",
        variant: "destructive",
      });
      return;
    }

    if (!ingredientsText.trim() && !instructionsText.trim()) {
      toast({
        title: "Recipe is empty",
        description: "Please enter ingredients or instructions",
        variant: "destructive",
      });
      return;
    }

    const newRecipe: SavedRecipe = {
      id: Date.now().toString(),
      name: recipeName,
      ingredientsText,
      instructionsText,
      timestamp: Date.now(),
    };

    const updated = [...savedRecipes, newRecipe];
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));

    toast({
      title: "Recipe saved!",
      description: `${recipeName} has been saved successfully`,
    });

    setRecipeName("");
  };

  const handleLoadRecipe = (recipe: SavedRecipe) => {
    setIngredientsText(recipe.ingredientsText);
    setInstructionsText(recipe.instructionsText);
    setRecipeName(recipe.name);
    setMultiplier(1);

    toast({
      title: "Recipe loaded",
      description: `${recipe.name} is ready to scale`,
    });
  };

  const handleDeleteRecipe = (id: string) => {
    const updated = savedRecipes.filter((r) => r.id !== id);
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));

    toast({
      title: "Recipe deleted",
      description: "Recipe has been removed from your collection",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recipe Scaler</h1>
              <p className="text-sm text-muted-foreground">Scale your recipes with precision</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Input</CardTitle>
                <CardDescription>
                  Paste your recipe ingredients and instructions below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="2 cups flour&#10;1/2 cup sugar&#10;3 eggs&#10;1 tablespoon vanilla extract"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Preheat oven to 350°F&#10;Mix ingredients in an 8-inch pan&#10;Bake for 30 minutes"
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <Label>Multiplier: {multiplier}x</Label>
                  <Slider
                    value={[multiplier]}
                    onValueChange={(value) => setMultiplier(value[0])}
                    min={0.3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Scale between 0.3x (smaller batch) and 3x (larger batch)
                  </p>
                </div>

                <Button 
                  onClick={handleConvert} 
                  className="w-full"
                  size="lg"
                >
                  Convert Recipe
                </Button>

                <div className="space-y-2 border-t border-border pt-4">
                  <Label htmlFor="recipeName">Recipe Name (for saving)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="recipeName"
                      placeholder="My Amazing Brownies"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <Button onClick={handleSaveRecipe} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Recipes */}
            {savedRecipes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Recipes</CardTitle>
                  <CardDescription>Your recipe collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                      >
                        <button
                          onClick={() => handleLoadRecipe(recipe)}
                          className="flex-1 text-left hover:text-primary transition-colors"
                        >
                          <p className="font-medium">{recipe.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(recipe.timestamp).toLocaleDateString()}
                          </p>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scaled Recipe</CardTitle>
                <CardDescription>
                  All measurements converted to grams and scaled by {multiplier}x
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parsedRecipe ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Ingredients</h3>
                      <div className="space-y-1">
                        {parsedRecipe.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="rounded bg-muted/50 p-2 font-mono text-sm"
                          >
                            {ingredient.scaledAmount > 0 ? (
                              <span>
                                <span className="font-semibold text-primary">
                                  {ingredient.scaledAmount}g
                                </span>{" "}
                                {ingredient.ingredient}
                                <span className="text-xs text-muted-foreground ml-2">
                                  (was {ingredient.amount} {ingredient.unit})
                                </span>
                              </span>
                            ) : (
                              <span>{ingredient.ingredient}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {parsedRecipe.scaledInstructions && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Instructions</h3>
                        <div className="rounded bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap">
                          {parsedRecipe.scaledInstructions}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Enter your recipe to see the scaled version</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
