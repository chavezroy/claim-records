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

