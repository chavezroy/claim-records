export type ProductCategory = 'shirt' | 'sticker' | 'digital' | 'other';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  artistId?: string;
  artistName?: string;
  variants?: {
    size?: string[];
    color?: string[];
  };
  inStock: boolean;
};

