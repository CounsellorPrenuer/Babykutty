import logoImage from "@assets/logo_1759556754448.png";
import { SiFacebook } from "react-icons/si";

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
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img
              src={logoImage}
              alt="Career Compass"
              className="h-16 w-auto mb-4"
              data-testid="img-footer-logo"
            />
            <p className="font-sans text-primary-foreground/80 text-sm leading-relaxed">
              Navigating Your Path to Professional Success
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-sans text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                    data-testid={`link-footer-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="font-sans text-primary-foreground/80 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                data-testid="link-footer-facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <p className="font-sans text-primary-foreground/80 text-sm mb-2">
                <a href="mailto:babykutty67@gmail.com" className="hover:text-accent transition-colors">
                  babykutty67@gmail.com
                </a>
              </p>
              <p className="font-sans text-primary-foreground/80 text-sm">
                <a href="tel:+919995178849" className="hover:text-accent transition-colors">
                  +91 99951 78849
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/30 pt-8 text-center">
          <p className="font-sans text-primary-foreground/60 text-sm" data-testid="text-copyright">
            © {currentYear} Career Compass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
