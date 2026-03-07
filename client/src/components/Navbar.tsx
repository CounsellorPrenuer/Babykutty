import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.png";

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsInHero(window.scrollY < window.innerHeight - 100);

      const sections = ["about", "services", "blog", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }

      if (window.scrollY < window.innerHeight / 2) {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#packages" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === "#") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're on a subpage (like /blog/:id), navigate back to home first
      navigate("/");
      // Wait for navigation and then scroll
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-xl shadow-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0 group cursor-pointer" onClick={() => handleNavClick("#")}>
            <img
              src={logoImage}
              alt="Career Compass"
              className="h-12 sm:h-14 w-auto group-hover:scale-105 transition-transform"
              data-testid="img-logo"
            />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const sectionId = link.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-foreground ${isActive ? 'text-accent' : ''} hover:text-accent font-sans font-medium transition-all duration-200 relative group text-sm lg:text-base`}
                    data-testid={`link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-accent to-yellow-400 transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => handleNavClick("#contact")}
              className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 rounded-full px-4 lg:px-6 font-semibold text-sm lg:text-base"
              data-testid="button-find-direction"
            >
              Find Your Direction
            </Button>
          </div>

          <button
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-menu-toggle"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border shadow-lg animate-slide-down">
          <div className="px-4 sm:px-6 py-4 space-y-3">
            {navLinks.map((link) => {
              const sectionId = link.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`block w-full text-left ${isActive ? 'text-accent bg-accent/10' : 'text-foreground'} hover:text-accent hover:bg-accent/5 font-sans font-medium transition-all py-2 px-4 rounded-lg`}
                  data-testid={`link-mobile-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </button>
              );
            })}
            <Button
              onClick={() => handleNavClick("#contact")}
              className="w-full bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground rounded-full shadow-lg mt-2"
              data-testid="button-mobile-find-direction"
            >
              Find Your Direction
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}
