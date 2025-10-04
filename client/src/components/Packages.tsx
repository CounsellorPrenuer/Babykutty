import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useEffect, useState } from "react";

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
  icon: any;
}

const packages: Package[] = [
  {
    name: "Student Compass Package",
    price: "₹8,499",
    description: "For academic and early career direction",
    icon: Star,
    features: [
      "Comprehensive career assessment",
      "Academic pathway guidance",
      "Skill development roadmap",
      "2 follow-up sessions",
    ],
  },
  {
    name: "Professional Navigator Package",
    price: "₹15,999",
    description: "For mid-career professionals seeking advancement or change",
    icon: Crown,
    features: [
      "In-depth career analysis",
      "Strategic career planning",
      "Interview & negotiation coaching",
      "4 follow-up sessions",
      "Resume optimization",
    ],
    isHighlighted: true,
  },
  {
    name: "Executive North Star Session",
    price: "₹7,499",
    description: "A premium, single deep-dive strategy session",
    icon: Zap,
    features: [
      "90-minute intensive session",
      "Executive-level insights",
      "Personalized action plan",
      "Email support for 1 week",
    ],
  },
];

export default function Packages() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setTimeout(() => {
              setVisibleCards(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 200);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-package-card]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handlePayment = (packageName: string, amount: number) => {
    console.log(`Payment initiated for ${packageName}: ₹${amount}`);
    
    if (typeof window.Razorpay !== "undefined") {
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: amount * 100,
        currency: "INR",
        name: "Career Compass",
        description: packageName,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          alert("Payment successful! We'll contact you shortly.");
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
      alert(`Payment gateway loading... Package: ${packageName}, Amount: ₹${amount}`);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              data-package-card
              data-index={index}
              className={`transition-all duration-700 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card
                className={`h-full relative backdrop-blur-xl bg-card/80 border-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${
                  pkg.isHighlighted
                    ? "border-accent shadow-xl shadow-accent/20 md:scale-105"
                    : "border-card-border hover:border-accent/50"
                }`}
                data-testid={`card-package-${index}`}
              >
                {pkg.isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-lg ${
                  pkg.isHighlighted ? 'from-accent to-yellow-400' : 'from-primary to-primary/50'
                }`}></div>
                
                <CardHeader className="text-center pb-6 sm:pb-8 pt-10 sm:pt-12 relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                    pkg.isHighlighted ? 'bg-gradient-to-br from-accent to-yellow-400' : 'bg-gradient-to-br from-accent/20 to-accent/10'
                  }`}>
                    <pkg.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${pkg.isHighlighted ? 'text-accent-foreground' : 'text-accent'}`} />
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-card-foreground mb-3 sm:mb-4 px-2" data-testid={`text-package-name-${index}`}>
                    {pkg.name}
                  </h3>
                  
                  <div className="mb-3 sm:mb-4">
                    <span className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent" data-testid={`text-package-price-${index}`}>
                      {pkg.price}
                    </span>
                  </div>
                  
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground px-2" data-testid={`text-package-description-${index}`}>
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className="px-4 sm:px-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3" data-testid={`text-package-feature-${index}-${featureIndex}`}>
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                        </div>
                        <span className="font-sans text-sm sm:text-base text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8">
                  <Button
                    onClick={() => handlePayment(pkg.name, parseInt(pkg.price.replace(/[₹,]/g, "")))}
                    className={`w-full rounded-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ${
                      pkg.isHighlighted
                        ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:shadow-accent/50"
                        : "bg-primary text-primary-foreground"
                    }`}
                    data-testid={`button-get-started-${index}`}
                  >
                    Get Started Now
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
