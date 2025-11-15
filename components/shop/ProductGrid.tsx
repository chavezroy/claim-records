import { Product } from '@/lib/types/product';
import ProductCard from './ProductCard';

type ProductGridProps = {
  products: Product[];
  showPrice?: boolean;
  columns?: 3 | 4;
};

export default function ProductGrid({ products, showPrice = true, columns = 3 }: ProductGridProps) {
  const columnClass = columns === 4 ? 'col-sm-3' : 'col-sm-4';
  const sizesValue = columns === 4 ? '(max-width: 768px) 100vw, 25vw' : '(max-width: 768px) 100vw, 33vw';
  const thumbHeight = columns === 3 ? 250 : 200;
  
  return (
    <div className="row mb-5">
      {products.map((product) => (
        <div key={product.id} className={`${columnClass} mb-3 mb-sm-0`}>
          <ProductCard product={product} showPrice={showPrice} sizes={sizesValue} thumbHeight={thumbHeight} />
        </div>
      ))}
    </div>
  );
}

