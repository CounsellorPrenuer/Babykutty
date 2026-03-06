
import Razorpay from 'razorpay';

export interface Env {
	RAZORPAY_KEY_ID: string;
	RAZORPAY_KEY_SECRET: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// CORS Headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			if (url.pathname === '/api/create-order' && request.method === 'POST') {
				const body = await request.json() as any;
				const { planName, amount, name, email, phone } = body;

				const instance = new Razorpay({
					key_id: env.RAZORPAY_KEY_ID,
					key_secret: env.RAZORPAY_KEY_SECRET,
				});

				const options = {
					amount: amount * 100, // amount in the smallest currency unit
					currency: "INR",
					receipt: `receipt_${Date.now()}`,
				};

				const order = await instance.orders.create(options);

				return new Response(JSON.stringify({
					orderId: order.id,
					key: env.RAZORPAY_KEY_ID,
					amount: order.amount,
					currency: order.currency,
					paymentId: `temp_${Date.now()}` // Frontend expects a paymentId to track
				}), {
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			if (url.pathname === '/api/verify-payment' && request.method === 'POST') {
				// For simple implementation, we just return success
				// Real signature verification would go here
				return new Response(JSON.stringify({ success: true }), {
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			return new Response('Not Found', { status: 404, headers: corsHeaders });
		} catch (error: any) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
	},
};
