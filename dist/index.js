var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// db/index.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool);

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  planName: text("plan_name").notNull(),
  amount: integer("amount").notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true
});
var leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  source: text("source").notNull(),
  planName: text("plan_name"),
  amount: integer("amount"),
  message: text("message"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true
});
var blogs = pgTable("blogs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  gradient: text("gradient").notNull(),
  featured: integer("featured").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true
});

// server/storage.ts
var DbStorage = class {
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  async createPayment(insertPayment) {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }
  async updatePayment(id, razorpayPaymentId, razorpayOrderId) {
    const { eq } = await import("drizzle-orm");
    const [payment] = await db.update(payments).set({
      razorpayPaymentId,
      razorpayOrderId,
      status: "completed"
    }).where(eq(payments.id, id)).returning();
    return payment;
  }
  async createLead(insertLead) {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }
  async getLeads() {
    const { desc } = await import("drizzle-orm");
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }
  async getContacts() {
    const { desc } = await import("drizzle-orm");
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async getPayments() {
    const { desc } = await import("drizzle-orm");
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }
  async getStats() {
    const { eq, count, sum } = await import("drizzle-orm");
    const allPayments = await db.select().from(payments);
    const allContacts = await db.select().from(contacts);
    const allLeads = await db.select().from(leads);
    const totalBookings = allPayments.length;
    const pending = allPayments.filter((p) => p.status === "pending").length;
    const completed = allPayments.filter((p) => p.status === "completed").length;
    const contacted = allLeads.filter((l) => l.status === "contacted").length;
    const contactForms = allContacts.length;
    const leadDownloads = allLeads.length;
    const totalPayments = allPayments.length;
    const revenue = allPayments.filter((p) => p.status === "completed").reduce((sum2, p) => sum2 + p.amount, 0);
    const investments = 0;
    return {
      totalBookings,
      pending,
      contacted,
      completed,
      contactForms,
      leadDownloads,
      totalPayments,
      revenue,
      investments
    };
  }
  async createBlog(insertBlog) {
    const [blog] = await db.insert(blogs).values(insertBlog).returning();
    return blog;
  }
  async getBlogs() {
    const { desc } = await import("drizzle-orm");
    return db.select().from(blogs).orderBy(desc(blogs.createdAt));
  }
  async getFeaturedBlogs() {
    const { desc, eq } = await import("drizzle-orm");
    return db.select().from(blogs).where(eq(blogs.featured, 1)).orderBy(desc(blogs.createdAt)).limit(3);
  }
  async getBlogById(id) {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }
  async updateBlog(id, blogUpdate) {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.update(blogs).set(blogUpdate).where(eq(blogs.id, id)).returning();
    return blog;
  }
  async deleteBlog(id) {
    const { eq } = await import("drizzle-orm");
    await db.delete(blogs).where(eq(blogs.id, id));
  }
  async toggleBlogFeature(id, featured) {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.update(blogs).set({ featured }).where(eq(blogs.id, id)).returning();
    return blog;
  }
};
var storage = new DbStorage();

// server/routes.ts
import Razorpay from "razorpay";

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
async function generateBlogPost(params) {
  const { topic, keywords, tone, length } = params;
  const wordCount = length === "short" ? "800-1000" : length === "medium" ? "1500-2000" : "2500-3000";
  const keywordsText = keywords ? `
Keywords to include: ${keywords}` : "";
  const prompt = `You are an expert career counseling blog writer. Generate a professional, engaging blog post on the following topic:

Topic: ${topic}${keywordsText}
Tone: ${tone}
Length: ${wordCount} words

Please provide the output in JSON format with the following structure:
{
  "title": "An engaging, SEO-friendly title (60-70 characters)",
  "excerpt": "A compelling 2-3 sentence summary that hooks the reader (150-160 characters)",
  "content": "The full blog post content in HTML format with proper headings (h2, h3), paragraphs, bold text for emphasis, and bullet points or numbered lists where appropriate. Make it engaging, informative, and valuable for readers seeking career guidance.",
  "category": "One of: Career Tips, Student Guide, Professional Development, Career Change",
  "readTime": "Estimated read time (e.g., '5 min read', '8 min read')"
}

Make the content professional, actionable, and specific to career counseling. Include practical tips, real-world examples, and actionable advice.`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and professional blog writer specializing in career guidance, educational planning, and professional development. You write engaging, informative content that helps people navigate their career journeys."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      title: result.title || "Untitled Blog Post",
      excerpt: result.excerpt || "No excerpt available",
      content: result.content || "<p>No content available</p>",
      category: result.category || "Career Tips",
      readTime: result.readTime || "5 min read"
    };
  } catch (error) {
    throw new Error(`Failed to generate blog post: ${error.message}`);
  }
}
async function improveBlogContent(content) {
  const prompt = `You are an expert editor specializing in career counseling content. Improve the following blog post content while maintaining its core message and structure. Make it more engaging, professional, and valuable for readers.

Current content:
${content}

Please provide the improved content in HTML format with proper headings (h2, h3), paragraphs, bold text for emphasis, and bullet points or numbered lists where appropriate. Keep the improvements subtle but impactful.`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert content editor specializing in career counseling and professional development content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 8192
    });
    return response.choices[0].message.content || content;
  } catch (error) {
    throw new Error(`Failed to improve content: ${error.message}`);
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  }) : null;
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      await storage.createLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        source: "contact_form",
        message: contact.message,
        status: "new"
      });
      res.json({ success: true, contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/create-order", async (req, res) => {
    try {
      if (!razorpay) {
        return res.status(500).json({ success: false, error: "Payment gateway not configured" });
      }
      const { amount, planName, name, email, phone } = req.body;
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };
      const order = await razorpay.orders.create(options);
      const payment = await storage.createPayment({
        razorpayOrderId: order.id,
        planName,
        amount,
        name,
        email,
        phone,
        status: "pending"
      });
      await storage.createLead({
        name: name && name.trim() || "Guest",
        email: email && email.trim() || "no-email@provided.com",
        phone: phone && phone.trim() || null,
        source: "payment",
        planName,
        amount,
        status: "pending"
      });
      res.json({
        success: true,
        orderId: order.id,
        paymentId: payment.id,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/verify-payment", async (req, res) => {
    try {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ success: false, error: "Payment gateway not configured" });
      }
      const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId, email, phone } = req.body;
      const crypto = __require("crypto");
      const sign = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
      if (razorpaySignature === expectedSign) {
        await storage.updatePayment(paymentId, razorpayPaymentId, razorpayOrderId);
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ success: true, stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/leads", async (req, res) => {
    try {
      const leads2 = await storage.getLeads();
      res.json({ success: true, leads: leads2 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json({ success: true, contacts: contacts2 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/payments", async (req, res) => {
    try {
      const payments2 = await storage.getPayments();
      res.json({ success: true, payments: payments2 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/blogs", async (req, res) => {
    try {
      const blogs2 = await storage.getBlogs();
      res.json({ success: true, blogs: blogs2 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/blogs/featured", async (req, res) => {
    try {
      const blogs2 = await storage.getFeaturedBlogs();
      res.json({ success: true, blogs: blogs2 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/blogs", async (req, res) => {
    try {
      const blogData = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(blogData);
      res.json({ success: true, blog });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app2.put("/api/blogs/:id", async (req, res) => {
    try {
      const blogData = insertBlogSchema.partial().parse(req.body);
      const blog = await storage.updateBlog(req.params.id, blogData);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app2.delete("/api/blogs/:id", async (req, res) => {
    try {
      await storage.deleteBlog(req.params.id);
      res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.patch("/api/blogs/:id/feature", async (req, res) => {
    try {
      const { featured } = req.body;
      const blog = await storage.toggleBlogFeature(req.params.id, featured);
      if (!blog) {
        return res.status(404).json({ success: false, error: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/blogs/generate", async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/blogs/improve", async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/Babykutty/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
