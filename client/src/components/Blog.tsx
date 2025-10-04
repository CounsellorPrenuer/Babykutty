import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    category: "Career Tips",
    title: "5 Signs It's Time for a Career Change",
    excerpt: "Discover the key indicators that suggest it might be time to explore new professional horizons and make a meaningful transition.",
    date: "March 15, 2024",
    readTime: "5 min read",
  },
  {
    category: "Student Guide",
    title: "Choosing the Right Educational Path",
    excerpt: "A comprehensive guide for students to evaluate their interests, strengths, and career goals when selecting their academic journey.",
    date: "March 10, 2024",
    readTime: "7 min read",
  },
  {
    category: "Professional Growth",
    title: "Navigating Mid-Career Challenges",
    excerpt: "Expert strategies for overcoming common obstacles professionals face in their mid-career and achieving breakthrough success.",
    date: "March 5, 2024",
    readTime: "6 min read",
  },
];

export default function Blog() {
  const handleReadMore = (title: string) => {
    console.log(`Reading blog post: ${title}`);
  };

  return (
    <section id="blog" className="py-20 md:py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-blog-headline">
            Insights & Guidance
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-card border border-card-border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col"
              data-testid={`card-blog-${index}`}
            >
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-accent rounded-full"></div>
                  </div>
                  <Badge className="relative bg-accent text-accent-foreground" data-testid={`text-blog-category-${index}`}>
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-3" data-testid={`text-blog-title-${index}`}>
                  {post.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed mb-4" data-testid={`text-blog-excerpt-${index}`}>
                  {post.excerpt}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t border-card-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span data-testid={`text-blog-date-${index}`}>{post.date}</span>
                </div>
                <button
                  onClick={() => handleReadMore(post.title)}
                  className="flex items-center gap-2 text-accent hover:gap-3 transition-all font-semibold"
                  data-testid={`button-blog-read-${index}`}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
