import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, X, Star, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { sanityClient } from "@/lib/sanity";
import groq from "groq";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  planName: string;
  price: string;
  features: Feature[];
  type: "standard" | "premium";
  paymentButtonId?: string;
  category: string;
  categoryLabel: string;
  packageType?: 'standard' | 'custom';
  subgroup?: string;
}

interface Category {
  id: string;
  label: string;
  packages: Package[];
}

interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
}

export default function Packages() {
  const [standardCategories, setStandardCategories] = useState<Category[]>([]);
  const [customPackages, setCustomPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = groq`*[_type == "package"] | order(category asc)`;
        const data: Package[] = await sanityClient.fetch(query);

        // Separate Standard and Custom
        const standard = data.filter(pkg => pkg.packageType === 'standard' || !pkg.packageType);
        const custom = data.filter(pkg => pkg.packageType === 'custom');

        // Group standard by category (subgroup)
        const grouped = standard.reduce((acc: any, pkg: any) => {
          const categoryId = pkg.subgroup || pkg.category;
          const categoryLabel = pkg.subgroup || pkg.categoryLabel;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              id: categoryId,
              label: categoryLabel,
              packages: []
            };
          }
          acc[categoryId].packages.push(pkg);
          return acc;
        }, {});

        const categoryList = Object.values(grouped) as Category[];
        setStandardCategories(categoryList);
        setCustomPackages(custom);

        if (categoryList.length > 0) {
          setActiveTab(categoryList[0].id);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Error",
          description: "Failed to load packages from Sanity.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsVerifyingCoupon(true);
    try {
      const query = groq`*[_type == "coupon" && code == $code && isActive == true][0]`;
      const coupon: Coupon = await sanityClient.fetch(query, { code: couponCode.toUpperCase() });

      if (coupon) {
        setAppliedCoupon(coupon);
        toast({ title: "Coupon Applied", description: "Discount has been applied to your total." });
      } else {
        setAppliedCoupon(null);
        toast({ title: "Invalid Coupon", description: "This coupon code is not valid.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not verify coupon.", variant: "destructive" });
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const calculateTotal = (pkgPriceStr: string) => {
    // Extract numbers from something like "₹5,500" or "Rs.5999"
    const basePrice = parseInt(pkgPriceStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(basePrice)) return 0;

    if (!appliedCoupon) return basePrice;

    if (appliedCoupon.discountType === 'percentage') {
      const discount = (basePrice * appliedCoupon.discountValue) / 100;
      return Math.max(0, basePrice - discount);
    } else {
      return Math.max(0, basePrice - appliedCoupon.discountValue);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !window.Razorpay) return;

    setIsProcessingPayment(true);
    const amount = calculateTotal(selectedPackage.price);

    try {
      const { apiRequest } = await import("@/lib/queryClient");
      const orderRes = await apiRequest("POST", "/api/create-order", {
        amount,
        planName: selectedPackage.planName,
        name: checkoutForm.name,
        email: checkoutForm.email,
        phone: checkoutForm.phone
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Career Compass Plus",
        description: selectedPackage.planName,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await apiRequest("POST", "/api/verify-payment", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: orderData.paymentId,
              email: checkoutForm.email,
              phone: checkoutForm.phone
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: "Thank you for your purchase. We will contact you soon.",
              });
              setIsCheckoutOpen(false);
              setAppliedCoupon(null);
              setCouponCode("");
              setCheckoutForm({ name: "", email: "", phone: "" });
            } else {
              throw new Error(verifyData.error || "Verification failed");
            }
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone,
        },
        theme: {
          color: "#D4AF37",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };


  const activeCategory = standardCategories.find((cat) => cat.id === activeTab);

  if (isLoading) {
    return <div className="py-24 text-center">Loading packages...</div>;
  }


  return (
    <section id="packages" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Standard Packages Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Comprehensive Guidance</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4">
            Standard Mentoria Packages 🎓
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-6">
            These are the main comprehensive packages designed for specific stages of your journey.
          </p>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="mb-12 sm:mb-16">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {standardCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all duration-300 ${activeTab === category.id
                  ? "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground shadow-lg scale-105"
                  : "bg-card border-2 border-card-border text-foreground hover:border-accent/50 hover:scale-105"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-24">
          {activeCategory?.packages.map((pkg, index) => (
            <PackageCard key={index} pkg={pkg} index={index} onSelect={() => {
              setSelectedPackage(pkg);
              setIsCheckoutOpen(true);
            }} />
          ))}
        </div>

        {/* Custom Packages Section */}
        <hr className="border-card-border mb-24" />

        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Personalized Flexibility</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-3xl text-foreground mb-4 sm:mb-6 px-4">
            Want To Customise Your Mentorship Plan?
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-6">
            If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more of the following:
          </p>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {customPackages.map((pkg, index) => (
            <PackageCard key={index} pkg={pkg} index={index} isCustom onSelect={() => {
              setSelectedPackage(pkg);
              setIsCheckoutOpen(true);
            }} />
          ))}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              {selectedPackage?.planName} - Original Price: {selectedPackage?.price}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckout} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Full Name</Label>
              <Input
                id="checkout-name"
                required
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-email">Email</Label>
              <Input
                id="checkout-email"
                type="email"
                required
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Phone Number</Label>
              <Input
                id="checkout-phone"
                type="tel"
                required
                value={checkoutForm.phone}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="coupon">Add Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. DISCOUNT50"
                  className={appliedCoupon ? "border-green-500" : ""}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={isVerifyingCoupon || !couponCode}
                >
                  {isVerifyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3" /> Coupon applied successfully
                </p>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total to Pay:</span>
              <span className="text-accent">
                ₹{selectedPackage ? calculateTotal(selectedPackage.price).toLocaleString() : 0}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground mt-6"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Pay via Razorpay"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function PackageCard({ pkg, index, isCustom = false, onSelect }: { pkg: Package, index: number, isCustom?: boolean, onSelect?: () => void }) {
  return (
    <Card
      className={`h-full relative backdrop-blur-xl bg-card/80 border-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${pkg.type === "premium" || isCustom
        ? "border-accent shadow-xl shadow-accent/20"
        : "border-card-border hover:border-accent/50"
        } ${pkg.type === "premium" && !isCustom ? "md:scale-105" : ""}`}
    >
      {(pkg.type === "premium" || isCustom) && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            {isCustom ? "CUSTOM" : "PREMIUM"}
          </div>
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-lg ${pkg.type === "premium" || isCustom ? 'from-accent to-yellow-400' : 'from-primary to-primary/50'
        }`}></div>

      <CardHeader className="text-center pb-6 sm:pb-8 pt-10 sm:pt-12 relative">
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-card-foreground mb-3 sm:mb-4 px-2">
          {pkg.planName}
        </h3>

        <div className="mb-3 sm:mb-4">
          <span className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
            {pkg.price}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <ul className="space-y-3 sm:space-y-4">
          {pkg.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mt-0.5 ${feature.included ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                {feature.included ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                ) : (
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                )}
              </div>
              <span className={`font-sans text-sm sm:text-base ${feature.included ? 'text-card-foreground' : 'text-muted-foreground line-through'
                }`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8 flex justify-center mt-auto z-10">
        {pkg.paymentButtonId ? (
          <Button
            className="w-full rounded-full min-h-11 sm:min-h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:scale-105 hover:shadow-lg transition-all"
            onClick={onSelect}
          >
            Buy Now
          </Button>
        ) : (
          <Button
            className="w-full rounded-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => window.location.href = '#contact'}
          >
            Inquire Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
