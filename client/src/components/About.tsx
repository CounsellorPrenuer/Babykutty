import profileImage from "@assets/profile_1759556754450.png";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl"></div>
              <img
                src={profileImage}
                alt="Babikutty P. Rajan"
                className="relative w-72 h-72 rounded-full shadow-xl object-cover border-4 border-accent"
                data-testid="img-profile"
              />
            </div>
          </div>

          <div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-about-headline">
              Meet Babikutty P. Rajan
            </h2>
            <p className="font-serif text-xl md:text-2xl text-accent mb-6" data-testid="text-about-subheadline">
              Your Expert Career Navigator
            </p>
            
            <div className="space-y-4 font-sans text-base md:text-lg text-foreground/80 leading-relaxed" data-testid="text-about-bio">
              <p>
                With over two decades of dedicated experience in mentorship and professional development, Babikutty P. Rajan founded Career Compass to serve as a guiding light for individuals at a crossroads in their professional lives. He believes that a successful career is not just about finding a job, but about designing a life filled with purpose and achievement.
              </p>
              <p>
                As an expert navigator, Babikutty utilizes a blend of proven assessment tools and deep, personalized coaching to help students, graduates, and seasoned professionals chart their ideal career path. His mission is to provide the clarity and strategic direction needed to turn ambition into a tangible, successful reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
