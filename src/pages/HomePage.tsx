import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-bakery.jpg";
import cookiesImage from "@/assets/cookies-display.jpg";
import cupcakesImage from "@/assets/cupcakes-display.jpg";
import doughnutsImage from "@/assets/doughnuts-display.jpg";

const HomePage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Welcome to
              <span className="block text-accent">The Dessert Lab</span>
            </h1>
            <p className="text-xl text-white font-semibold mb-8 animate-fade-in">
              Crafting artisanal cookies, cupcakes, and doughnuts with love and the finest ingredients. 
              Every bite is a moment of pure joy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Button asChild variant="hero" size="lg">
                <Link to="/order">
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/about">Learn Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Signature Treats</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully crafted selection of cookies, cupcakes, and doughnuts, 
              made fresh daily with premium ingredients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cookies */}
            <Card className="group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={cookiesImage} 
                  alt="Artisanal Cookies"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">
                  12+ Varieties
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">Artisanal Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  From classic chocolate chip to unique matcha and red velvet flavors, 
                  our cookies are baked to perfection with love.
                </p>
                <Button asChild variant="warm" className="w-full">
                  <Link to="/cookies">View Cookies</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cupcakes */}
            <Card className="group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={cupcakesImage} 
                  alt="Gourmet Cupcakes"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">
                  9+ Flavors
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">Gourmet Cupcakes</h3>
                <p className="text-muted-foreground mb-4">
                  Moist, fluffy cupcakes topped with our signature buttercream frostings 
                  and premium decorations.
                </p>
                <Button asChild variant="warm" className="w-full">
                  <Link to="/cupcakes">View Cupcakes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Doughnuts */}
            <Card className="group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={doughnutsImage} 
                  alt="Fresh Doughnuts"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">
                  6+ Types
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">Fresh Doughnuts</h3>
                <p className="text-muted-foreground mb-4">
                  Light, airy doughnuts with glazes, fillings, and toppings that will 
                  make your taste buds dance with joy.
                </p>
                <Button asChild variant="warm" className="w-full">
                  <Link to="/doughnuts">View Doughnuts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">
                Crafted with Passion, Served with Love
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At The Dessert Lab, we believe that every dessert should be an experience. 
                Our team of passionate bakers uses only the finest ingredients to create 
                treats that not only taste incredible but also bring joy to your day.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're celebrating a special occasion or simply treating yourself, 
                our custom orders and advance booking system ensures you get exactly what 
                you want, when you want it.
              </p>
              <Button asChild variant="warm" size="lg">
                <Link to="/about">
                  Learn More About Us <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-lg p-6 text-center">
                <Star className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-primary mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Only the finest ingredients</p>
              </div>
              <div className="bg-secondary rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-primary mb-2">Fresh Daily</h3>
                <p className="text-sm text-muted-foreground">Baked fresh every morning</p>
              </div>
              <div className="bg-secondary rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-primary mb-2">Local Delivery</h3>
                <p className="text-sm text-muted-foreground">Pickup & delivery available</p>
              </div>
              <div className="bg-secondary rounded-lg p-6 text-center">
                <ArrowRight className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-primary mb-2">Custom Orders</h3>
                <p className="text-sm text-muted-foreground">3-day advance booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-warm text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Place Your Order?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Custom orders require 3 days advance notice and a 30% deposit to secure your booking. 
            Let us create something special for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/order">Start Your Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Business Hours & Contact */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Business Hours</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM</p>
                <p><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
              
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Get in Touch</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Phone:</strong> +260 779721358</p>
                <p><strong>Email:</strong> thedessertlab44@gmail.com</p>
                <p><strong>Address:</strong> Kamwala South</p>
                <p className="text-accent font-medium mt-4">Order 3 days in advance • 30% deposit required</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
