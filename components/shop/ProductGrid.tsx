import { Product } from '@/lib/types/product';
import ProductCard from './ProductCard';

type ProductGridProps = {
  products: Product[];
  showPrice?: boolean;
};

export default function ProductGrid({ products, showPrice = true }: ProductGridProps) {
  return (
    <div className="row mb-5">
      {products.map((product) => (
        <div key={product.id} className="col-sm-3 mb-3 mb-sm-0">
          <ProductCard product={product} showPrice={showPrice} />
        </div>
      ))}
    </div>
  );
}

