import { useEffect, useState } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">About Us</span>
          </div>
          
          <p className="font-serif text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent mb-6 sm:mb-8" data-testid="text-about-subheadline">
            Your Expert Career Navigator
          </p>
          
          <div className="space-y-4 sm:space-y-6 font-sans text-base sm:text-lg text-foreground/80 leading-relaxed" data-testid="text-about-bio">
            <p className="relative pl-6 border-l-4 border-accent/30 hover:border-accent transition-colors">
              With over two decades of dedicated experience in mentorship and professional development, we founded Career Compass to serve as a guiding light for individuals at a crossroads in their professional lives. We believe that a successful career is not just about finding a job, but about designing a life filled with purpose and achievement.
            </p>
            <p className="relative pl-6 border-l-4 border-accent/30 hover:border-accent transition-colors">
              As an expert navigator, Career Compass utilizes a blend of proven assessment tools and deep, personalized coaching to help students, graduates, and seasoned professionals chart their ideal career path. Our mission is to provide the clarity and strategic direction needed to turn ambition into a tangible, successful reality.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6 max-w-3xl">
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-card-border hover:border-accent/50 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-accent mb-2">1500+</div>
              <div className="font-sans text-sm sm:text-base text-muted-foreground">Careers Transformed</div>
            </div>
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-card-border hover:border-accent/50 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-accent mb-2">97%</div>
              <div className="font-sans text-sm sm:text-base text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
