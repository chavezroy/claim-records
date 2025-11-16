'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { Product } from '@/lib/types/product';
import { getProductPlaceholder, isValidImageUrl } from '@/lib/utils/loremflickr';

type ProductCardProps = {
  product: Product;
  showPrice?: boolean;
  sizes?: string;
  thumbHeight?: number;
};

export default function ProductCard({ product, showPrice = true, sizes = "(max-width: 768px) 100vw, 33vw", thumbHeight = 200 }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get image source - use placeholder if image is missing or invalid
  const imageSrc = (() => {
    const productImage = product.images?.[0];
    if (imageError || !isValidImageUrl(productImage)) {
      return getProductPlaceholder(400, 400, product.category, product.id);
    }
    return productImage!;
  })();

  return (
    <Card href={`/shop/${product.slug}`}>
      <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: `${thumbHeight}px` }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          unoptimized
          sizes={sizes}
          className="object-cover"
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            left: 0,
            top: 0,
            transform: 'none'
          }}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.artistName || product.name}
        </p>
        <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>
          {product.artistName ? product.name : product.description}
        </p>
        {showPrice && (
          <p className="price mb-0 text-black font-light hover:text-primary hover:font-medium transition-all">
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>
    </Card>
  );
}

