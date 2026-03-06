import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, X, Star, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";
import CheckoutDialog from "./CheckoutDialog";

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  planName: string;
  price: string;
  features: Feature[];
  packageType: "standard" | "custom";
  category: string;
  description?: string;
}

export default function Packages() {
  const [activeTab, setActiveTab] = useState("8-9 Students");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);

  const categories = ["8-9 Students", "10-12 Students", "Graduates", "Working Professionals"];

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await sanityClient.fetch(`*[_type == "package"]`);
        setPackages(data);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const filteredStandard = packages.filter(
    (p) => p.packageType === "standard" && p.category === activeTab
  );

  const customPackages = packages.filter((p) => p.packageType === "custom");

  const renderPackageCard = (pkg: Package, index: number) => {
    // Robust price parsing for strings like "₹5,500" or "5500"
    const amount = parseInt(pkg.price.toString().replace(/[^\d]/g, "")) || 0;
    const isPremium = pkg.planName.toLowerCase().includes("plus");

    return (
      <Card
        key={index}
        className={`flex flex-col h-full relative backdrop-blur-xl bg-card/80 border-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${
          isPremium
            ? "border-accent shadow-xl shadow-accent/20"
            : "border-card-border hover:border-accent/50"
        }`}
      >
        {isPremium && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              PREMIUM
            </div>
          </div>
        )}

        <CardHeader className="text-center pb-6 pt-10 relative">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
            isPremium ? 'bg-gradient-to-br from-accent to-yellow-400' : 'bg-gradient-to-br from-accent/20 to-accent/10'
          }`}>
            {isPremium ? (
              <Sparkles className={`w-8 h-8 ${isPremium ? 'text-accent-foreground' : 'text-accent'}`} />
            ) : (
              <Star className="w-8 h-8 text-accent" />
            )}
          </div>
          <h3 className="font-serif font-bold text-xl text-card-foreground mb-3">{pkg.planName}</h3>
          <div className="mb-3">
            <span className="font-serif text-4xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
              {pkg.price}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-6 flex-grow">
          {pkg.description && (
            <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">
              {pkg.description}
            </p>
          )}
          <ul className="space-y-3">
            {pkg.features?.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  feature.included ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {feature.included ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <X className="w-3 h-3 text-red-600" />
                  )}
                </div>
                <span className={`text-sm ${feature.included ? 'text-card-foreground' : 'text-muted-foreground line-through'}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-8 px-6 pb-8 mt-auto">
          <Button
            onClick={() => {
              setSelectedPkg({ name: pkg.planName, price: amount });
              setIsCheckoutOpen(true);
            }}
            className={`w-full rounded-full min-h-12 text-base font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ${
              isPremium
                ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:shadow-accent/50"
                : "bg-primary text-primary-foreground"
            }`}
          >
            BUY NOW
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="packages" className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold tracking-wider uppercase block mb-4">Pricing</span>
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-foreground mb-6">
            Choose Your Guidance Package
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
          </div>
        ) : (
          <>
            {/* Standard Packages */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                      activeTab === cat
                        ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground shadow-lg scale-105"
                        : "bg-card border-2 border-card-border text-foreground hover:scale-105"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
                {filteredStandard.map((pkg, i) => renderPackageCard(pkg, i))}
              </div>
            </div>

            {/* Custom Packages Section */}
            <div className="pt-20 border-t border-card-border">
              <div className="text-center mb-16">
                <h3 className="font-serif font-bold text-3xl md:text-5xl mb-6">Customize Your Plan</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Pick specific modules tailored to your immediate needs. Premium guidance, one block at a time.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customPackages.map((pkg, i) => renderPackageCard(pkg, i))}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedPkg && (
        <CheckoutDialog
          isOpen={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
          planName={selectedPkg.name}
          originalAmount={selectedPkg.price}
        />
      )}
    </section>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
