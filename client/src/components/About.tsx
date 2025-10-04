import profileImage from "@assets/profile_1759556754450.png";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className={`flex justify-center lg:justify-start transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-accent via-yellow-400 to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent to-yellow-400 rounded-full opacity-20 animate-spin-slow"></div>
                <img
                  src={profileImage}
                  alt="Babikutty P. Rajan"
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full shadow-2xl object-cover border-4 border-accent group-hover:scale-105 transition-transform duration-500"
                  data-testid="img-profile"
                />
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <div className="text-center">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-accent-foreground">20+</div>
                  <div className="font-sans text-xs text-accent-foreground/90">Years</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="inline-block mb-4">
              <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase">About Me</span>
            </div>
            
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6" data-testid="text-about-headline">
              Meet Babikutty<br />P. Rajan
            </h2>
            
            <p className="font-serif text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent mb-6 sm:mb-8" data-testid="text-about-subheadline">
              Your Expert Career Navigator
            </p>
            
            <div className="space-y-4 sm:space-y-6 font-sans text-base sm:text-lg text-foreground/80 leading-relaxed" data-testid="text-about-bio">
              <p className="relative pl-6 border-l-4 border-accent/30 hover:border-accent transition-colors">
                With over two decades of dedicated experience in mentorship and professional development, Babikutty P. Rajan founded Career Compass to serve as a guiding light for individuals at a crossroads in their professional lives. He believes that a successful career is not just about finding a job, but about designing a life filled with purpose and achievement.
              </p>
              <p className="relative pl-6 border-l-4 border-accent/30 hover:border-accent transition-colors">
                As an expert navigator, Babikutty utilizes a blend of proven assessment tools and deep, personalized coaching to help students, graduates, and seasoned professionals chart their ideal career path. His mission is to provide the clarity and strategic direction needed to turn ambition into a tangible, successful reality.
              </p>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6">
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
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
