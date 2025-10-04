import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema } from "@shared/schema";
import Razorpay from "razorpay";

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

  const httpServer = createServer(app);

  return httpServer;
}
