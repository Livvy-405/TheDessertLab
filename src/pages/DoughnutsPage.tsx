import { Link } from "react-router-dom";
import { ArrowRight, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import assortedDoughnutBox from "@/assets/assorted-doughnut-box.jpg";
import glazedDoughnutsNew from "@/assets/glazed-doughnuts-new.jpg";
import cinnamonSugarDoughnuts from "@/assets/cinnamon-sugar-doughnuts.jpg";
import doubleChocolateDoughnuts from "@/assets/double-chocolate-doughnuts.jpg";
import redVelvetDoughnuts from "@/assets/red-velvet-doughnuts.jpg";
import creamFilledItalianDoughnuts from "@/assets/cream-filled-italian-doughnuts.jpg";
import jellyDoughnuts from "@/assets/jelly-doughnuts.jpg";

const DoughnutsPage = () => {
  const doughnuts = [
    {
      name: "Assorted Doughnut Box",
      description: "A delicious variety of our freshly made doughnuts - perfect for sharing or trying multiple flavors",
      image: assortedDoughnutBox,
      price6: "k100",
      price12: "k190",
      featured: true
    },
    {
      name: "Glazed Doughnuts",
      description: "Classic light and airy doughnuts with our signature sweet glaze",
      image: glazedDoughnutsNew,
      price6: "k70",
      price12: "k130"
    },
    {
      name: "Cinnamon Sugar",
      description: "Warm doughnuts rolled in cinnamon sugar for the perfect morning treat",
      image: cinnamonSugarDoughnuts,
      price6: "k70",
      price12: "k130"
    },
    {
      name: "Double Chocolate Cake Doughnuts",
      description: "Rich chocolate cake doughnuts with chocolate glaze and chocolate chips",
      image: doubleChocolateDoughnuts,
      price6: "k100",
      price12: "k190"
    },
    {
      name: "Red Velvet Cake Doughnuts",
      description: "Moist red velvet cake doughnuts with cream cheese glaze",
      image: redVelvetDoughnuts,
      price6: "k100",
      price12: "k190"
    },
    {
      name: "Cream Filled Italian Doughnut",
      description: "Traditional Italian bomboloni filled with vanilla pastry cream",
      image: creamFilledItalianDoughnuts,
      price6: "k80",
      price12: "k150"
    },
    {
      name: "Jelly Doughnuts",
      description: "Soft yeast doughnuts filled with premium fruit preserves",
      image: jellyDoughnuts,
      price6: "k80",
      price12: "k150"
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-cream">
      {/* Header Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Fresh Doughnuts</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Light, airy, and irresistibly delicious. Our doughnuts are made fresh daily using 
              traditional techniques and the finest ingredients for that perfect texture and taste.
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/order">
                Order Your Doughnuts <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Doughnuts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doughnuts.map((doughnut, index) => (
              <Card 
                key={doughnut.name} 
                className={`group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in ${
                  doughnut.featured ? 'ring-2 ring-accent' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={doughnut.image} 
                    alt={doughnut.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {doughnut.featured && (
                    <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{doughnut.name}</h3>
                  <p className="text-muted-foreground mb-4">{doughnut.description}</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{doughnut.price6}</div>
                      <div className="text-sm text-muted-foreground">box of 6</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{doughnut.price12}</div>
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
              Enhance your doughnuts with our selection of premium toppings and glazes 
              for an extra charge. Make each doughnut uniquely yours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🍯</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Specialty Glazes</h4>
              <p className="text-sm text-muted-foreground">Maple, caramel, strawberry</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🥜</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Chopped Nuts</h4>
              <p className="text-sm text-muted-foreground">Pecans, almonds, hazelnuts</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🥥</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Coconut Flakes</h4>
              <p className="text-sm text-muted-foreground">Toasted and sweetened varieties</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">🍓</span>
              </div>
              <h4 className="font-semibold text-primary mb-2">Fresh Fruit</h4>
              <p className="text-sm text-muted-foreground">Seasonal fruit toppings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Information */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order Your Doughnuts?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            All doughnut orders require 3 days advance notice and a 30% deposit to secure your order. 
            Additional toppings available for extra charge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/order">Place Doughnut Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Ask About Custom Glazes</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DoughnutsPage;
