import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, X, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  planName: string;
  price: string;
  features: Feature[];
  type: "standard" | "premium";
}

interface Category {
  id: string;
  label: string;
  packages: Package[];
}

const categories: Category[] = [
  {
    id: "8-9",
    label: "8-9 STUDENTS",
    packages: [
      {
        planName: "Discover",
        price: "₹5,500",
        type: "standard",
        features: [
          { text: "Psychometric assessment to measure your interests", included: true },
          { text: "1 career counselling session with Mentoria's expert career coaches", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Invites to live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV building during internship/graduation", included: false },
        ],
      },
      {
        planName: "Discover plus+",
        price: "₹15,000",
        type: "premium",
        features: [
          { text: "Psychometric assessments to measure your interests, personality and abilities", included: true },
          { text: "8 career counselling sessions (1 every year) with Mentoria's expert career coaches until graduation", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Invites to live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV building during internship/graduation", included: true },
        ],
      },
    ],
  },
  {
    id: "10-12",
    label: "10-12 STUDENTS",
    packages: [
      {
        planName: "Achieve Online",
        price: "₹5,999",
        type: "standard",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews during internship/graduation", included: false },
        ],
      },
      {
        planName: "Achieve Plus+",
        price: "₹10,599",
        type: "premium",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "4 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews during internship/graduation", included: true },
        ],
      },
    ],
  },
  {
    id: "college",
    label: "COLLEGE GRADUATES",
    packages: [
      {
        planName: "Ascend Online",
        price: "₹6,499",
        type: "standard",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews for job application", included: false },
        ],
      },
      {
        planName: "Ascend Plus+",
        price: "₹10,599",
        type: "premium",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "3 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews for job application", included: true },
        ],
      },
    ],
  },
  {
    id: "working",
    label: "WORKING PROFESSIONALS",
    packages: [
      {
        planName: "Ascend Online",
        price: "₹6,499",
        type: "standard",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews for job application", included: false },
        ],
      },
      {
        planName: "Ascend Plus+",
        price: "₹10,599",
        type: "premium",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "2 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews for job application", included: true },
        ],
      },
    ],
  },
];

export default function Packages() {
  const [activeTab, setActiveTab] = useState("8-9");
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setVisibleCards([]);
    const timer = setTimeout(() => {
      setVisibleCards([true, true]);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const activeCategory = categories.find((cat) => cat.id === activeTab) || categories[0];

  const createOrderMutation = useMutation({
    mutationFn: async ({ planName, amount }: { planName: string; amount: number }) => {
      const res = await apiRequest("POST", "/api/create-order", { planName, amount });
      return await res.json();
    },
    onSuccess: (data: any, variables) => {
      if (typeof window.Razorpay !== "undefined") {
        const options = {
          key: data.key,
          amount: variables.amount * 100,
          currency: "INR",
          name: "Career Compass",
          description: variables.planName,
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              await apiRequest("POST", "/api/verify-payment", {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: data.paymentId,
              });
              toast({
                title: "Payment Successful!",
                description: "We'll contact you shortly to begin your career guidance journey.",
              });
            } catch (error) {
              toast({
                title: "Payment Verification Failed",
                description: "Please contact us with your payment details.",
                variant: "destructive",
              });
            }
          },
          prefill: {
            email: "babykutty67@gmail.com",
          },
          theme: {
            color: "#D4AF37",
          },
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "Payment Gateway Loading",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayment = (planName: string, amount: number) => {
    createOrderMutation.mutate({ planName, amount });
  };

  return (
    <section id="packages" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Pricing</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4" data-testid="text-packages-headline">
            Choose Your<br className="hidden sm:block" /> Guidance Package
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="mb-12 sm:mb-16">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === category.id
                    ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground shadow-lg scale-105"
                    : "bg-card border-2 border-card-border text-foreground hover:border-accent/50 hover:scale-105"
                }`}
                data-testid={`tab-${category.id}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {activeCategory.packages.map((pkg, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card
                className={`h-full relative backdrop-blur-xl bg-card/80 border-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${
                  pkg.type === "premium"
                    ? "border-accent shadow-xl shadow-accent/20 md:scale-105"
                    : "border-card-border hover:border-accent/50"
                }`}
                data-testid={`card-package-${index}`}
              >
                {pkg.type === "premium" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      PREMIUM
                    </div>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-lg ${
                  pkg.type === "premium" ? 'from-accent to-yellow-400' : 'from-primary to-primary/50'
                }`}></div>
                
                <CardHeader className="text-center pb-6 sm:pb-8 pt-10 sm:pt-12 relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                    pkg.type === "premium" ? 'bg-gradient-to-br from-accent to-yellow-400' : 'bg-gradient-to-br from-accent/20 to-accent/10'
                  }`}>
                    {pkg.type === "premium" ? (
                      <Sparkles className={`w-8 h-8 sm:w-10 sm:h-10 ${pkg.type === "premium" ? 'text-accent-foreground' : 'text-accent'}`} />
                    ) : (
                      <Star className={`w-8 h-8 sm:w-10 sm:h-10 text-accent`} />
                    )}
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-card-foreground mb-3 sm:mb-4 px-2" data-testid={`text-package-name-${index}`}>
                    {pkg.planName}
                  </h3>
                  
                  <div className="mb-3 sm:mb-4">
                    <span className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent" data-testid={`text-package-price-${index}`}>
                      {pkg.price}
                    </span>
                  </div>
                  
                  <div className="inline-block px-3 sm:px-4 py-1 bg-accent/10 rounded-full">
                    <span className="text-xs sm:text-sm font-semibold text-accent uppercase">
                      {pkg.type === "premium" ? "Premium Plan" : "Standard Plan"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-4 sm:px-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3" data-testid={`text-package-feature-${index}-${featureIndex}`}>
                        <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mt-0.5 ${
                          feature.included ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                          )}
                        </div>
                        <span className={`font-sans text-sm sm:text-base ${
                          feature.included ? 'text-card-foreground' : 'text-muted-foreground line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8">
                  <Button
                    onClick={() => handlePayment(pkg.planName, parseInt(pkg.price.replace(/[₹,]/g, "")))}
                    className={`w-full rounded-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ${
                      pkg.type === "premium"
                        ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:shadow-accent/50"
                        : "bg-primary text-primary-foreground"
                    }`}
                    data-testid={`button-buy-now-${index}`}
                  >
                    BUY NOW
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
