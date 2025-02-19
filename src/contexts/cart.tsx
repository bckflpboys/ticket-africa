'use client';

import React, { createContext, useContext, useState } from 'react';

type Tickets = {
  regular: number;
  vip: number;
  vvip: number;
};

type CartItem = {
  eventId: string;
  eventName: string;
  tickets: Tickets;
  coolerBoxPass: boolean;
  subtotal: number;
  total: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(i => i.eventId === item.eventId);
      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex] = item;
        return newItems;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (eventId: string) => {
    setCartItems(prev => prev.filter(item => item.eventId !== eventId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      return count + item.tickets.regular + item.tickets.vip + item.tickets.vvip + (item.coolerBoxPass ? 1 : 0);
    }, 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        getCartTotal, 
        getCartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
