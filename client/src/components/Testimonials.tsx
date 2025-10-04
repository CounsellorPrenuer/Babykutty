import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Priya Menon",
    role: "Software Engineer",
    initials: "PM",
    quote: "Babikutty's guidance helped me transition from teaching to tech. His personalized approach gave me the confidence to pursue my dream career.",
    rating: 5,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Rahul Krishnan",
    role: "MBA Graduate",
    initials: "RK",
    quote: "The career assessment tools opened my eyes to opportunities I never considered. Within 6 months, I landed my ideal role in consulting.",
    rating: 5,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Anjali Sharma",
    role: "Marketing Executive",
    initials: "AS",
    quote: "Career Compass provided the strategic direction I needed for my mid-career pivot. The support was exceptional throughout my journey.",
    rating: 5,
    color: "from-purple-500 to-purple-600",
  },
];

export default function Testimonials() {
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

    document.querySelectorAll('[data-testimonial-card]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">Testimonials</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4" data-testid="text-testimonials-headline">
            Success Stories
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-testimonial-card
              data-index={index}
              className={`transition-all duration-700 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card
                className="h-full backdrop-blur-xl bg-card border-2 border-card-border hover:border-accent/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 group relative overflow-hidden"
                data-testid={`card-testimonial-${index}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${testimonial.color} opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`}></div>
                
                <CardContent className="p-6 sm:p-8 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="font-sans text-sm sm:text-base text-card-foreground italic leading-relaxed mb-6 sm:mb-8" data-testid={`text-testimonial-quote-${index}`}>
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-card-border">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-sans font-bold text-sm sm:text-base text-card-foreground" data-testid={`text-testimonial-name-${index}`}>
                        {testimonial.name}
                      </div>
                      <div className="font-sans text-xs sm:text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                        {testimonial.role}
                      </div>
                    </div>
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
