import { getDb } from "./db";
import { contacts, leads, payments } from "./schema";

export interface Env {
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    DATABASE_URL: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const method = request.method;

        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            const db = getDb(env.DATABASE_URL);

            if (url.pathname === "/api/contact" && method === "POST") {
                const body = await request.json() as any;

                const [contact] = await db.insert(contacts).values({
                    name: body.name,
                    email: body.email,
                    phone: body.phone || null,
                    message: body.message,
                }).returning();

                await db.insert(leads).values({
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    source: "contact_form",
                    message: contact.message,
                    status: "new",
                });

                return new Response(JSON.stringify({ success: true, contact }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            if (url.pathname === "/api/create-order" && method === "POST") {
                const body = await request.json() as any;
                const { amount, planName, name, email, phone } = body;

                // Call Razorpay API directly via fetch
                const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
                const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${auth}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: amount * 100, // in paise
                        currency: "INR",
                        receipt: `receipt_${Date.now()}`,
                    }),
                });

                const order = await razorpayResponse.json() as any;
                if (!razorpayResponse.ok) {
                    throw new Error(order.error?.description || "Razorpay order creation failed");
                }

                const [payment] = await db.insert(payments).values({
                    razorpayOrderId: order.id,
                    planName: planName || "Mentorship Plan",
                    amount: amount,
                    name: name || null,
                    email: email || null,
                    phone: phone || null,
                    status: "pending",
                }).returning();

                await db.insert(leads).values({
                    name: name || "Guest",
                    email: email || "no-email@provided.com",
                    phone: phone || null,
                    source: "payment",
                    planName: planName || "Mentorship Plan",
                    amount: amount,
                    status: "pending",
                });

                return new Response(JSON.stringify({
                    success: true,
                    orderId: order.id,
                    paymentId: payment.id,
                    key: env.RAZORPAY_KEY_ID
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            if (url.pathname === "/api/verify-payment" && method === "POST") {
                const body = await request.json() as any;
                const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId } = body;

                const data = razorpayOrderId + "|" + razorpayPaymentId;
                const encoder = new TextEncoder();
                const key = await crypto.subtle.importKey(
                    "raw",
                    encoder.encode(env.RAZORPAY_KEY_SECRET),
                    { name: "HMAC", hash: "SHA-256" },
                    false,
                    ["sign"]
                );
                const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
                const expectedSignature = Array.from(new Uint8Array(signature))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");

                if (razorpaySignature === expectedSignature) {
                    const { eq } = await import("drizzle-orm");
                    await db.update(payments)
                        .set({
                            razorpayPaymentId,
                            razorpayOrderId,
                            status: "completed"
                        })
                        .where(eq(payments.id, paymentId));

                    return new Response(JSON.stringify({ success: true, message: "Payment verified successfully" }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                } else {
                    return new Response(JSON.stringify({ success: false, error: "Invalid signature" }), {
                        status: 400,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }
            }

            return new Response("Not Found", { status: 404, headers: corsHeaders });
        } catch (error: any) {
            return new Response(JSON.stringify({ success: false, error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
    },
};
