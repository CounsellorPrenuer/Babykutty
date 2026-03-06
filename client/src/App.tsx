import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBlogs from "@/pages/AdminBlogs";
import BlogDetail from "@/pages/BlogDetail";
import AllBlogs from "@/pages/AllBlogs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/Babykutty/" component={Home} />
      <Route path="/Babykutty" component={Home} />
      <Route path="/" component={Home} />
      <Route path="/Babykutty/admin/bookings" component={AdminDashboard} />
      <Route path="/admin/bookings" component={AdminDashboard} />
      <Route path="/Babykutty/admin/blogs" component={AdminBlogs} />
      <Route path="/admin/blogs" component={AdminBlogs} />
      <Route path="/Babykutty/blog/:id" component={BlogDetail} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/Babykutty/blogs" component={AllBlogs} />
      <Route path="/blogs" component={AllBlogs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
