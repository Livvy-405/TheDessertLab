import { Link } from "react-router-dom";
import { Heart, Users, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-cream">
      {/* Hero Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary mb-6">About The Dessert Lab</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Where passion meets perfection in every bite. We're not just a bakery - 
              we're artisans crafting moments of joy through exceptional desserts.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The Dessert Lab was born from one simple belief, every dessert should feel special. 
                In 2025, I, Olivia Nguni, decided to turn my love for baking into something I could share with others,
                starting right from my own kitchen.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                What began as small weekend orders for friends and family has grown into a home-based baking business loved by our community.
                I use only quality ingredients, a mix of classic techniques and creative twists, and plenty of love in every batch.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Every cookie, cupcake, and doughnut that leaves our kitchen carries with it our passion 
                for perfection and our commitment to bringing a little more sweetness into the world.
              </p>
              <Button asChild variant="warm" size="lg">
                <Link to="/order">Experience Our Passion</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Made with Love</h3>
                <p className="text-muted-foreground">Every item is crafted with care and attention to detail</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Community First</h3>
                <p className="text-muted-foreground">We're proud to serve our local community</p>
              </Card>
              <Card className="text-center p-6">
                <Award className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">Only the finest ingredients make it into our treats</p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Fresh Daily</h3>
                <p className="text-muted-foreground">Baked fresh every morning for maximum flavor</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-xl opacity-90 mb-8">
              We believe that great desserts start with great ingredients and are perfected through 
              passion, patience, and skill. Our philosophy is simple: never compromise on quality, 
              always innovate with respect for tradition, and create experiences that bring joy.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Quality First</h3>
                <p className="opacity-90">
                  We source our ingredients from trusted suppliers and never cut corners on quality. 
                  Every flour, every chocolate chip, every vanilla bean is chosen for its excellence.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Innovation & Tradition</h3>
                <p className="opacity-90">
                  We respect traditional baking methods while embracing creative flavors and modern 
                  techniques to create unique and memorable desserts.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Customer Focused</h3>
                <p className="opacity-90">
                  Your satisfaction is our priority. We work closely with each customer to ensure 
                  every order exceeds expectations and creates special moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Call to Action */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Ready to Taste the Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the passion and quality that goes into every dessert. 
            Place your custom order today and taste what makes The Dessert Lab special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="warm" size="lg">
              <Link to="/order">Place an Order</Link>
            </Button>
            {/* Removed Visit Our Bakery button as requested */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
