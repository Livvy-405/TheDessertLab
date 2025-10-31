import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Show loading toast
      toast.loading("Sending your message...", { id: 'contact-submit' });

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast.success("Message sent successfully!", {
        id: 'contact-submit',
        description: "We'll get back to you within 24 hours."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Failed to send message", {
        id: 'contact-submit',
        description: error instanceof Error ? error.message : "Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-gradient-cream">
      {/* Header */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We'd love to hear from you! Whether you have questions about our products, 
              want to place a custom order, or just want to say hello, we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-accent" />
                    Visit Our Bakery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Come visit us in person !
                  </p>
                  <address className="not-italic">
                    <strong>The Dessert Lab</strong><br />
                    Kamwala South, Lusaka
                  </address>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-accent" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-muted-foreground">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-accent" />
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+260779721358" className="text-muted-foreground hover:text-primary">
                        +260 779721358
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:thedessertlab44@gmail.com" className="text-muted-foreground hover:text-primary">
                        thedessertlab44@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-primary mb-3">Important Reminders</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom orders require 3 days advance notice</li>
                    <li>• 30% deposit required to secure all orders</li>
                    <li>• We offer both pickup and delivery options</li>
                    <li>• Free consultations for large events</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-6 h-6 text-accent" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={e => {
                          const input = e.target;
                          let value = input.value;
                          const hasGmail = value.endsWith("@gmail.com");
                          const hasAt = value.includes("@");
                          if (!hasGmail && !hasAt) {
                            const cursor = input.selectionStart;
                            value += "@gmail.com";
                            setFormData({ ...formData, email: value });
                            setTimeout(() => {
                              if (input.type === "text") input.setSelectionRange(cursor, cursor);
                            }, 0);
                          } else {
                            setFormData({ ...formData, email: value });
                          }
                        }}
                        placeholder="your@gmail.com"
                        required
                        pattern="^[\w.+\-]+@gmail\.com$"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone.startsWith("+260") ? formData.phone : `+260${formData.phone.replace(/^\+?260?/, "")}`}
                        onChange={e => setFormData({ ...formData, phone: e.target.value.startsWith("+260") ? e.target.value : `+260${e.target.value.replace(/^\+?260?/, "")}` })}
                        placeholder="+260XXXXXXXXX"
                        required
                        pattern="^\+260\d{9}$"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What can we help you with?"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your needs, questions, or special requests..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="warm" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;