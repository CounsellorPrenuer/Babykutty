# Career Compass Portfolio - Design Guidelines

## Design Approach: Reference-Based
**Primary Inspiration**: leadcrestconsulting.com - Premium consulting aesthetic with glassmorphism, sophisticated spacing, and smooth interactions adapted for career guidance industry.

**Brand Identity**: Career Compass represents trust, direction, and professional expertise. The design should evoke feelings of clarity, confidence, and achievement.

---

## Core Design Elements

### Color Palette

**Dark Mode Not Required** - Light theme optimized for professionalism and readability.

**Primary Colors**:
- Navy Blue: `#001f3f` (Primary brand, headers, key text)
- Gold Accent: `#D4AF37` (CTAs, highlights, achievement indicators)
- Off-White: `#FCFBF4` (Background, warm premium feel)

**Supporting Colors**:
- Text Primary: `#1a1a1a` (Body text)
- Text Secondary: `#64748b` (Descriptions, meta info)
- Border/Divider: `#e2e8f0` (Subtle separators)
- Success: `#10b981` (Form success states)

---

### Typography

**Font Families** (Google Fonts):
- Headings: `Merriweather` - Serif, authoritative, classic
- Body: `Lato` - Sans-serif, clean, professional

**Type Scale**:
- Hero Headline: `text-5xl md:text-6xl lg:text-7xl` (Merriweather, Bold)
- Section Headers: `text-3xl md:text-4xl lg:text-5xl` (Merriweather, Semibold)
- Subheadings: `text-xl md:text-2xl` (Merriweather, Medium)
- Body Text: `text-base md:text-lg` (Lato, Regular)
- Small Text: `text-sm` (Lato, Regular)

---

### Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistent rhythm.

**Container Structure**:
- Max width: `max-w-7xl mx-auto`
- Section padding: `py-20 md:py-24 lg:py-32`
- Inner spacing: `px-6 md:px-8`

**Grid Systems**:
- Services: 4-column grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- Packages: 3-column grid (`grid-cols-1 md:grid-cols-3`)
- Stats: 3-column inline grid (`grid-cols-3`)
- Blog: 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

---

### Component Library

#### Navigation
- **Sticky Navbar**: Semi-transparent with blur (`backdrop-blur-md bg-white/80`), becomes fully opaque on scroll
- Logo left, navigation links center, CTA button right
- Mobile: Hamburger menu with slide-in drawer
- Links: Navy blue, hover state with gold underline transition

#### Buttons
- **Primary CTA**: Gold background (#D4AF37), navy text, hover scale (1.05), subtle shadow lift
- **Secondary CTA**: Navy outline, transparent background, hover fill with navy
- **Outline on Images**: Blurred background (`backdrop-blur-sm bg-white/20`), no custom hover states
- Border radius: `rounded-full` for CTA buttons, `rounded-lg` for cards

#### Cards
- **Glassmorphism Effect**: `backdrop-blur-lg bg-white/60`, border `border border-white/20`
- Shadow: `shadow-xl hover:shadow-2xl` transition
- Hover: Slight lift (`hover:-translate-y-2`) with smooth transition
- Padding: `p-8` for content, `p-6` for compact cards

#### Forms
- Input fields: `border-2 border-gray-200 focus:border-gold rounded-lg p-4`
- Labels: Navy blue, `text-sm font-semibold uppercase tracking-wide`
- Validation: Error state with red border, success with green checkmark

---

### Visual Effects & Animations

**Glassmorphism**: Apply to navbar, service cards, and package cards
- Backdrop blur: `backdrop-blur-md` to `backdrop-blur-lg`
- Semi-transparent backgrounds: `bg-white/60` to `bg-white/80`
- Subtle borders: `border border-white/20`

**Hover States**:
- Cards: Scale + lift (`hover:scale-105 hover:-translate-y-2`)
- Buttons: Scale (`hover:scale-105`) + shadow increase
- Links: Gold underline slide-in from left
- All transitions: `transition-all duration-300 ease-in-out`

**Scroll Animations** (Use sparingly, subtle only):
- Fade-in from bottom: Opacity 0→1 with translateY(20px→0)
- Stagger children by 100ms delay
- Apply to: Service cards, stats, testimonials, blog cards

**Special Effects**:
- Hero background: Abstract compass-like geometric patterns (SVG or CSS gradients), subtle rotation animation
- Section dividers: Thin gold accent lines with centered compass icon

---

### Section-Specific Design

#### Hero Section
- **Layout**: Full viewport height (`min-h-screen`), centered content
- **Background**: Abstract compass geometric patterns in navy/gold gradient overlay
- **Content Hierarchy**: 
  - Main headline (largest, Merriweather)
  - Tagline in gold (medium, elegant spacing)
  - Sub-headline (lighter navy, Lato)
  - Dual CTA buttons (primary + secondary) with 4-unit gap
- **Stats Bar**: Three stat boxes below CTAs - glassmorphic cards with icon, number, label
- **Image**: Large hero image NOT recommended - abstract patterns provide visual interest without competing with message

#### Services Section
- **Header**: Centered, navy blue with gold accent underline
- **Card Design**: Glassmorphic cards with icon top, title, description
- **Icons**: Simple line icons in gold, size `w-12 h-12`
- **Grid**: 4 cards, equal height, responsive stack on mobile

#### About Me Section
- **Layout**: Two-column (profile image left, bio right) on desktop, stack on mobile
- **Profile Image**: Circular (`rounded-full`), shadow-xl, max-width `w-72`
- **Bio**: Navy headings, gray body text, generous line-height (1.8)

#### Packages Section
- **Card Emphasis**: Center card slightly elevated and highlighted with gold accent border
- **Content**: Package name, price (large, gold), feature list, CTA button
- **Razorpay Button**: Primary gold button with payment icon

#### Blog Section
- **Card Design**: Image top (16:9 aspect), category badge (gold), title, excerpt, read more link
- **Hover**: Image subtle zoom, card lift

#### Testimonials
- **Layout**: 3-column grid, quote cards with client photo, name, role
- **Design**: Light background, italic quote text, gold quotation marks

#### Contact Section
- **Two-Column**: Form left (60%), contact details right (40%)
- **Form**: Clean, spacious inputs with focus states
- **Details**: Icon + text pairs for email, phone, social

#### Footer
- **Structure**: Multi-column (logo/tagline, quick links, services, social)
- **Style**: Navy background, light text, gold accent on hover
- **Bottom Bar**: Copyright centered, thin gold top border

---

### Images

**Logo**: Provided image - Place in navbar (h-12), centered in footer (h-16)

**Profile Picture**: Provided image - Place in About Me section, circular treatment, shadow-xl

**Hero Section**: Use abstract geometric compass patterns (CSS/SVG) rather than photo - maintains focus on message

**Service Icons**: Use FontAwesome or Heroicons via CDN - compass, map, chart-line, arrows-turn-right (gold color)

**Blog Placeholders**: Use solid color blocks with category icon overlays (navy/gold gradient) - avoid generic stock photos

**Testimonial Photos**: Use colored circular placeholders with initials (navy background, white text) until real photos provided

---

### Responsive Breakpoints

- Mobile: `< 768px` - Single column, full-width cards, stacked sections
- Tablet: `768px - 1024px` - 2-column grids, adjusted typography scale  
- Desktop: `> 1024px` - Full multi-column layouts, maximum visual impact

---

### Accessibility & Polish

- Color contrast: Ensure navy/white passes WCAG AA (4.5:1 minimum)
- Focus states: Gold outline (`ring-2 ring-gold`) on all interactive elements
- Skip to content link for keyboard navigation
- Semantic HTML: Proper heading hierarchy, ARIA labels on icons
- Loading states: Razorpay button shows spinner during payment processing