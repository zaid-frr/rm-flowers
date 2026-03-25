import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  minOrderQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rmflowers_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rmflowers_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.productId === newItem.productId);
      if (existing) {
        return current.map(i => 
          i.productId === newItem.productId 
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...current, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(current => 
      current.map(i => {
        if (i.productId === productId) {
          const minQty = Math.max(6, i.minOrderQuantity || 6);
          if (quantity < minQty) return i;
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
