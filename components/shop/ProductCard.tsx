import Image from 'next/image';
import Card from '@/components/ui/Card';
import { Product } from '@/lib/types/product';

type ProductCardProps = {
  product: Product;
  showPrice?: boolean;
  sizes?: string;
  thumbHeight?: number;
};

export default function ProductCard({ product, showPrice = true, sizes = "(max-width: 768px) 100vw, 33vw", thumbHeight = 200 }: ProductCardProps) {
  return (
    <Card href={`/shop/${product.slug}`}>
      <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: `${thumbHeight}px` }}>
        <Image
          src={product.images[0]}
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
        />
      </div>
      <div className="card-body p-5 min-h-44">
        <p className="card-title mb-0 text-primary hover:text-black transition-colors">
          {product.artistName || product.name}
        </p>
        <p className="card-subtitle mb-2 text-gray-500 text-sm">
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

