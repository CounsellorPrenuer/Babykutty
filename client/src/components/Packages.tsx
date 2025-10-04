import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

const packages: Package[] = [
  {
    name: "Student Compass Package",
    price: "₹8,499",
    description: "For academic and early career direction",
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
    features: [
      "90-minute intensive session",
      "Executive-level insights",
      "Personalized action plan",
      "Email support for 1 week",
    ],
  },
];

export default function Packages() {
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
    <section id="packages" className="py-20 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-packages-headline">
            Choose Your Guidance Package
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative backdrop-blur-lg bg-card/60 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                pkg.isHighlighted
                  ? "border-accent border-2 transform scale-105 md:scale-110"
                  : "border-card-border"
              }`}
              data-testid={`card-package-${index}`}
            >
              {pkg.isHighlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-12">
                <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2" data-testid={`text-package-name-${index}`}>
                  {pkg.name}
                </h3>
                <div className="font-serif text-4xl font-bold text-accent mb-2" data-testid={`text-package-price-${index}`}>
                  {pkg.price}
                </div>
                <p className="font-sans text-sm text-muted-foreground" data-testid={`text-package-description-${index}`}>
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3" data-testid={`text-package-feature-${index}-${featureIndex}`}>
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8">
                <Button
                  onClick={() => handlePayment(pkg.name, parseInt(pkg.price.replace(/[₹,]/g, "")))}
                  className={`w-full rounded-full ${
                    pkg.isHighlighted
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  } hover:scale-105 transition-all duration-300`}
                  data-testid={`button-get-started-${index}`}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
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
