-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ingredients_text TEXT NOT NULL,
  instructions_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_ingredients table
CREATE TABLE public.saved_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  package_amount NUMERIC NOT NULL,
  package_unit TEXT NOT NULL,
  package_cost NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_ingredients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recipes
CREATE POLICY "Users can view their own recipes"
  ON public.recipes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes"
  ON public.recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON public.recipes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON public.recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for saved_ingredients
CREATE POLICY "Users can view their own ingredients"
  ON public.saved_ingredients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ingredients"
  ON public.saved_ingredients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients"
  ON public.saved_ingredients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients"
  ON public.saved_ingredients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on recipes
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();