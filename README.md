# Claim Records Website

A Next.js website for Claim Records music label.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
claimrecords/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (NEW)
│   │   ├── posts/        # Content management APIs
│   │   ├── artists/       # Artist APIs
│   │   ├── products/     # Product APIs
│   │   ├── videos/        # Video APIs
│   │   ├── media/        # Media library APIs
│   │   ├── cart/         # Cart management
│   │   ├── checkout/     # Checkout process
│   │   ├── orders/       # Order management
│   │   ├── downloads/    # Digital downloads
│   │   ├── comments/     # Comment system
│   │   ├── ratings/      # Rating system
│   │   ├── votes/         # Voting system
│   │   ├── payments/     # Payment processing
│   │   └── webhooks/     # Payment webhooks
│   ├── artists/           # Artist pages
│   ├── shop/              # Shop pages
│   ├── about/             # About page
│   ├── faqs/              # FAQs page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Header, Footer, Navigation
│   ├── artists/          # Artist components
│   ├── shop/             # Shop components
│   └── ui/               # UI components
├── lib/                   # Utilities and data
│   ├── db/               # Database utilities (NEW)
│   │   ├── index.ts      # Connection pool
│   │   ├── types.ts      # Database types
│   │   └── schema.sql    # Database schema
│   ├── data/             # Mock data
│   └── types/            # TypeScript types
└── public/               # Static assets
    └── img/              # Images
```

## Features

- Homepage with hero section and featured content
- Artists listing and detail pages
- Shop with product listings and detail pages
- About and FAQs pages
- Responsive design
- TypeScript support

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Phase 1 Status

✅ Project setup complete
✅ All pages created
✅ Components built
✅ Styling applied
✅ Navigation working

## Phase 2 Status

✅ Database schema designed and created
✅ PostgreSQL connection setup with connection pooling
✅ API routes structure implemented:
  - Content APIs (posts, artists, products, videos, media)
  - E-commerce APIs (cart, checkout, orders, downloads)
  - Interaction APIs (comments, ratings, votes)
  - Payment APIs (Stripe, PayPal - placeholders for Phase 10)
  - Webhook handlers (placeholders for Phase 10)

## Phase 3 Status

✅ Authentication system implemented (NextAuth.js)
✅ Admin dashboard structure created
✅ Admin pages for content management:
  - Dashboard with stats and recent activity
  - Posts management
  - Artists management
  - Products management
  - Videos management
  - Media library
  - Orders management
  - Comments moderation
✅ Route protection middleware
✅ Admin user creation API

## Phase 4 Status

✅ Dynamic content system implemented
✅ News/blog section created (`/news`)
✅ Individual post pages with related posts
✅ Content components (PostCard, PostGrid, FeaturedPost)
✅ Homepage integration with dynamic content
✅ RSS feed generation (`/feed.xml`)
✅ Featured post display on homepage
✅ Recent posts grid on homepage

## Phase 5 Status

✅ Artist pages updated to fetch from database
✅ Media components created:
  - AudioPlayer component for embedded audio
  - VideoGallery component for YouTube/Vimeo/upload videos
  - ImageGallery component for photo galleries
  - MediaSection component for unified media display
✅ Artist media API endpoint (`/api/artists/[id]/media`)
✅ Artist detail pages enhanced with:
  - Dynamic bio display
  - Social media links
  - Media galleries (audio, video, images)
  - Products/releases section
✅ Artist listing page updated to use database

## Phase 6 Status

✅ Shop pages updated to fetch from database
✅ Product detail pages with variants support
✅ Checkout flow implemented:
  - Checkout page with shipping/billing forms
  - Success page with order confirmation
  - Cancel page for cancelled orders
✅ Order viewing page (`/orders/[orderNumber]`)
✅ Digital download system:
  - Download API endpoint
  - Download tracking and limits
  - Expiry date support
✅ AddToCartButton component with variant selection
✅ Cart integration with checkout
✅ Product filtering by category and artist

## Phase 7 Status

✅ Video media section created (`/videos`)
✅ Video listing page with filtering
✅ Individual video pages with player
✅ Video components:
  - VideoCard for video previews
  - VideoGrid for displaying video collections
  - VideoPlayer for YouTube/Vimeo/upload playback
  - CategoryFilter for filtering videos
✅ Video view count tracking
✅ Related videos section
✅ Support for YouTube, Vimeo, and direct upload videos

## Phase 8 Status

✅ Promo card components created:
  - FeaturedMusic component for featured artists/products/posts
  - ShopBy component for filtering by products/artists/featured
  - YouMightLike component for recommendations
✅ Promo components integrated into:
  - Product detail pages
  - Artist detail pages
✅ Dynamic content fetching for all promo components
✅ Responsive grid layouts for promo cards

## Phase 9 Status

✅ Public interaction components created:
  - CommentsSection for displaying and managing comments
  - CommentForm for submitting comments
  - CommentList for threaded comment display
  - RatingDisplay for showing average ratings
  - RatingForm for submitting ratings
  - VoteButton for upvote/downvote functionality
✅ Comment system with:
  - Threaded replies support
  - Author name and email collection
  - Real-time comment updates
✅ Rating system with:
  - 5-star rating display
  - Average rating calculation
  - User rating tracking
✅ Voting system with:
  - Upvote/downvote buttons
  - Vote count display
  - User vote tracking

## Database Setup

See `lib/db/README.md` for database setup instructions.

The database schema includes:
- User management (admin and public users)
- Content management (posts, categories, tags)
- Artist profiles with media associations
- Product catalog (physical and digital)
- Order management system
- Digital download tracking
- Comment, rating, and voting systems
- Media library
- Video content management

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=postgresql://user:password@host:5432/claimrecords
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
```

To generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

See the development plan for additional environment variables needed in later phases.

## Creating Admin Users

To create your first admin user, you can use the API endpoint (after setting up authentication) or create one directly in the database:

```sql
-- Hash your password first (use bcrypt with 10 rounds)
-- Then insert:
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@claimrecords.com', '<hashed_password>', 'Admin User', 'admin');
```

Or use the admin user creation API at `/api/auth/users` (requires admin authentication).

