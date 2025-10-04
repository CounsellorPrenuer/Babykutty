import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema } from "@shared/schema";
import Razorpay from "razorpay";

export async function registerRoutes(app: Express): Promise<Server> {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/create-order", async (req, res) => {
    try {
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
      const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId, email, phone } = req.body;
      
      const crypto = require("crypto");
      const sign = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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

  const httpServer = createServer(app);

  return httpServer;
}
