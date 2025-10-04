import { Button } from "@/components/ui/button";
import { Award, Users, TrendingUp } from "lucide-react";

interface HeroProps {
  onNavigate?: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { icon: Award, value: "20+", label: "Years of Experience" },
    { icon: Users, value: "1500+", label: "Careers Shaped" },
    { icon: TrendingUp, value: "97%", label: "Client Success Rate" },
  ];

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      const element = document.querySelector(`#${section}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="compass-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" />
              <path d="M10 0 L10 20 M0 10 L20 10" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#compass-pattern)" />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 border-4 border-accent/50 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-32 text-center">
        <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-6 leading-tight" data-testid="text-hero-headline">
          Your Guide to a Fulfilling Career
        </h1>
        
        <p className="font-serif text-2xl md:text-3xl text-accent mb-4" data-testid="text-hero-tagline">
          Navigating Your Path to Professional Success
        </p>
        
        <p className="font-sans text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-12" data-testid="text-hero-subheadline">
          Expert guidance for students, graduates, and professionals to find clarity, direction, and achieve their ultimate career goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            onClick={() => handleNavigate("services")}
            className="bg-accent text-accent-foreground hover:scale-105 transition-all duration-300 rounded-full px-8 text-lg shadow-lg"
            data-testid="button-explore-services"
          >
            Explore Services
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleNavigate("contact")}
            className="backdrop-blur-sm bg-white/20 border-2 border-white/50 text-primary-foreground hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full px-8 text-lg"
            data-testid="button-book-consultation"
          >
            Book a Free Consultation
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-6 shadow-xl hover:bg-white/20 transition-all duration-300"
              data-testid={`card-stat-${index}`}
            >
              <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="font-serif font-bold text-3xl md:text-4xl text-primary-foreground mb-2" data-testid={`text-stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="font-sans text-sm md:text-base text-primary-foreground/80" data-testid={`text-stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
