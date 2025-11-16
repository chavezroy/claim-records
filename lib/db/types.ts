// Database type definitions matching the PostgreSQL schema

export type UserRole = 'admin' | 'user';
export type PostStatus = 'draft' | 'published' | 'archived';
export type ProductCategory = 'shirt' | 'sticker' | 'digital' | 'other';
export type ProductType = 'physical' | 'digital' | 'bundle';
export type MediaType = 'image' | 'audio' | 'video' | 'gallery';
export type VideoType = 'youtube' | 'vimeo' | 'upload';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';
export type CommentEntityType = 'post' | 'artist' | 'product';
export type RatingEntityType = 'product' | 'artist' | 'post';
export type VoteEntityType = 'post' | 'comment' | 'poll';
export type VoteType = 'upvote' | 'downvote';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  role: UserRole;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image: string | null;
  profile_image: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string | null;
  status: PostStatus;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Media {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: Date;
}

export interface ArtistMedia {
  id: string;
  artist_id: string;
  media_id: string;
  media_type: MediaType;
  title: string | null;
  description: string | null;
  embed_url: string | null;
  display_order: number;
  created_at: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  product_type: ProductType;
  artist_id: string | null;
  featured: boolean;
  in_stock: boolean;
  inventory_count: number | null;
  download_url: string | null;
  download_limit: number | null;
  expiry_days: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  id: string;
  product_id: string;
  media_id: string;
  display_order: number;
  created_at: Date;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: string;
  variant_value: string;
  price_modifier: number;
  inventory_count: number | null;
  created_at: Date;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_type: VideoType;
  video_url: string;
  thumbnail_url: string | null;
  artist_id: string | null;
  category: string | null;
  featured: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  stripe_payment_intent_id: string | null;
  paypal_order_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  variant_info: Record<string, any> | null;
  created_at: Date;
}

export interface DigitalDownload {
  id: string;
  order_item_id: string;
  product_id: string;
  download_token: string;
  download_url: string;
  download_count: number;
  max_downloads: number | null;
  expires_at: Date | null;
  created_at: Date;
}

export interface Comment {
  id: string;
  entity_type: CommentEntityType;
  entity_id: string;
  user_id: string | null;
  author_name: string | null;
  author_email: string | null;
  content: string;
  parent_id: string | null;
  status: CommentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Rating {
  id: string;
  entity_type: RatingEntityType;
  entity_id: string;
  user_id: string | null;
  rating: number;
  created_at: Date;
  updated_at: Date;
}

export interface Vote {
  id: string;
  entity_type: VoteEntityType;
  entity_id: string;
  user_id: string | null;
  session_id: string | null;
  vote_type: VoteType;
  created_at: Date;
}

export interface CartSession {
  id: string;
  session_id: string;
  user_id: string | null;
  cart_data: Record<string, any>;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

