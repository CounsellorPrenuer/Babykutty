import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogSchema, type Blog, type InsertBlog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Star, StarOff, Calendar, BookOpen, Home, Sparkles, Wand2 } from "lucide-react";
import { useLocation } from "wouter";

const gradientOptions = [
  { value: "from-blue-500 to-purple-600", label: "Blue to Purple" },
  { value: "from-green-500 to-teal-600", label: "Green to Teal" },
  { value: "from-orange-500 to-red-600", label: "Orange to Red" },
  { value: "from-pink-500 to-rose-600", label: "Pink to Rose" },
  { value: "from-indigo-500 to-purple-600", label: "Indigo to Purple" },
  { value: "from-yellow-500 to-orange-600", label: "Yellow to Orange" },
];

const categoryOptions = [
  "Career Tips",
  "Student Guide",
  "Professional Growth",
  "Career Transition",
  "Interview Skills",
  "Resume Building",
];

export default function AdminBlogs() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showAiGeneration, setShowAiGeneration] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLength, setAiLength] = useState("Medium (1500-2000 words)");

  const { data: blogsData, isLoading } = useQuery<{ success: boolean; blogs: Blog[] }>({
    queryKey: ["/api/blogs"],
  });

  const blogs = blogsData?.blogs || [];

  const form = useForm<InsertBlog>({
    resolver: zodResolver(insertBlogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readTime: "",
      gradient: "from-blue-500 to-purple-600",
      featured: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlog) => {
      return await apiRequest("POST", "/api/blogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs/featured"] });
      toast({ title: "Blog created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error creating blog", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertBlog }) => {
      return await apiRequest("PUT", `/api/blogs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs/featured"] });
      toast({ title: "Blog updated successfully" });
      setIsDialogOpen(false);
      setEditingBlog(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error updating blog", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs/featured"] });
      toast({ title: "Blog deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting blog", description: error.message, variant: "destructive" });
    },
  });

  const featureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: number }) => {
      return await apiRequest("PATCH", `/api/blogs/${id}/feature`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs/featured"] });
      toast({ title: "Blog feature status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating feature status", description: error.message, variant: "destructive" });
    },
  });

  const generateBlogMutation = useMutation({
    mutationFn: async (params: { topic: string; keywords: string; tone: string; length: string }) => {
      return await apiRequest("POST", "/api/blogs/generate", params);
    },
    onSuccess: (data: any) => {
      const generatedBlog = data.blog;
      form.setValue("title", generatedBlog.title);
      form.setValue("excerpt", generatedBlog.excerpt);
      form.setValue("content", generatedBlog.content);
      form.setValue("category", generatedBlog.category);
      form.setValue("readTime", generatedBlog.readTime);
      setShowAiGeneration(false);
      toast({ title: "Blog generated successfully", description: "Review and edit the generated content before publishing" });
    },
    onError: (error: Error) => {
      toast({ title: "Error generating blog", description: error.message, variant: "destructive" });
    },
  });

  const improveBlogMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/blogs/improve", { content });
    },
    onSuccess: (data: any) => {
      form.setValue("content", data.content);
      toast({ title: "Content improved successfully", description: "AI has enhanced your blog content" });
    },
    onError: (error: Error) => {
      toast({ title: "Error improving content", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (data: InsertBlog) => {
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    form.reset({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      date: blog.date,
      readTime: blog.readTime,
      gradient: blog.gradient,
      featured: blog.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFeatureToggle = (id: string, currentFeatured: number) => {
    featureMutation.mutate({ id, featured: currentFeatured === 1 ? 0 : 1 });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBlog(null);
    setShowAiGeneration(false);
    form.reset();
  };

  const handleGenerateBlog = () => {
    if (!aiTopic.trim()) {
      toast({ title: "Topic required", description: "Please enter a topic for the blog", variant: "destructive" });
      return;
    }
    
    const length = aiLength.toLowerCase().includes("short") ? "short" : aiLength.toLowerCase().includes("medium") ? "medium" : "long";
    
    generateBlogMutation.mutate({
      topic: aiTopic,
      keywords: aiKeywords,
      tone: aiTone.toLowerCase(),
      length: length,
    });
  };

  const handleImproveContent = () => {
    const currentContent = form.getValues("content");
    if (!currentContent || currentContent.trim().length === 0) {
      toast({ title: "No content", description: "Please add some content first", variant: "destructive" });
      return;
    }
    improveBlogMutation.mutate(currentContent);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage blog posts with AI assistance</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/")} variant="outline" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => { setEditingBlog(null); form.reset(); setShowAiGeneration(false); }} 
                  className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground"
                  data-testid="button-create-blog"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                </DialogHeader>

                {!editingBlog && (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <CardTitle className="text-lg">AI Blog Generation</CardTitle>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowAiGeneration(!showAiGeneration)}
                          data-testid="button-toggle-ai"
                        >
                          {showAiGeneration ? "Hide" : "Show"}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Generate a professional blog post using AI based on your topic and preferences.</p>
                    </CardHeader>
                    {showAiGeneration && (
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Topic *</label>
                          <Input
                            placeholder="e.g., How to transition to leadership roles"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            data-testid="input-ai-topic"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Keywords (comma separated)</label>
                          <Input
                            placeholder="e.g., leadership, career growth, management"
                            value={aiKeywords}
                            onChange={(e) => setAiKeywords(e.target.value)}
                            data-testid="input-ai-keywords"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Tone</label>
                            <Select value={aiTone} onValueChange={setAiTone}>
                              <SelectTrigger data-testid="select-ai-tone">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Friendly">Friendly</SelectItem>
                                <SelectItem value="Inspirational">Inspirational</SelectItem>
                                <SelectItem value="Academic">Academic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Length</label>
                            <Select value={aiLength} onValueChange={setAiLength}>
                              <SelectTrigger data-testid="select-ai-length">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Short (800-1000 words)">Short (800-1000 words)</SelectItem>
                                <SelectItem value="Medium (1500-2000 words)">Medium (1500-2000 words)</SelectItem>
                                <SelectItem value="Long (2500-3000 words)">Long (2500-3000 words)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleGenerateBlog}
                          disabled={generateBlogMutation.isPending}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          data-testid="button-generate-blog"
                        >
                          {generateBlogMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Blog Post
                            </>
                          )}
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog title" {...field} data-testid="input-blog-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Short description for the blog card"
                              rows={2}
                              {...field}
                              data-testid="input-blog-excerpt"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel>Content</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleImproveContent}
                              disabled={improveBlogMutation.isPending}
                              data-testid="button-improve-content"
                            >
                              {improveBlogMutation.isPending ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                                  Improving...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-3 h-3 mr-2" />
                                  Improve with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Full blog content (supports HTML formatting)"
                              rows={10}
                              {...field}
                              data-testid="input-blog-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-blog-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categoryOptions.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="readTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Read Time</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 5 min read" {...field} data-testid="input-blog-readtime" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="gradient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Header Gradient</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-blog-gradient">
                                <SelectValue placeholder="Select gradient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gradientOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-12 h-4 rounded bg-gradient-to-r ${opt.value}`}></div>
                                    <span>{opt.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-blog">
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingBlog ? "Update Blog" : "Create Blog")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{blogs.length}</p>
                  <p className="text-sm text-muted-foreground">Total Blog Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">AI Powered</p>
                  <p className="text-sm text-muted-foreground">Content Generation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Wand2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Smart Editing</p>
                  <p className="text-sm text-muted-foreground">AI Content Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {blogs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">No blogs yet</p>
              <p className="text-muted-foreground mb-6">Create your first blog post to get started</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Blog
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow" data-testid={`card-blog-${blog.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{blog.title}</CardTitle>
                        {blog.featured === 1 && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" data-testid={`icon-featured-${blog.id}`} />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded">{blog.category}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.date}
                        </span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleFeatureToggle(blog.id, blog.featured)}
                        data-testid={`button-feature-${blog.id}`}
                      >
                        {blog.featured === 1 ? (
                          <StarOff className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(blog)}
                        data-testid={`button-edit-${blog.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(blog.id)}
                        data-testid={`button-delete-${blog.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{blog.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
