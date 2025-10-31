import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { IngredientInput } from "@/components/pricing/IngredientInput";
import { IngredientsTable } from "@/components/pricing/IngredientsTable";
import { SavedIngredientsLibrary } from "@/components/pricing/SavedIngredientsLibrary";
import { ProfitCalculator } from "@/components/pricing/ProfitCalculator";
import { IngredientCost, calculateTotalRecipeCost } from "@/utils/pricingCalculator";
import { toast } from "@/hooks/use-toast";
import bakingBackground from "@/assets/baking-background.png";
import { useAuth } from "@/hooks/useAuth";

const PricingTool = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const totalCost = calculateTotalRecipeCost(ingredients);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleAddIngredient = (ingredient: IngredientCost) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    toast({
      title: "Ingredient removed",
      description: "Ingredient has been removed from the recipe",
    });
  };

  const handleSelectFromLibrary = (ingredient: IngredientCost) => {
    setIngredients([...ingredients, ingredient]);
    toast({
      title: "Ingredient added",
      description: `${ingredient.name} has been added to the recipe`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] pointer-events-none"
        style={{ backgroundImage: `url(${bakingBackground})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Recipe Pricing Tool</h1>
                  <p className="text-sm text-muted-foreground">Calculate costs based on ingredient usage</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="library">Ingredient Library</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-6">
                  <IngredientInput onAddIngredient={handleAddIngredient} />
                </TabsContent>
                <TabsContent value="library" className="mt-6">
                  <SavedIngredientsLibrary onSelectIngredient={handleSelectFromLibrary} />
                </TabsContent>
              </Tabs>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Import from Recipe Scaler</CardTitle>
                  <CardDescription>Coming in next iteration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Soon you'll be able to import ingredients directly from your scaled recipes to automatically calculate costs.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <IngredientsTable 
                ingredients={ingredients}
                onRemoveIngredient={handleRemoveIngredient}
                totalCost={totalCost}
              />

              {ingredients.length > 0 && (
                <ProfitCalculator totalCost={totalCost} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTool;
