import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { SiFacebook } from "react-icons/si";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Contact Us</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4" data-testid="text-contact-headline">
            Get In Touch
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">
          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div className="backdrop-blur-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-8 sm:p-12 text-center shadow-2xl animate-slide-in" data-testid="text-success-message">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-green-800 text-2xl sm:text-3xl font-serif font-bold mb-3">Thank You!</div>
                <p className="text-green-700 font-sans text-base sm:text-lg">We've received your message and will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-xl bg-card/50 border-2 border-card-border rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="font-sans font-semibold text-foreground mb-2 block text-sm sm:text-base">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-2 border-input focus:border-accent rounded-lg transition-all h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="John Doe"
                      data-testid="input-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-sans font-semibold text-foreground mb-2 block text-sm sm:text-base">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-2 border-input focus:border-accent rounded-lg transition-all h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="john@example.com"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="font-sans font-semibold text-foreground mb-2 block text-sm sm:text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-2 border-input focus:border-accent rounded-lg transition-all h-11 sm:h-12 text-sm sm:text-base"
                    placeholder="+91 99999 99999"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-sans font-semibold text-foreground mb-2 block text-sm sm:text-base">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-2 border-input focus:border-accent rounded-lg resize-none transition-all text-sm sm:text-base"
                    placeholder="Tell us about your career goals..."
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:scale-105 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 rounded-full min-h-12 sm:min-h-14 text-base sm:text-lg font-semibold"
                  data-testid="button-submit"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="backdrop-blur-xl bg-card/50 border-2 border-card-border rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:from-accent/30 group-hover:to-accent/20 transition-all shadow-lg">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-2 text-sm sm:text-base">Email</div>
                    <a
                      href="mailto:babykutty67@gmail.com"
                      className="font-sans text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                      data-testid="link-email"
                    >
                      babykutty67@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:from-accent/30 group-hover:to-accent/20 transition-all shadow-lg">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-2 text-sm sm:text-base">Phone</div>
                    <a
                      href="tel:+919995178849"
                      className="font-sans text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                      data-testid="link-phone"
                    >
                      +91 99951 78849
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:from-accent/30 group-hover:to-accent/20 transition-all shadow-lg">
                    <SiFacebook className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-2 text-sm sm:text-base">Facebook</div>
                    <a
                      href="#"
                      className="font-sans text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                      data-testid="link-facebook"
                    >
                      Connect on Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
