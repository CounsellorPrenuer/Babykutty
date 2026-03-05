export const MOCK_BLOGS = [
  {
    id: "1",
    title: "Understanding Baby Sleep Patterns",
    excerpt: "Learn about the different stages of baby sleep and how to establish a healthy routine.",
    content: "Detailed content about baby sleep patterns goes here. This is a static mock blog post.",
    category: "Sleep Training",
    date: "2024-03-15",
    readTime: "5 min read",
    gradient: "from-blue-500 to-cyan-500",
    featured: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Nutrition Tips for Toddlers",
    excerpt: "Essential nutrition advice for growing toddlers and picky eaters.",
    content: "Comprehensive guide to toddler nutrition. This is another static mock blog post.",
    category: "Nutrition",
    date: "2024-03-20",
    readTime: "4 min read",
    gradient: "from-green-500 to-emerald-500",
    featured: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "The Importance of Play",
    excerpt: "Why play is crucial for your child's development and learning.",
    content: "Article about the benefits of play. This is a static mock blog post.",
    category: "Development",
    date: "2024-03-25",
    readTime: "3 min read",
    gradient: "from-purple-500 to-pink-500",
    featured: 0,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_STATS = {
  totalBookings: 150,
  pending: 12,
  contacted: 45,
  completed: 93,
  contactForms: 89,
  leadDownloads: 234,
  totalPayments: 150,
  revenue: 450000,
  investments: 0
};

export const MOCK_LEADS = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "new" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "contacted" }
];

export const MOCK_CONTACTS = [
  { id: "1", name: "Alice", email: "alice@example.com", message: "Hello there!", createdAt: new Date().toISOString() }
];

export const MOCK_PAYMENTS = [
  { id: "1", planName: "Premium", amount: 5000, status: "completed", createdAt: new Date().toISOString() }
];
