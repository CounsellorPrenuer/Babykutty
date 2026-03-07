import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { sanityClient } from "@/lib/sanity";

export default function BlogDetail() {
  const [, params1] = useRoute("/blog/:id");
  const [, params2] = useRoute("/Babykutty/blog/:id");
  const [, navigate] = useLocation();
  const blogId = params1?.id || params2?.id;
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!blogId) {
        setLoading(false);
        return;
      }
      try {
        const data = await sanityClient.fetch(`*[_type == "blog" && _id == $id][0]`, { id: blogId });
        setBlog(data);
      } catch (error) {
        console.error("Sanity blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-xl font-semibold text-foreground mb-4">Blog post not found</p>
            <Button onClick={() => navigate("/Babykutty/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/Babykutty/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <div className={`aspect-[21/9] bg-gradient-to-br ${blog.gradient} relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <Badge className="bg-white/90 text-foreground backdrop-blur-sm mb-3">
                  {blog.category}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-10">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-6" data-testid="text-blog-title">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-blog-date">{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none" data-testid="text-blog-content">
              {blog.content.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                
                if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                  const text = paragraph.trim().slice(2, -2);
                  return (
                    <h3 key={index} className="font-serif font-bold text-2xl text-foreground mt-8 mb-4">
                      {text}
                    </h3>
                  );
                }
                
                if (paragraph.trim().match(/^\d+\./)) {
                  return (
                    <p key={index} className="text-foreground leading-relaxed mb-4 ml-4">
                      {paragraph}
                    </p>
                  );
                }
                
                if (paragraph.trim().startsWith('-')) {
                  return (
                    <p key={index} className="text-foreground leading-relaxed mb-2 ml-4">
                      {paragraph}
                    </p>
                  );
                }
                
                return (
                  <p key={index} className="text-foreground leading-relaxed mb-6">
                    {paragraph.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="font-semibold text-accent">{part}</strong> : part
                    )}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Found this helpful?</p>
                  <p className="text-foreground">Share your career challenges with us</p>
                </div>
                <Button onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }} data-testid="button-contact">
                  Get in Touch
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/blogs")}
            data-testid="button-view-all"
          >
            View All Blog Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
