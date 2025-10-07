# Career Compass Portfolio

## Overview

Career Compass is a professional portfolio and career guidance platform for career counselor Babikutty P. Rajan. The application is a single-page React website featuring:

- **Hero section** with compelling introduction and call-to-action
- **About section** showcasing counselor credentials and experience
- **Services section** highlighting four core offerings (Career Exploration, Educational Planning, Professional Development, Career Transition)
- **Pricing packages** with interactive tab-based selection for different student/professional categories
- **Blog section** with career guidance articles
- **Testimonials** from satisfied clients
- **Contact form** for inquiries
- **Payment integration** via Razorpay for package purchases with modal for collecting user details (name, email, phone) before payment

The site emphasizes a premium, trustworthy aesthetic inspired by consulting websites, using glassmorphism, smooth animations, and sophisticated spacing to convey professionalism and expertise in the career guidance industry.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 7, 2025
- **AI Blog Generation System**: Integrated OpenAI GPT-5 for intelligent content creation
  - AI-powered blog post generation from topic, keywords, tone, and length preferences
  - Smart content improvement feature to enhance existing blog posts
  - Beautiful stats cards showing Total Blog Posts, AI Powered, Smart Editing capabilities
  - Collapsible AI generation UI in blog creation dialog with purple gradient design
  - Tone options: Professional, Friendly, Inspirational, Academic
  - Length options: Short (800-1000 words), Medium (1500-2000 words), Long (2500-3000 words)
  - Generated content auto-populates title, excerpt, content, category, and read time
  - "Improve with AI" button for content enhancement with loading states
  - Full error handling and user feedback via toasts

### October 4, 2025
- **Payment Flow Enhancement**: Implemented modal dialog to collect user details before Razorpay payment
  - Modal collects name, email, and phone number
  - User details are stored with payment record in database
  - Details are prefilled in Razorpay payment form for better UX
  - Added name field to payments table schema
- **Footer Update**: Added partnership text "In partnership with **Mentoria** for enhanced career guidance services" with line break
- **Admin Dashboard Implementation**: Built comprehensive admin dashboard at `/admin/bookings`
  - Four functional tabs: Overview, Bookings, Contact Forms, Lead Downloads (Payments tab removed)
  - Lead consolidation system: all contacts and payments flow into unified leads table
  - Stats cards showing total bookings, pending leads, completed payments, conversion rate
  - Recent leads/contact forms/payments display with date filtering and pagination
  - Export functionality for all data and individual data types (JSON format)
  - Comprehensive error handling with retry capability
  - Graceful degradation when Razorpay credentials unavailable
- **Blog Management System**: Complete blog CMS with database-driven content
  - Admin interface at `/admin/blogs` for full CRUD operations
  - Create/edit blogs with rich content, categories, and visual gradients
  - Featured blog system: toggle featured status to control homepage visibility
  - Individual blog detail pages at `/blog/:id` with formatted content rendering
  - All blogs listing page at `/blogs` showing complete blog catalog
  - Homepage displays only featured blogs (up to 3) with "View All Blogs" button
  - Proper cache invalidation: admin changes immediately reflect on public pages
  - Content formatting supports bold text, headings, numbered/bulleted lists

## System Architecture

### Frontend Architecture

**Framework**: React 18 with Vite as the build tool and development server

**Routing**: wouter for lightweight client-side routing (single page with smooth scrolling to sections)

**UI Component Library**: shadcn/ui (Radix UI primitives) providing accessible, customizable components including:
- Cards, buttons, forms, dialogs
- Tabs for pricing section interaction
- Toast notifications for user feedback
- Navigation components

**Styling Approach**:
- Tailwind CSS for utility-first styling
- Custom CSS variables for theme tokens (defined in `client/src/index.css`)
- Design system with predefined color palette (navy blue primary, gold accents, off-white backgrounds)
- Typography: Google Fonts - Merriweather (headings) and Lato (body text)
- Responsive breakpoints following Tailwind conventions (sm, md, lg)
- Glassmorphism and smooth animation effects throughout

**State Management**:
- TanStack Query (React Query) for server state and API interactions
- Local React state for UI interactions (form inputs, scroll animations, mobile menu)
- IntersectionObserver API for scroll-triggered animations

**Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Structure**: RESTful endpoints:
- `POST /api/contact` - Submit contact form inquiries
- `POST /api/create-order` - Initialize Razorpay payment order with user details (name, email, phone)
- `POST /api/verify-payment` - Verify completed Razorpay transactions
- `GET /api/admin/stats` - Fetch dashboard statistics
- `GET /api/admin/leads` - Retrieve all consolidated leads
- `GET /api/admin/contacts` - Retrieve all contact form submissions
- `GET /api/admin/payments` - Retrieve all payment records
- `GET /api/blogs` - Retrieve all blog posts
- `GET /api/blogs/featured` - Retrieve only featured blog posts
- `GET /api/blogs/:id` - Retrieve single blog post by ID
- `POST /api/blogs` - Create new blog post (admin)
- `PUT /api/blogs/:id` - Update existing blog post (admin)
- `DELETE /api/blogs/:id` - Delete blog post (admin)
- `PATCH /api/blogs/:id/feature` - Toggle blog featured status (admin)
- `POST /api/blogs/generate` - Generate blog post using AI (requires topic, keywords, tone, length)
- `POST /api/blogs/improve` - Improve blog content using AI (requires content)

**Data Layer**: 
- Drizzle ORM for type-safe database operations
- Database abstraction via `IStorage` interface in `server/storage.ts`
- `DbStorage` class implements storage operations for contacts, payments, and leads
- Automatic lead creation: contact forms and payments both create lead entries for unified tracking

**Build Process**:
- Development: tsx for TypeScript execution with hot reload
- Production: esbuild bundles server code, Vite builds client assets
- Separate build outputs: `dist/public` (client) and `dist` (server)

### Database Schema

**ORM**: Drizzle with PostgreSQL dialect (configured for Neon serverless)

**Tables**:

1. **contacts** - Contact form submissions
   - id (UUID, primary key)
   - name, email, phone, message (text fields)
   - createdAt (timestamp)

2. **payments** - Payment transaction records
   - id (UUID, primary key)
   - razorpayPaymentId, razorpayOrderId (Razorpay identifiers)
   - planName, amount (package details)
   - name, email, phone (customer information)
   - status (pending/completed)
   - createdAt (timestamp)

3. **leads** - Consolidated lead tracking system
   - id (UUID, primary key)
   - source ("contact" or "payment")
   - name, email, phone (contact information)
   - message (nullable, from contact forms)
   - planName, amount (nullable, from payments)
   - status ("pending" or "completed")
   - createdAt (timestamp)
   - Note: Automatically populated from contacts and payments tables

4. **blogs** - Blog content management
   - id (UUID, primary key)
   - title (text, blog post title)
   - excerpt (text, short description)
   - content (text, full article content)
   - category (text, e.g., "Career Tips", "Student Guide")
   - date (text, formatted date string)
   - readTime (text, e.g., "5 min read")
   - gradient (text, Tailwind gradient classes for header)
   - featured (integer, 0 or 1 - controls homepage visibility)
   - createdAt (timestamp)

**Schema Location**: `shared/schema.ts` (shared between client/server for type safety)

**Validation**: Zod schemas generated from Drizzle tables using drizzle-zod

### External Dependencies

**AI Content Generation**:
- OpenAI GPT-5 for intelligent blog content generation and improvement
- Environment variable: `OPENAI_API_KEY`
- Server-side OpenAI SDK for chat completions with JSON response format
- Features: Blog generation from topic/keywords/tone/length, content improvement
- Graceful error handling when API key unavailable

**Payment Gateway**: 
- Razorpay for Indian market payment processing
- Client-side checkout.js library loaded via CDN
- Server-side Razorpay SDK for order creation and verification
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- Conditional initialization: Razorpay only initialized when credentials available
- Graceful degradation: Admin dashboard and non-payment features work without Razorpay credentials

**Database**:
- Neon Serverless PostgreSQL
- WebSocket connection pooling via @neondatabase/serverless
- Connection string via `DATABASE_URL` environment variable

**Development Tools**:
- Replit-specific plugins for development banner, error overlay, and code mapping
- Vite middleware mode for seamless dev server integration

**Asset Management**:
- Static assets stored in `attached_assets/` directory
- Images referenced via Vite aliases (@assets)
- Profile image and logo loaded from local assets

**Google Fonts**: 
- Merriweather and Lato font families
- Preconnected to fonts.googleapis.com and fonts.gstatic.com for performance

### Design System

**Color Scheme** (light mode only):
- Primary: Navy Blue (#001f3f) - brand color, headers, key text
- Accent: Gold (#D4AF37) - CTAs, highlights, achievements
- Background: Off-white (#FCFBF4) - warm, premium feel
- Text hierarchy with primary (#1a1a1a) and secondary (#64748b) tones

**Spacing System**: Tailwind units (4, 6, 8, 12, 16, 20, 24) for consistent rhythm

**Animation Strategy**:
- IntersectionObserver triggers for scroll-based reveals
- Staggered card animations (150ms delay per item)
- Smooth hover transitions and glassmorphic effects
- CSS custom properties for theme-aware styling