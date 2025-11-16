/**
 * Generate LoremFlickr placeholder image URLs
 * 
 * Public API: https://loremflickr.com
 * Self-hosted: Configure LOREMFLICKR_BASE_URL in .env.local
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param tags - Comma-separated tags (e.g., "music,merchandise")
 * @param lock - Optional lock value for consistent images
 * @returns LoremFlickr image URL
 */
export function getLoremFlickrUrl(
  width: number,
  height: number,
  tags: string = 'music',
  lock?: number
): string {
  const baseUrl = process.env.NEXT_PUBLIC_LOREMFLICKR_BASE_URL || 'https://loremflickr.com';
  const lockParam = lock ? `?lock=${lock}` : '';
  return `${baseUrl}/${width}/${height}/${tags}${lockParam}`;
}

/**
 * Get a placeholder image for a product based on its category
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param category - Product category (shirt, digital, vinyl, etc.)
 * @param productId - Optional product ID for consistent locking
 * @returns LoremFlickr image URL
 */
export function getProductPlaceholder(
  width: number,
  height: number,
  category?: string,
  productId?: string
): string {
  // Map categories to appropriate tags
  const categoryTags: Record<string, string> = {
    shirt: 'tshirt,clothing,merchandise',
    sticker: 'sticker,decals,merchandise',
    digital: 'music,digital,download',
    vinyl: 'vinyl,record,music',
    cd: 'cd,music,album',
    poster: 'poster,art,music',
    merchandise: 'merchandise,music,band',
    default: 'music,merchandise,band',
  };

  const tags = categoryTags[category?.toLowerCase() || ''] || categoryTags.default;
  
  // Use product ID as lock for consistency
  const lock = productId ? parseInt(productId.replace(/\D/g, '').slice(0, 8) || '0', 10) : undefined;
  
  return getLoremFlickrUrl(width, height, tags, lock);
}

/**
 * Check if an image URL is valid or should use placeholder
 * 
 * @param imageUrl - Image URL to check
 * @returns true if URL should be considered valid
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl || imageUrl.trim() === '') return false;
  if (imageUrl === '/img/shop/default.jpg') return false;
  if (imageUrl === '/img/artist/default.jpg') return false;
  if (imageUrl.startsWith('/img/') && imageUrl.includes('default')) return false;
  return true;
}

