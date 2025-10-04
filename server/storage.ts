import { db } from "../db/index";
import { contacts, payments, leads, blogs, type Contact, type InsertContact, type Payment, type InsertPayment, type Lead, type InsertLead, type Blog, type InsertBlog } from "@shared/schema";

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
  createBlog(blog: InsertBlog): Promise<Blog>;
  getBlogs(): Promise<Blog[]>;
  getFeaturedBlogs(): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | undefined>;
  updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: string): Promise<void>;
  toggleBlogFeature(id: string, featured: number): Promise<Blog | undefined>;
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

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const [blog] = await db.insert(blogs).values(insertBlog).returning();
    return blog;
  }

  async getBlogs(): Promise<Blog[]> {
    const { desc } = await import("drizzle-orm");
    return db.select().from(blogs).orderBy(desc(blogs.createdAt));
  }

  async getFeaturedBlogs(): Promise<Blog[]> {
    const { desc, eq } = await import("drizzle-orm");
    return db.select().from(blogs).where(eq(blogs.featured, 1)).orderBy(desc(blogs.createdAt)).limit(3);
  }

  async getBlogById(id: string): Promise<Blog | undefined> {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async updateBlog(id: string, blogUpdate: Partial<InsertBlog>): Promise<Blog | undefined> {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.update(blogs).set(blogUpdate).where(eq(blogs.id, id)).returning();
    return blog;
  }

  async deleteBlog(id: string): Promise<void> {
    const { eq } = await import("drizzle-orm");
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async toggleBlogFeature(id: string, featured: number): Promise<Blog | undefined> {
    const { eq } = await import("drizzle-orm");
    const [blog] = await db.update(blogs).set({ featured }).where(eq(blogs.id, id)).returning();
    return blog;
  }
}

export const storage = new DbStorage();
