import { Compass, Map, TrendingUp, ArrowLeftRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const services = [
  {
    icon: Compass,
    title: "Career Exploration & Assessment",
    description: "Using psychometric tools to discover your true north.",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Map,
    title: "Educational Pathway Planning",
    description: "Mapping the best academic route for students.",
    gradient: "from-green-500/20 to-teal-500/20",
  },
  {
    icon: TrendingUp,
    title: "Professional Development Coaching",
    description: "Helping professionals advance and climb the ladder.",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: ArrowLeftRight,
    title: "Career Transition Strategy",
    description: "Guiding you confidently through a change in your professional journey.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

export default function Services() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setTimeout(() => {
              setVisibleCards(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 150);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-service-card]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Our Services</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4" data-testid="text-services-headline">
            Chart Your Course With<br className="hidden sm:block" /> Our Services
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              data-service-card
              data-index={index}
              className={`transition-all duration-700 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card
                className="h-full backdrop-blur-xl bg-card/80 border-2 border-card-border hover:border-accent/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 group overflow-hidden relative"
                data-testid={`card-service-${index}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-colors"></div>
                  </div>
                  
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-card-foreground mb-3 group-hover:text-accent transition-colors" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-accent font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
