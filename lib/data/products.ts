import { Product } from '@/lib/types/product';

export const products: Product[] = [
  {
    id: 'fg-last-goodbye-tshirt',
    name: 'Last Goodbye T-shirt',
    slug: 'last-goodbye-tshirt',
    description: 'Final Generation Last Goodbye T-shirt',
    price: 22.98,
    images: ['/img/shop/FG-LG-black.jpg'],
    category: 'shirt',
    artistId: 'final-generation',
    artistName: 'Final Generation',
    variants: {
      size: ['S', 'M', 'L', 'XL', '2XL'],
    },
    inStock: true,
  },
  {
    id: 'claim-logo-tshirt',
    name: 'Logo T-shirt',
    slug: 'claim-logo-tshirt',
    description: 'Claim Records Logo T-shirt',
    price: 22.98,
    images: ['/img/shop/Claim-shirt-white.jpg'],
    category: 'shirt',
    variants: {
      size: ['S', 'M', 'L', 'XL', '2XL'],
    },
    inStock: true,
  },
  {
    id: 'extrapolate-death-tshirt',
    name: 'Death Metal Logo T-shirt',
    slug: 'extrapolate-death-tshirt',
    description: 'Extrapolate Death Metal Logo T-shirt',
    price: 22.98,
    images: ['/img/shop/extrapolate-death-black.jpg'],
    category: 'shirt',
    artistId: 'extrapolate',
    artistName: 'Extrapolate',
    variants: {
      size: ['S', 'M', 'L', 'XL', '2XL'],
    },
    inStock: true,
  },
  {
    id: 'fg-logo-tshirt',
    name: 'FG Logo Tee',
    slug: 'fg-logo-tshirt',
    description: 'Final Generation FG Logo T-shirt',
    price: 32.98,
    images: ['/img/shop/FG-logo-black.png'],
    category: 'shirt',
    artistId: 'final-generation',
    artistName: 'Final Generation',
    variants: {
      size: ['S', 'M', 'L', 'XL', '2XL'],
    },
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductsByArtist(artistId: string): Product[] {
  return products.filter((product) => product.artistId === artistId);
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 3);
}

