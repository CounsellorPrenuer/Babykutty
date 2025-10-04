import { Compass, Map, TrendingUp, ArrowLeftRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Compass,
    title: "Career Exploration & Assessment",
    description: "Using psychometric tools to discover your true north.",
  },
  {
    icon: Map,
    title: "Educational Pathway Planning",
    description: "Mapping the best academic route for students.",
  },
  {
    icon: TrendingUp,
    title: "Professional Development Coaching",
    description: "Helping professionals advance and climb the ladder.",
  },
  {
    icon: ArrowLeftRight,
    title: "Career Transition Strategy",
    description: "Guiding you confidently through a change in your professional journey.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-services-headline">
            Chart Your Course With Our Services
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-card/60 border border-card-border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group"
              data-testid={`card-service-${index}`}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-serif font-semibold text-xl text-card-foreground mb-3" data-testid={`text-service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed" data-testid={`text-service-description-${index}`}>
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
