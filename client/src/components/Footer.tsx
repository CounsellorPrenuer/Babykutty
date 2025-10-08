import logoImage from "@assets/logo_1759561523289.png";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Packages", href: "#packages" },
    { name: "Blog", href: "#blog" },
  ];

  const services = [
    "Career Exploration",
    "Educational Planning",
    "Professional Coaching",
    "Career Transition",
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-primary to-[#00152a] text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={logoImage}
              alt="Career Compass"
              className="h-18 sm:h-24 w-auto mb-4 sm:mb-6 hover:scale-105 transition-transform"
              data-testid="img-footer-logo"
            />
            <p className="font-serif text-base sm:text-lg text-accent italic mb-4 sm:mb-6">
              Navigating Your Path to Professional Success
            </p>
            <p className="font-sans text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
              Expert career guidance for students, graduates, and professionals.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-accent">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-sans text-sm sm:text-base text-primary-foreground/80 hover:text-accent hover:translate-x-2 transition-all inline-flex items-center gap-2 group"
                    data-testid={`link-footer-${link.name.toLowerCase()}`}
                  >
                    <span className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all"></span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-accent">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service} className="font-sans text-sm sm:text-base text-primary-foreground/80 flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-accent">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:counsellor@careercompassplus.com"
                  className="font-sans text-sm sm:text-base text-primary-foreground/80 hover:text-accent transition-colors break-all"
                >
                  counsellor@careercompassplus.com
                </a>
              </div>
              <div className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+918089545498"
                  className="font-sans text-sm sm:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  +91 80895 45498
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/30 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-primary-foreground/60 text-xs sm:text-sm text-center sm:text-left" data-testid="text-copyright">
              © {currentYear} Career Compass. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs sm:text-sm">
              <button className="text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </button>
              <button className="text-primary-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
          <br />
          <p className="font-sans text-primary-foreground/60 text-xs sm:text-sm text-center">
            In partnership with <span className="font-bold">Mentoria</span> for enhanced career guidance services.
          </p>
        </div>
      </div>
    </footer>
  );
}
