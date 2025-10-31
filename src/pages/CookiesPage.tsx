import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import assortedCookieBox from "@/assets/assorted-cookie-box.jpg";
import redVelvetCookiesNew from "@/assets/red-velvet-cookies-new.jpg";
import chocoCheesecakeCookies from "@/assets/choco-cheesecake-cookies.jpg";
import matchaChocolateChipCookies from "@/assets/matcha-chocolate-chip-cookies.jpg";
import caramelitaCookies from "@/assets/caramelita-cookies.jpg";
import crispyButterCookies from "@/assets/crispy-butter-cookies.jpg";
import chocolateChipCookiesNew from "@/assets/chocolate-chip-cookies-new.jpg";
import doubleChocolateHazelnutCookies from "@/assets/double-chocolate-hazelnut-cookies.jpg";
import chewyOatmealCookies from "@/assets/chewy-oatmeal-cookies.jpg";
import peanutButterCookies from "@/assets/peanut-butter-cookies.jpg";
import brookies from "@/assets/brookies.jpg";
import oatmealChocolateChipCookies from "@/assets/oatmeal-chocolate-chip-cookies.jpg";
import thumbprintCookies from "@/assets/thumbprint-cookies.jpg";

const CookiesPage = () => {
const cookies = [
    {
      name: "Assorted Cookie Box",
      description: "A delightful mix of our most popular cookie varieties - perfect for trying multiple flavors",
      image: assortedCookieBox,
      price10: "k100",
      price20: "k190",
      featured: true
    },
    {
      name: "Red Velvet Cookies",
      description: "Rich red velvet cookies with cream cheese centers and a hint of cocoa",
      image: redVelvetCookiesNew,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Choco-Cheesecake Cookie Bites",
      description: "Decadent chocolate cookies filled with creamy cheesecake center",
      image: chocoCheesecakeCookies,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Matcha Chocolate Chip Cookies",
      description: "Earthy matcha green tea cookies studded with white chocolate chips",
      image: matchaChocolateChipCookies,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Caramelita Cookies",
      description: "Buttery oat cookies layered with caramel and chocolate chips",
      image: caramelitaCookies,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Crispy Butter Cookies",
      description: "Classic European-style butter cookies with a perfect crispy texture",
      image: crispyButterCookies,
      price10: "k60",
      price20: "k110"
    },
    {
      name: "Chocolate Chip Cookies",
      description: "Our signature chocolate chip cookies made with premium Belgian chocolate",
      image: chocolateChipCookiesNew,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Double Chocolate Cookies with Hazelnuts",
      description: "Intensely chocolatey cookies with roasted hazelnuts and chocolate chunks",
      image: doubleChocolateHazelnutCookies,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Chewy Oatmeal Cookies",
      description: "Soft and chewy oatmeal cookies with cinnamon and raisins",
      image: chewyOatmealCookies,
      price10: "k60",
      price20: "k110"
    },
    {
      name: "Peanut Butter Cookies",
      description: "Rich peanut butter cookies with the perfect balance of sweet and salty",
      image: peanutButterCookies,
      price10: "k60",
      price20: "k110"
    },
    {
      name: "Brookies",
      description: "The best of both worlds - half brownie, half chocolate chip cookie",
      image: brookies,
      price10: "k90",
      price20: "k170"
    },
    {
      name: "Oatmeal Chocolate Chip Cookies",
      description: "Hearty oatmeal cookies loaded with milk chocolate chips",
      image: oatmealChocolateChipCookies,
      price10: "k70",
      price20: "k130"
    },
    {
      name: "Thumbprint Cookies",
      description: "Buttery shortbread cookies filled with premium fruit preserves",
      image: thumbprintCookies,
      price10: "k60",
      price20: "k110"
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-cream">
      {/* Header Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Artisanal Cookies</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each cookie is handcrafted with premium ingredients and baked fresh daily. 
              From classic favorites to unique flavor combinations, our cookies are made to delight.
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/order">
                Order Your Cookies <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cookies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cookies.map((cookie, index) => (
              <Card 
                key={cookie.name} 
                className={`group hover:shadow-warm transition-all duration-300 hover:scale-105 animate-scale-in ${
                  cookie.featured ? 'ring-2 ring-accent' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={cookie.image} 
                    alt={cookie.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {cookie.featured && (
                    <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{cookie.name}</h3>
                  <p className="text-muted-foreground mb-4">{cookie.description}</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cookie.price10}</div>
                      <div className="text-sm text-muted-foreground">box of 10</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cookie.price20}</div>
                      <div className="text-sm text-muted-foreground">box of 20</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Order Information */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order Your Cookies?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            All cookie orders require 3 days advance notice and a 30% deposit to secure your order. 
            Choose from our delicious varieties or ask about custom flavors!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/order">Place Cookie Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Ask About Custom Flavors</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CookiesPage;
