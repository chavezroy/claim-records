'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  artistName?: string;
  artistId?: string;
  variants?: {
    size?: string[];
    color?: string[];
  };
  productType?: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.productType === 'digital') {
      // For digital products, redirect to checkout
      router.push(`/checkout?product=${product.id}&quantity=${quantity}`);
      return;
    }

    if (product.variants?.size && !selectedSize && product.variants.size.length > 0) {
      setSelectedSize(product.variants.size[0]);
    }

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      artistName: product.artistName,
      price: product.price,
      image: product.image,
      size: selectedSize || product.variants?.size?.[0],
      quantity: quantity,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }} className="mb-5">
      <div className="product-options">
        {product.variants?.size && product.variants.size.length > 0 && (
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <label htmlFor="size" className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
                Size
              </label>
              <select
                id="size"
                className="form-control form-select"
                style={{ width: 'auto', minWidth: '120px', maxWidth: '200px' }}
                value={selectedSize || product.variants.size[0]}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.variants.size.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {product.variants?.color && product.variants.color.length > 0 && (
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <label htmlFor="color" className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
                Color
              </label>
              <select
                id="color"
                className="form-control form-select"
                style={{ width: 'auto', minWidth: '120px', maxWidth: '200px' }}
                value={selectedColor || product.variants.color[0]}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {product.variants.color.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <label htmlFor="quantity" className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
              Quantity
            </label>
            <input
              id="quantity"
              className="form-control"
              type="number"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              style={{ width: 'auto', minWidth: '80px', maxWidth: '120px' }}
            />
          </div>
        </div>
        <div className="add-to-cart">
          <button
            type="submit"
            className="btn btn-primary bg-primary text-white px-8 py-3 rounded hover:bg-primary/90"
            style={{ fontSize: '1rem', fontWeight: '500', minWidth: '180px' }}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : product.productType === 'digital' ? 'Buy Now' : 'Add to cart'}
          </button>
        </div>
      </div>
    </form>
  );
}

