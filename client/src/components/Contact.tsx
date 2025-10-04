import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, CheckCircle2, Users, Building2, GraduationCap, PlayCircle, ExternalLink } from "lucide-react";
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

        <div className="mt-16 sm:mt-20 md:mt-24">
          <div className="backdrop-blur-xl bg-card/50 border-2 border-card-border rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl">
            <div className="text-center mb-10 sm:mb-12">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 sm:mb-6">
                Powered by Mentoria's<br />
                <span className="bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                  Career Discovery Platform
                </span>
              </h3>
              <p className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto px-4">
                Every Leadcrest Consulting plan includes lifetime access to Mentoria: India's most trusted platform for career discovery, mentorship, and lifelong upskilling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
              <div className="backdrop-blur-sm bg-background/50 rounded-2xl p-6 sm:p-8 border border-card-border hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 group" data-testid="stat-students">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                </div>
                <div className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2 text-center">3,50,000+</div>
                <div className="font-sans text-xs sm:text-sm text-muted-foreground text-center">Students and Professionals Mentored</div>
              </div>

              <div className="backdrop-blur-sm bg-background/50 rounded-2xl p-6 sm:p-8 border border-card-border hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 group" data-testid="stat-corporate">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
                </div>
                <div className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2 text-center">240+</div>
                <div className="font-sans text-xs sm:text-sm text-muted-foreground text-center">Corporate Partners</div>
              </div>

              <div className="backdrop-blur-sm bg-background/50 rounded-2xl p-6 sm:p-8 border border-card-border hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 group" data-testid="stat-schools">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
                <div className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2 text-center">350+</div>
                <div className="font-sans text-xs sm:text-sm text-muted-foreground text-center">Schools and College Partners</div>
              </div>

              <div className="backdrop-blur-sm bg-background/50 rounded-2xl p-6 sm:p-8 border border-card-border hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 group" data-testid="stat-webinars">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                </div>
                <div className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2 text-center">1000+</div>
                <div className="font-sans text-xs sm:text-sm text-muted-foreground text-center">Hours of Career Webinars</div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-background/80 backdrop-blur-sm border-2 border-card-border rounded-2xl px-6 sm:px-8 py-4 sm:py-6 hover:border-accent/50 transition-all group">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="font-serif font-bold text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    MENTORIA
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-sans font-semibold text-sm sm:text-base"
                    data-testid="link-mentoria"
                  >
                    Career Discovery Platform
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
              <p className="mt-4 font-sans text-xs sm:text-sm text-muted-foreground">
                Click to explore Mentoria's comprehensive career platform
              </p>
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
