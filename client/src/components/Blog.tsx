import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { sanityClient } from "@/lib/sanity";

export default function Blog() {
  const [, navigate] = useLocation();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    async function fetchFeaturedBlogs() {
      try {
        const data = await sanityClient.fetch(`*[_type == "blog" && featured == true][0...3] | order(_createdAt desc)`);
        setBlogPosts(data);
      } catch (error) {
        console.error("Sanity blog preview fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedBlogs();
  }, []);

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

    document.querySelectorAll('[data-blog-card]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [blogPosts.length]);

  const handleReadMore = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <section id="blog" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2 justify-center">
              <BookOpen className="w-4 h-4" />
              Our Blog
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 px-4" data-testid="text-blog-headline">
            Insights &<br className="hidden sm:block" /> Guidance
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                data-blog-card
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Card
                  className="h-full backdrop-blur-xl bg-card border-2 border-card-border hover:border-accent/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 flex flex-col group overflow-hidden"
                  data-testid={`card-blog-${index}`}
                >
                  <CardHeader className="p-0">
                    <div className={`aspect-video bg-gradient-to-br ${post.gradient} rounded-t-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-foreground backdrop-blur-sm hover:bg-white shadow-lg" data-testid={`text-blog-category-${index}`}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow p-4 sm:p-6">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-card-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2" data-testid={`text-blog-title-${index}`}>
                      {post.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3" data-testid={`text-blog-excerpt-${index}`}>
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-card-border p-4 sm:p-6">
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span data-testid={`text-blog-date-${index}`}>{post.date}</span>
                      </div>
                      <span className="text-accent">{post.readTime}</span>
                    </div>
                    <button
                      onClick={() => handleReadMore(post._id)}
                      className="flex items-center gap-2 text-accent hover:gap-3 transition-all font-semibold text-sm group/btn"
                      data-testid={`button-blog-read-${index}`}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}

        {!loading && blogPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/blogs")}
              size="lg"
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground"
              data-testid="button-view-all-blogs"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View All Blog Posts
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
