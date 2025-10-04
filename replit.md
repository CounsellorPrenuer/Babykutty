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

### October 4, 2025
- **Payment Flow Enhancement**: Implemented modal dialog to collect user details before Razorpay payment
  - Modal collects name, email, and phone number
  - User details are stored with payment record in database
  - Details are prefilled in Razorpay payment form for better UX
  - Added name field to payments table schema
- **Footer Update**: Added partnership text "In partnership with **Mentoria** for enhanced career guidance services" with line break

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

**Data Layer**: 
- Drizzle ORM for type-safe database operations
- Database abstraction via `IStorage` interface in `server/storage.ts`
- `DbStorage` class implements storage operations for contacts and payments

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

**Schema Location**: `shared/schema.ts` (shared between client/server for type safety)

**Validation**: Zod schemas generated from Drizzle tables using drizzle-zod

### External Dependencies

**Payment Gateway**: 
- Razorpay for Indian market payment processing
- Client-side checkout.js library loaded via CDN
- Server-side Razorpay SDK for order creation and verification
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

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