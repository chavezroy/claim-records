'use client';

import { ReactNode, useCallback, useRef } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import type { CartItem } from '@/contexts/CartContext';

function CartProviderInner({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const lastToastRef = useRef<{ itemId: string; timestamp: number } | null>(null);

  const handleItemAdded = useCallback((item: CartItem, isUpdate: boolean) => {
    // Prevent duplicate toasts within 500ms (handles React StrictMode double renders)
    const now = Date.now();
    const itemKey = `${item.productId}-${item.size || 'no-size'}-${isUpdate ? 'update' : 'add'}`;
    
    if (lastToastRef.current && 
        lastToastRef.current.itemId === itemKey && 
        now - lastToastRef.current.timestamp < 500) {
      return;
    }

    lastToastRef.current = { itemId: itemKey, timestamp: now };

    const productName = item.artistName ? `${item.artistName} - ${item.name}` : item.name;
    const sizeText = item.size ? ` (${item.size})` : '';
    
    if (isUpdate) {
      showToast(`${productName}${sizeText} quantity updated to ${item.quantity}`, 'success');
    } else {
      const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
      showToast(`Added ${productName}${sizeText}${quantityText} to cart`, 'success');
    }
  }, [showToast]);

  return (
    <CartProvider onItemAdded={handleItemAdded}>
      {children}
    </CartProvider>
  );
}

export default function CartProviderWithToast({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProviderInner>{children}</CartProviderInner>
    </ToastProvider>
  );
}
