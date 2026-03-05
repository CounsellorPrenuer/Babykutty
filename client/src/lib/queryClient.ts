import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { MOCK_BLOGS, MOCK_STATS, MOCK_LEADS, MOCK_CONTACTS, MOCK_PAYMENTS } from "./mockData";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // MOCK INTERCEPTION
  if (url.startsWith('/api/')) {
    await delay(500); // Simulate network latency
    console.log(`[Mock API] ${method} ${url}`, data);

    if (url === '/api/contact') {
      return new Response(JSON.stringify({ success: true, contact: data }), { status: 200 });
    }
    if (url === '/api/create-order') {
      return new Response(JSON.stringify({
        success: true,
        orderId: "mock_order_id_" + Date.now(),
        paymentId: "mock_payment_id_" + Date.now(),
        key: "mock_key_id"
      }), { status: 200 });
    }
    if (url === '/api/verify-payment') {
      return new Response(JSON.stringify({ success: true, message: "Payment verified successfully" }), { status: 200 });
    }
    if (url.startsWith('/api/blogs') && method !== 'GET') {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Default success for other mutations
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const url = queryKey.join("/") as string;

      // MOCK INTERCEPTION
      if (url.startsWith('/api/')) {
        await delay(300);
        console.log(`[Mock Query] ${url}`);

        if (url === '/api/blogs') return { success: true, blogs: MOCK_BLOGS } as any;
        if (url === '/api/blogs/featured') return { success: true, blogs: MOCK_BLOGS.filter(b => b.featured) } as any;
        if (url.startsWith('/api/blogs/')) {
          const id = url.split('/').pop();
          const blog = MOCK_BLOGS.find(b => b.id === id);
          return { success: true, blog } as any;
        }

        // Admin Stats
        if (url === '/api/admin/stats') return { success: true, stats: MOCK_STATS } as any;
        if (url === '/api/admin/leads') return { success: true, leads: MOCK_LEADS } as any;
        if (url === '/api/admin/contacts') return { success: true, contacts: MOCK_CONTACTS } as any;
        if (url === '/api/admin/payments') return { success: true, payments: MOCK_PAYMENTS } as any;

        return null;
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
