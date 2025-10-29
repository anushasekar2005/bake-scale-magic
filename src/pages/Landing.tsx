import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import bakingBackground from "@/assets/baking-background.png";

const Landing = () => {
  const tools = [
    {
      title: "Recipe Scaler",
      description: "Scale your recipes with precision. Convert measurements to grams and adjust portions for any batch size.",
      icon: ChefHat,
      path: "/recipe-scaler",
      color: "from-primary/20 to-primary/5"
    },
    {
      title: "Recipe Pricing Tool",
      description: "Calculate the cost of your recipes based on ingredient usage. Track costs per unit and optimize your pricing.",
      icon: DollarSign,
      path: "/pricing-tool",
      color: "from-accent/20 to-accent/5"
    }
  ];

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
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Cooking Tools</h1>
              <p className="text-lg text-muted-foreground">Your digital kitchen assistant</p>
            </div>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={tool.path}
                  to={tool.path}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-primary font-medium group-hover:underline">
                        Open Tool →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
