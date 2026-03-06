import { Button } from "@/components/ui/button";
import { Award, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroProps {
  onNavigate?: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[#00152a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bS0yIDJ2LTJoLTJ2Mmgyem0tMiAyaDJ2LTJoLTJ2MnptMi0yaDJ2Mmgydi0yaC0ydi0yaC0ydjJ6bTIgMnYyaDJ2LTJoLTJ6bTAtMmgtMnYyaDJ2LTJ6bS0yLTJoMnYtMmgtMnYyem0yLTJ2LTJoMnYtMmgtMnYtMmgtMnYyaC0ydjJoMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-1/4 left-1/4 w-64 h-64 opacity-5 animate-spin-slow" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" className="text-accent" />
          <path d="M100 20 L100 100 L180 100" stroke="currentColor" strokeWidth="2" className="text-accent" />
        </svg>
        <svg className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-5 animate-spin-slow-reverse" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" className="text-accent" />
          <path d="M100 40 L100 100 L160 100" stroke="currentColor" strokeWidth="2" className="text-accent" />
        </svg>
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight px-4" data-testid="text-hero-headline">
            Your Guide to a<br />
            <span className="bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent animate-gradient">
              Fulfilling Career
            </span>
          </h1>
          
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-accent mb-2 sm:mb-4 px-4 drop-shadow-lg" data-testid="text-hero-tagline">
            Navigating Your Path to Professional Success
          </p>
          
          <p className="font-sans text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto px-4" data-testid="text-hero-subheadline">
            Expert guidance for students, graduates, and professionals to find clarity, direction, and achieve their ultimate career goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <Button
            size="lg"
            onClick={() => handleNavigate("services")}
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 rounded-full px-6 sm:px-8 text-base sm:text-lg font-semibold min-h-12 sm:min-h-14"
            data-testid="button-explore-services"
          >
            Explore Services
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleNavigate("contact")}
            className="w-full sm:w-auto backdrop-blur-sm bg-white/10 border-2 border-white/50 text-primary-foreground hover:bg-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-full px-6 sm:px-8 text-base sm:text-lg min-h-12 sm:min-h-14"
            data-testid="button-book-consultation"
          >
            Book a Free Consultation
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl hover:bg-white/20 hover:scale-105 hover:-translate-y-2 transition-all duration-500 group"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-stat-${index}`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-2 group-hover:text-accent transition-colors" data-testid={`text-stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="font-sans text-xs sm:text-sm md:text-base text-primary-foreground/80" data-testid={`text-stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-accent" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
