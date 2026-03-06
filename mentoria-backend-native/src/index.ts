export interface Env {
    DB: D1Database;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // 1. Create Order Endpoint
            if (url.pathname === "/api/create-order" && request.method === "POST") {
                const body: any = await request.json();
                const { amount, packageName, customerName, customerEmail } = body;

                // Call Razorpay API (Simple fetch since it's just an API call)
                const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
                const rpResponse = await fetch("https://api.razorpay.com/v1/orders", {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${auth}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: amount * 100, // in paisa
                        currency: "INR",
                        receipt: `receipt_${Date.now()}`,
                    }),
                });

                const rpData: any = await rpResponse.json();

                // Save to D1
                await env.DB.prepare(
                    "INSERT INTO orders (package_name, amount, customer_name, customer_email, razorpay_order_id) VALUES (?, ?, ?, ?, ?)"
                ).bind(packageName, amount, customerName, customerEmail, rpData.id).run();

                return new Response(JSON.stringify(rpData), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // 2. Contact Form Endpoint
            if (url.pathname === "/api/contact" && request.method === "POST") {
                const body: any = await request.json();
                const { name, email, phone, message } = body;

                // Save to D1
                await env.DB.prepare(
                    "INSERT INTO submissions (name, email, phone, message) VALUES (?, ?, ?, ?)"
                ).bind(name, email, phone, message).run();

                return new Response(JSON.stringify({ success: true }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
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
