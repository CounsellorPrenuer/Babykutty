import { db } from "../db/index";
import { contacts, payments, type Contact, type InsertContact, type Payment, type InsertPayment } from "@shared/schema";

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, razorpayPaymentId: string, razorpayOrderId: string): Promise<Payment | undefined>;
}

export class DbStorage implements IStorage {
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: string, razorpayPaymentId: string, razorpayOrderId: string): Promise<Payment | undefined> {
    const { eq } = await import("drizzle-orm");
    const [payment] = await db
      .update(payments)
      .set({ 
        razorpayPaymentId, 
        razorpayOrderId,
        status: "completed"
      })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }
}

export const storage = new DbStorage();
