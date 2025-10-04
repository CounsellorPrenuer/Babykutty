import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Menon",
    role: "Software Engineer",
    initials: "PM",
    quote: "Babikutty's guidance helped me transition from teaching to tech. His personalized approach gave me the confidence to pursue my dream career.",
  },
  {
    name: "Rahul Krishnan",
    role: "MBA Graduate",
    initials: "RK",
    quote: "The career assessment tools opened my eyes to opportunities I never considered. Within 6 months, I landed my ideal role in consulting.",
  },
  {
    name: "Anjali Sharma",
    role: "Marketing Executive",
    initials: "AS",
    quote: "Career Compass provided the strategic direction I needed for my mid-career pivot. The support was exceptional throughout my journey.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-testimonials-headline">
            Success Stories
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-card border border-card-border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              data-testid={`card-testimonial-${index}`}
            >
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-accent mb-4" />
                <p className="font-sans text-card-foreground italic leading-relaxed mb-6" data-testid={`text-testimonial-quote-${index}`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-card-foreground" data-testid={`text-testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="font-sans text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
