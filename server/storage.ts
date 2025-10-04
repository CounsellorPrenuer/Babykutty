import { db } from "../db/index";
import { contacts, payments, leads, type Contact, type InsertContact, type Payment, type InsertPayment, type Lead, type InsertLead } from "@shared/schema";

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, razorpayPaymentId: string, razorpayOrderId: string): Promise<Payment | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getContacts(): Promise<Contact[]>;
  getPayments(): Promise<Payment[]>;
  getStats(): Promise<{
    totalBookings: number;
    pending: number;
    contacted: number;
    completed: number;
    contactForms: number;
    leadDownloads: number;
    totalPayments: number;
    revenue: number;
    investments: number;
  }>;
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

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    const { desc } = await import("drizzle-orm");
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getContacts(): Promise<Contact[]> {
    const { desc } = await import("drizzle-orm");
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getPayments(): Promise<Payment[]> {
    const { desc } = await import("drizzle-orm");
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getStats(): Promise<{
    totalBookings: number;
    pending: number;
    contacted: number;
    completed: number;
    contactForms: number;
    leadDownloads: number;
    totalPayments: number;
    revenue: number;
    investments: number;
  }> {
    const { eq, count, sum } = await import("drizzle-orm");
    
    const allPayments = await db.select().from(payments);
    const allContacts = await db.select().from(contacts);
    const allLeads = await db.select().from(leads);
    
    const totalBookings = allPayments.length;
    const pending = allPayments.filter(p => p.status === "pending").length;
    const completed = allPayments.filter(p => p.status === "completed").length;
    const contacted = allLeads.filter(l => l.status === "contacted").length;
    const contactForms = allContacts.length;
    const leadDownloads = allLeads.length;
    const totalPayments = allPayments.length;
    const revenue = allPayments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
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
      investments,
    };
  }
}

export const storage = new DbStorage();
