import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sanityClient } from "@/lib/sanity";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  originalAmount: number;
}

export default function CheckoutDialog({
  isOpen,
  onOpenChange,
  planName,
  originalAmount,
}: CheckoutDialogProps) {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsVerifyingCoupon(true);
    try {
      const query = `*[_type == "coupon" && code == $code && active == true][0]`;
      const coupon = await sanityClient.fetch(query, { code: couponCode.toUpperCase() });

      if (coupon) {
        setAppliedCoupon(coupon);
        toast({
          title: "Coupon Applied!",
          description: `You saved ₹${coupon.discountAmount}.`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "This coupon code is invalid or expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Coupon fetch error:", error);
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const finalAmount = appliedCoupon 
    ? Math.max(0, originalAmount - appliedCoupon.discountAmount)
    : originalAmount;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all details.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiRequest("POST", "/api/create-order", {
        planName,
        amount: finalAmount,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        couponCode: appliedCoupon?.code,
      });
      
      const data = await res.json();

      if (typeof window.Razorpay !== "undefined") {
        const options = {
          key: data.key,
          amount: finalAmount * 100,
          currency: "INR",
          name: "Career Compass",
          description: planName,
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
                description: "We'll contact you shortly to begin your journey.",
              });
              onOpenChange(false);
            } catch (error) {
              toast({
                title: "Verification Failed",
                description: "Payment successful but verification failed. Please contact us.",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone,
          },
          theme: { color: "#D4AF37" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Complete Your Purchase</DialogTitle>
          <DialogDescription className="font-sans">
            Plan: {planName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePayment} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="John Doe"
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              placeholder="+91 98765 43210"
              value={userDetails.phone}
              onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Coupon Code</Label>
            <div className="flex gap-2">
              <Input
                placeholder="PROMO20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleApplyCoupon}
                disabled={isVerifyingCoupon}
              >
                Apply
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Total Amount:</span>
              <div className="text-right">
                {appliedCoupon && (
                  <div className="text-sm text-muted-foreground line-through">₹{originalAmount}</div>
                )}
                <div className="text-2xl font-bold text-accent">₹{finalAmount}</div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground font-bold h-12">
              PROCEED TO PAYMENT
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
