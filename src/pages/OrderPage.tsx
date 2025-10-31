import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { CalendarIcon, ShoppingCart, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from 'react-error-boundary';

const productOptions = {
  cookies: [
    "Assorted Cookie Box",
    "Red velvet cookies",
    "Choco-cheesecake cookie bites", 
    "Matcha chocolate chip cookies",
    "Caramelita cookies",
    "Crispy butter cookies",
    "Chocolate chip cookies",
    "Double chocolate cookies with hazelnuts",
    "Chewy oatmeal cookies",
    "Peanut butter cookies",
    "Brookies",
    "Oatmeal chocolate chip cookies",
    "Thumbprint cookies"
  ],
  cupcakes: [
    "Assorted Cupcake Box",
    "Black forest cupcakes",
    "Dark chocolate blackberry",
    "Classic vanilla",
    "Red velvet",
    "Lemon",
    "Banana cream cheese",
    "Salted caramel chocolate",
    "Boston cream cupcake",
    "Matcha milkshake cupcakes"
  ],
  doughnuts: [
    "Assorted Doughnut Box",
    "Cinnamon sugar",
    "Double chocolate cake doughnuts",
    "Red velvet cake doughnuts",
    "Cream filled Italian doughnut",
    "Jelly doughnuts",
    "Glazed doughnuts"
  ]
};

const quantityOptions = {
  cookies: [
    { value: 10, label: "10 cookies" },
    { value: 20, label: "20 cookies" }
  ],
  cupcakes: [
    { value: 6, label: "6 cupcakes" },
    { value: 12, label: "12 cupcakes" }
  ],
  doughnuts: [
    { value: 6, label: "6 doughnuts" },
    { value: 12, label: "12 doughnuts" }
  ]
};

// FIXED: Toppings prices in Kwacha
const toppingsOptions = [
  { name: "Fresh berries", price: 15 },
  { name: "Chocolate shavings", price: 10 },
  { name: "Premium sprinkles", price: 5 },
  { name: "Edible flowers", price: 20 },
  { name: "Chopped nuts", price: 12 },
  { name: "Coconut flakes", price: 8 },
  { name: "Specialty glazes", price: 10 }
];

// Add phone number validation and +260 prefix
const phoneNumberSchema = z.string().regex(/^\+260\d{9}$/, "Phone number must start with +260 and be 13 digits");
// Restrict email to @gmail.com only
const gmailSchema = z.string().email().regex(/^[\w.+\-]+@gmail\.com$/, "Only @gmail.com emails allowed");

const orderFormSchema = z.object({
  productType: z.string().min(1, "Please select a product type"),
  flavor: z.string().min(1, "Please select a flavor"),
  quantity: z.string().min(1, "Please select a quantity"),
  toppings: z.array(z.string()).optional(),
  customizations: z.string().optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: phoneNumberSchema,
  email: gmailSchema,
  pickupDate: z.date().refine((date) => {
    const minDate = addDays(new Date(), 3);
    return date >= minDate;
  }, "Orders must be placed at least 3 days in advance"),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  specialInstructions: z.string().optional(),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  depositAgreement: z.boolean().refine(val => val === true, "You must agree to pay the 30% deposit")
});

type OrderFormData = z.infer<typeof orderFormSchema>;

// Product data for price lookup
const cookies = [
  { name: "Assorted Cookie Box", price10: "K100", price20: "K190" },
  { name: "Red Velvet Cookies", price10: "K70", price20: "K130" },
  { name: "Choco-Cheesecake Cookie Bites", price10: "K70", price20: "K130" },
  { name: "Matcha Chocolate Chip Cookies", price10: "K70", price20: "K130" },
  { name: "Caramelita Cookies", price10: "K70", price20: "K130" },
  { name: "Crispy Butter Cookies", price10: "K60", price20: "K110" },
  { name: "Chocolate Chip Cookies", price10: "K70", price20: "K130" },
  { name: "Double Chocolate Cookies with Hazelnuts", price10: "K70", price20: "K130" },
  { name: "Chewy Oatmeal Cookies", price10: "K60", price20: "K110" },
  { name: "Peanut Butter Cookies", price10: "K60", price20: "K110" },
  { name: "Brookies", price10: "K90", price20: "K170" },
  { name: "Oatmeal Chocolate Chip Cookies", price10: "K70", price20: "K130" },
  { name: "Thumbprint Cookies", price10: "K60", price20: "K110" }
];
const cupcakes = [
  { name: "Assorted Cupcake Box", price6: "K180", price12: "K350" },
  { name: "Black Forest Cupcakes", price6: "K150", price12: "K290" },
  { name: "Dark Chocolate Blackberry", price6: "K150", price12: "K290" },
  { name: "Classic Vanilla", price6: "K130", price12: "K250" },
  { name: "Red Velvet", price6: "K150", price12: "K290" },
  { name: "Lemon", price6: "K130", price12: "K250" },
  { name: "Banana Cream Cheese", price6: "K150", price12: "K290" },
  { name: "Salted Caramel Chocolate", price6: "K150", price12: "K290" },
  { name: "Boston Cream Cupcake", price6: "K130", price12: "K250" },
  { name: "Matcha Milkshake Cupcakes", price6: "K150", price12: "K290" }
];
const doughnuts = [
  { name: "Assorted Doughnut Box", price6: "K100", price12: "K190" },
  { name: "Glazed Doughnuts", price6: "K70", price12: "K130" },
  { name: "Cinnamon Sugar", price6: "K70", price12: "K130" },
  { name: "Double Chocolate Cake Doughnuts", price6: "K100", price12: "K190" },
  { name: "Red Velvet Cake Doughnuts", price6: "K100", price12: "K190" },
  { name: "Cream Filled Italian Doughnut", price6: "K80", price12: "K150" },
  { name: "Jelly Doughnuts", price6: "K80", price12: "K150" }
];

// Helper function to get price for selected product/flavour/quantity
const getProductPrice = (type: string, flavor: string, quantity: string) => {
  if (type === "cookies") {
    const cookie = cookies.find(c => c.name.toLowerCase() === flavor.toLowerCase());
    if (cookie) {
      if (quantity === "10") return cookie.price10;
      if (quantity === "20") return cookie.price20;
    }
  }
  if (type === "cupcakes") {
    const cupcake = cupcakes.find(c => c.name.toLowerCase() === flavor.toLowerCase());
    if (cupcake) {
      if (quantity === "6") return cupcake.price6;
      if (quantity === "12") return cupcake.price12;
    }
  }
  if (type === "doughnuts") {
    const doughnut = doughnuts.find(d => d.name.toLowerCase() === flavor.toLowerCase());
    if (doughnut) {
      if (quantity === "6") return doughnut.price6;
      if (quantity === "12") return doughnut.price12;
    }
  }
  return null;
};

function OrderErrorFallback({ error }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-8 bg-red-100 rounded-lg text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Order Page Error</h1>
        <p className="text-red-600 mb-2">{error.message}</p>
        <pre className="text-xs text-red-500 whitespace-pre-wrap">{error.stack}</pre>
        <a href="/" className="text-blue-600 underline mt-4 block">Return to Homepage</a>
      </div>
    </main>
  );
}

const OrderPage = () => {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      email: "",
      quantity: "",
      toppings: [],
      deliveryMethod: "pickup",
      depositAgreement: false
    }
  });

  const productType = form.watch("productType");
  const deliveryMethod = form.watch("deliveryMethod");
  const quantity = form.watch("quantity");

  const calculateToppingsPrice = () => {
    const quantityNum = parseInt(quantity) || 0;
    return selectedToppings.reduce((total, toppingName) => {
      const topping = toppingsOptions.find(t => t.name === toppingName);
      return total + (topping ? topping.price * quantityNum : 0);
    }, 0);
  };

  // FIXED: Added loading toast for better UX
  const onSubmit = async (data: OrderFormData) => {
    try {
      // Show loading state immediately
      toast.loading("Submitting your order...", { id: 'order-submit' });

      const orderPayload = {
        productType: data.productType,
        flavor: data.flavor,
        quantity: parseInt(data.quantity),
        toppings: selectedToppings,
        customizations: data.customizations || '',
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email.toLowerCase(),
        pickupDate: data.pickupDate.toISOString(),
        deliveryMethod: data.deliveryMethod,
        address: data.address || '',
        city: data.city || '',
        zipCode: data.zipCode || '',
        specialInstructions: data.specialInstructions || '',
        paymentMethod: data.paymentMethod,
        depositAgreement: data.depositAgreement
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const result = await response.json();
      
      // Dismiss loading and show success
      toast.success("Order submitted successfully!", {
        id: 'order-submit',
        description: `Order #${result.orderNumber}. We'll contact you within 24 hours to confirm your order and arrange payment.`
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error("Failed to submit order", {
        id: 'order-submit',
        description: error instanceof Error ? error.message : "Please try again or contact us directly."
      });
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-cream py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary mb-4">Order Submitted Successfully!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your order! We'll contact you within 24 hours to confirm your order details 
                and arrange the 30% deposit payment.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation email has been sent to your email address with all order details.
              </p>
              <Button asChild variant="warm" size="lg">
                <a href="/">Return to Homepage</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-cream py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              <ShoppingCart className="inline-block w-10 h-10 mr-3" />
              Place Your Order
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Custom orders require 3 days advance notice and a 30% deposit to secure your booking. 
              Fill out the form below to get started.
            </p>
          </div>

          <Card className="mb-8 border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Important Order Information</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Orders must be placed at least 3 days in advance</li>
                    <li>• 30% deposit required to confirm order</li>
                    <li>• We'll contact you within 24 hours to confirm details and arrange payment</li>
                    <li>• Additional toppings available for extra charge on cupcakes and doughnuts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="relative z-50">
                              <SelectItem value="cookies">Cookies</SelectItem>
                              <SelectItem value="cupcakes">Cupcakes</SelectItem>
                              <SelectItem value="doughnuts">Doughnuts</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="flavor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flavor *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select flavor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="relative z-50 max-h-48 overflow-y-auto">
                              {productType && productOptions[productType as keyof typeof productOptions]?.map((flavor) => (
                                <SelectItem key={flavor} value={flavor}>
                                  {flavor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quantity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="relative z-50">
                            {productType && quantityOptions[productType as keyof typeof quantityOptions]?.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(productType === "cupcakes" || productType === "doughnuts") && (
                    <div>
                      <Label className="text-base font-semibold">Additional Toppings (Optional)</Label>
                      <p className="text-sm text-muted-foreground mb-4">Select additional toppings for extra charge</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {toppingsOptions.map((topping) => (
                          <div key={topping.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={topping.name}
                              checked={selectedToppings.includes(topping.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const newToppings = [...selectedToppings, topping.name];
                                  setSelectedToppings(newToppings);
                                  form.setValue('toppings', newToppings);
                                } else {
                                  const newToppings = selectedToppings.filter(t => t !== topping.name);
                                  setSelectedToppings(newToppings);
                                  form.setValue('toppings', newToppings);
                                }
                              }}
                            />
                            <label htmlFor={topping.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                              {topping.name} (+K{topping.price})
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedToppings.length > 0 && quantity && (
                        <p className="text-sm text-accent font-medium mt-2">
                          Toppings total: K{calculateToppingsPrice()}
                        </p>
                      )}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="customizations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Customizations or Requests</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requests, dietary restrictions, or custom decorations..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {productType && quantity && form.watch("flavor") && (
                    <div className="text-lg font-bold mb-4" style={{ color: '#D72660' }}>
                      Price: {getProductPrice(productType, form.watch("flavor"), quantity) || "N/A"}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+260XXXXXXXXX"
                              value={(field.value || "").startsWith("+260") ? (field.value || "") : `+260${(field.value || "").replace(/^\+?260?/, "")}`}
                              onChange={e => field.onChange((e.target.value || "").startsWith("+260") ? e.target.value : `+260${(e.target.value || "").replace(/^\+?260?/, "")}`)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="your@gmail.com"
                              value={field.value ?? ""}
                              pattern="^[\w.+\-]+@gmail\.com$"
                              onChange={e => {
                                const input = e.target;
                                let value = input.value;
                                const hasGmail = value.endsWith("@gmail.com");
                                const hasAt = value.includes("@");
                                if (!hasGmail && !hasAt) {
                                  const cursor = input.selectionStart;
                                  value += "@gmail.com";
                                  field.onChange(value);
                                  setTimeout(() => {
                                    if (input.type === "text") input.setSelectionRange(cursor, cursor);
                                  }, 0);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Pickup/Delivery Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date (minimum 3 days from today)</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const minDate = addDays(new Date(), 3);
                                return date < minDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Delivery Method *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pickup" id="pickup" />
                              <Label htmlFor="pickup">Pickup at bakery</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="delivery" id="delivery" />
                              <Label htmlFor="delivery">Delivery (additional charges may apply)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {deliveryMethod === "delivery" && (
                    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                      <h4 className="font-semibold text-primary">Delivery Address</h4>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special delivery instructions, timing preferences, etc..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment & Agreement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="relative z-50">
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="airtel">Airtel Money</SelectItem>
                            <SelectItem value="mtn">MTN Money</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-primary mb-2">Deposit Requirement</h4>
                    <p className="text-sm text-muted-foreground">
                      A 30% deposit is required to secure your order. We will contact you within 24 hours 
                      to confirm your order details and arrange the deposit payment. The remaining balance 
                      will be due upon pickup or delivery.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="depositAgreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium">
                            I agree to pay 30% deposit to secure this order *
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            By checking this box, you agree to our terms and conditions including the 30% deposit requirement.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Submit Order Request
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    By submitting this form, you agree to our terms and conditions. 
                    We'll contact you within 24 hours to confirm your order.
                  </p>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default function OrderPageWithBoundary() {
  return (
    <ErrorBoundary FallbackComponent={OrderErrorFallback}>
      <OrderPage />
    </ErrorBoundary>
  );
}