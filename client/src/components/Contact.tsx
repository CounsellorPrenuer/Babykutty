import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";
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
    <section id="contact" className="py-20 md:py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-contact-headline">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center" data-testid="text-success-message">
                <div className="text-green-600 text-2xl font-serif font-bold mb-2">Thank You!</div>
                <p className="text-green-700 font-sans">We've received your message and will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-sans font-semibold text-foreground mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-2 border-input focus:border-accent rounded-lg"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-sans font-semibold text-foreground mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-2 border-input focus:border-accent rounded-lg"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-sans font-semibold text-foreground mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-2 border-input focus:border-accent rounded-lg"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-sans font-semibold text-foreground mb-2 block">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-2 border-input focus:border-accent rounded-lg resize-none"
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:scale-105 transition-all duration-300 rounded-full"
                  data-testid="button-submit"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-serif font-bold text-2xl text-foreground mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-1">Email</div>
                    <a
                      href="mailto:babykutty67@gmail.com"
                      className="font-sans text-muted-foreground hover:text-accent transition-colors"
                      data-testid="link-email"
                    >
                      babykutty67@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-1">Phone</div>
                    <a
                      href="tel:+919995178849"
                      className="font-sans text-muted-foreground hover:text-accent transition-colors"
                      data-testid="link-phone"
                    >
                      +91 99951 78849
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SiFacebook className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-foreground mb-1">Facebook</div>
                    <a
                      href="#"
                      className="font-sans text-muted-foreground hover:text-accent transition-colors"
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
    </section>
  );
}
