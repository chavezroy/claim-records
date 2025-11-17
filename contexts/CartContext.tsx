'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  artistName?: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
  onItemAdded?: (item: CartItem, isUpdate: boolean) => void;
};

export function CartProvider({ children, onItemAdded }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) => i.productId === item.productId && i.size === item.size
      );
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + (item.quantity || 1);
        const updatedItem = { ...existingItem, quantity: newQuantity };
        
        if (onItemAdded) {
          onItemAdded(updatedItem, true);
        }
        
        return prev.map((i) =>
          i.id === existingItem.id
            ? updatedItem
            : i
        );
      }
      
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random()}`,
        quantity: item.quantity || 1,
      };
      
      if (onItemAdded) {
        onItemAdded(newItem, false);
      }
      
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

