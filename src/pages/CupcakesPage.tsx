import { Link } from "react-router-dom";
import { ArrowRight, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import assortedCupcakeBox from "@/assets/assorted-cupcake-box.jpg";
import blackForestCupcakesNew from "@/assets/black-forest-cupcakes-new.jpg";
import darkChocolateBlackberryCupcakes from "@/assets/dark-chocolate-blackberry-cupcakes.jpg";
import classicVanillaCupcakes from "@/assets/classic-vanilla-cupcakes.jpg";
import redVelvetCupcakes from "@/assets/red-velvet-cupcakes.jpg";
import lemonCupcakes from "@/assets/lemon-cupcakes.jpg";
import bananaCreamCheeseCupcakes from "@/assets/banana-cream-cheese-cupcakes.jpg";
import saltedCaramelChocolateCupcakes from "@/assets/salted-caramel-chocolate-cupcakes.jpg";
import bostonCreamCupcakes from "@/assets/boston-cream-cupcakes.jpg";
import matchaMilkshakeCupcakes from "@/assets/matcha-milkshake-cupcakes.jpg";

const CupcakesPage = () => {
  const cupcakes = [
    {
      name: "Assorted Cupcake Box",
      description: "A delicious variety of our signature cupcakes - perfect for sharing or trying multiple flavors",
      image: assortedCupcakeBox,
      price6: "k180",
      price12: "k350",
      featured: true
    },
    {
      name: "Black Forest Cupcakes",
      description: "Rich chocolate cupcakes with cherry filling and whipped cream frosting",
      image: blackForestCupcakesNew,
      price6: "k150",
      price12: "k290"
    },
    {
      name: "Dark Chocolate Blackberry",
      description: "Decadent dark chocolate cupcakes topped with fresh blackberry buttercream",
      image: darkChocolateBlackberryCupcakes,
      price6: "k150",
      price12: "k290"
    },
    {
      name: "Classic Vanilla",
      description: "Moist vanilla cupcakes with our signature vanilla bean buttercream",
      image: classicVanillaCupcakes,
      price6: "k130",
      price12: "k250"
    },
    {
      name: "Red Velvet",
      description: "Traditional red velvet cupcakes with cream cheese frosting",
      image: redVelvetCupcakes,
      price6: "k150",
      price12: "k290"
    },
    {
      name: "Lemon",
      description: "Bright lemon cupcakes with tangy lemon curd and lemon buttercream",
      image: lemonCupcakes,
      price6: "k130",
      price12: "k250"
    },
    {
      name: "Banana Cream Cheese",
      description: "Moist banana cupcakes with cinnamon cream cheese frosting",
      image: bananaCreamCheeseCupcakes,
      price6: "k150",
      price12: "k290"
    },
    {
      name: "Salted Caramel Chocolate",
      description: "Chocolate cupcakes with salted caramel filling and caramel buttercream",
      image: saltedCaramelChocolateCupcakes,
      price6: "k150",
      price12: "k290"
    },
    {
      name: "Boston Cream Cupcake",
      description: "Vanilla cupcakes filled with pastry cream and topped with chocolate ganache",
      image: bostonCreamCupcakes,
      price6: "k130",
      price12: "k250"
    },
    {
      name: "Matcha Milkshake Cupcakes",
      description: "Green tea cupcakes with matcha buttercream and white chocolate drizzle",
      image: matchaMilkshakeCupcakes,
      price6: "k150",
      price12: "k290"
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-cream">
      {/* Header Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Gourmet Cupcakes</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Moist, fluffy cupcakes made with premium ingredients and topped with our signature 
              buttercream frostings. Each cupcake is a perfect individual indulgence.
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/order">
                Order Your Cupcakes <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cupcakes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cupcakes.map((cupcake, index) => (
              <Card 
                key={cupcake.name} 
                className={`group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in ${
                  cupcake.featured ? 'ring-2 ring-accent' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={cupcake.image} 
                    alt={cupcake.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {cupcake.featured && (
                    <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{cupcake.name}</h3>
                  <p className="text-muted-foreground mb-4">{cupcake.description}</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cupcake.price6}</div>
                      <div className="text-sm text-muted-foreground">box of 6</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cupcake.price12}</div>
                      <div className="text-sm text-muted-foreground">box of 12</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Toppings Info */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              <Plus className="inline-block w-8 h-8 mr-2" />
              Additional Toppings Available
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customize your cupcakes with our premium toppings for an extra charge. 
              Add fresh berries, chocolate shavings, sprinkles, or edible flowers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🍓</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Fresh Berries</h4>
              <p className="text-sm text-muted-foreground">Strawberries, blueberries, raspberries</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🍫</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Chocolate Shavings</h4>
              <p className="text-sm text-muted-foreground">Dark, milk, or white chocolate</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">✨</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Premium Sprinkles</h4>
              <p className="text-sm text-muted-foreground">Artisanal and seasonal options</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🌸</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Edible Flowers</h4>
              <p className="text-sm text-muted-foreground">Beautiful and delicate decorations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Information */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order Your Cupcakes?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            All cupcake orders require 3 days advance notice and a 30% deposit to secure your order. 
            Additional toppings available for extra charge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/order">Place Cupcake Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Ask About Custom Decorations</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CupcakesPage;
