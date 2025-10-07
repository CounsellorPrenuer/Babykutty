import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema, insertBlogSchema } from "@shared/schema";
import Razorpay from "razorpay";
import { generateBlogPost, improveBlogContent } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      
      await storage.createLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        source: "contact_form",
        message: contact.message,
        status: "new",
      });
      
      res.json({ success: true, contact });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/create-order", async (req, res) => {
    try {
      if (!razorpay) {
        return res.status(500).json({ success: false, error: "Payment gateway not configured" });
      }

      const { amount, planName, name, email, phone } = req.body;
      
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      
      const payment = await storage.createPayment({
        razorpayOrderId: order.id,
        planName,
        amount,
        name,
        email,
        phone,
        status: "pending",
      });

      await storage.createLead({
        name: (name && name.trim()) || "Guest",
        email: (email && email.trim()) || "no-email@provided.com",
        phone: (phone && phone.trim()) || null,
        source: "payment",
        planName,
        amount,
        status: "pending",
      });

      res.json({ 
        success: true, 
        orderId: order.id,
        paymentId: payment.id,
        key: process.env.RAZORPAY_KEY_ID 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    try {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ success: false, error: "Payment gateway not configured" });
      }

      const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId, email, phone } = req.body;
      
      const crypto = require("crypto");
      const sign = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpaySignature === expectedSign) {
        await storage.updatePayment(paymentId, razorpayPaymentId, razorpayOrderId);
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, leads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json({ success: true, contacts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json({ success: true, payments });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      res.json({ success: true, blogs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/blogs/featured", async (req, res) => {
    try {
      const blogs = await storage.getFeaturedBlogs();
      res.json({ success: true, blogs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/blogs", async (req, res) => {
    try {
      const blogData = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(blogData);
      res.json({ success: true, blog });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/blogs/:id", async (req, res) => {
    try {
      const blogData = insertBlogSchema.partial().parse(req.body);
      const blog = await storage.updateBlog(req.params.id, blogData);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    try {
      await storage.deleteBlog(req.params.id);
      res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/blogs/:id/feature", async (req, res) => {
    try {
      const { featured } = req.body;
      const blog = await storage.toggleBlogFeature(req.params.id, featured);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/blogs/generate", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: "AI generation not configured. Please add OPENAI_API_KEY to environment variables." 
        });
      }

      const { topic, keywords, tone, length } = req.body;
      
      if (!topic || !tone || !length) {
        return res.status(400).json({ 
          success: false, 
          error: "Topic, tone, and length are required" 
        });
      }

      const generatedBlog = await generateBlogPost({ topic, keywords, tone, length });
      res.json({ success: true, blog: generatedBlog });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/blogs/improve", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: "AI improvement not configured. Please add OPENAI_API_KEY to environment variables." 
        });
      }

      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ 
          success: false, 
          error: "Content is required" 
        });
      }

      const improvedContent = await improveBlogContent(content);
      res.json({ success: true, content: improvedContent });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
