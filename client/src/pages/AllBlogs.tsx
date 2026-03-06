import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar, BookOpen, Loader2 } from "lucide-react";
import { sanityClient } from "@/lib/sanity";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  gradient: string;
}

export default function AllBlogs() {
  const [, navigate] = useLocation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await sanityClient.fetch(`*[_type == "blog"] | order(_createdAt desc)`);
        setBlogs(data);
      } catch (error) {
        console.error("Sanity blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2 justify-center">
              <BookOpen className="w-4 h-4" />
              All Blog Posts
            </span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Insights & Guidance
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of career guidance articles and resources
          </p>
        </div>

        {blogs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">No blog posts yet</p>
              <p className="text-muted-foreground">Check back soon for new content</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                className="h-full backdrop-blur-xl bg-card border-2 border-card-border hover:border-accent/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 flex flex-col group overflow-hidden"
                data-testid={`card-blog-${blog._id}`}
              >
                <CardHeader className="p-0">
                  <div className={`aspect-video bg-gradient-to-br ${blog.gradient} rounded-t-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-foreground backdrop-blur-sm hover:bg-white shadow-lg">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow p-4 sm:p-6">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-card-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-card-border p-4 sm:p-6">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{blog.date}</span>
                    </div>
                    <span className="text-accent">{blog.readTime}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/Babykutty/blog/${blog._id}`)}
                    className="flex items-center gap-2 text-accent hover:gap-3 transition-all font-semibold text-sm group/btn"
                    data-testid={`button-read-${blog._id}`}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
