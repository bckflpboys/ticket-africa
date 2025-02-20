'use client';

import React, { createContext, useContext, useState } from 'react';

interface TicketItem {
  id: string;
  eventId: string;
  eventName: string;
  ticketType: 'regular' | 'vip' | 'vvip';
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface CoolerBoxItem {
  id: string;
  eventId: string;
  eventName: string;
  price: number;
}

interface CartContextType {
  tickets: TicketItem[];
  coolerBoxes: CoolerBoxItem[];
  addTicket: (ticket: Omit<TicketItem, 'id'>) => void;
  addCoolerBox: (coolerBox: Omit<CoolerBoxItem, 'id'>) => void;
  removeTicket: (ticketId: string) => void;
  removeCoolerBox: (coolerBoxId: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType>({
  tickets: [],
  coolerBoxes: [],
  addTicket: () => {},
  addCoolerBox: () => {},
  removeTicket: () => {},
  removeCoolerBox: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [coolerBoxes, setCoolerBoxes] = useState<CoolerBoxItem[]>([]);

  const addTicket = (ticket: Omit<TicketItem, 'id'>) => {
    setTickets(prev => {
      const id = `${ticket.eventId}-${ticket.ticketType}-${Date.now()}`;
      return [...prev, { ...ticket, id }];
    });
  };

  const addCoolerBox = (coolerBox: Omit<CoolerBoxItem, 'id'>) => {
    setCoolerBoxes(prev => {
      const id = `${coolerBox.eventId}-cooler-${Date.now()}`;
      return [...prev, { ...coolerBox, id }];
    });
  };

  const removeTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const removeCoolerBox = (coolerBoxId: string) => {
    setCoolerBoxes(prev => prev.filter(coolerBox => coolerBox.id !== coolerBoxId));
  };

  const getCartTotal = () => {
    const ticketsTotal = tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
    const coolerBoxesTotal = coolerBoxes.reduce((total, coolerBox) => total + coolerBox.price, 0);
    const subtotal = ticketsTotal + coolerBoxesTotal;
    const serviceFee = subtotal * 0.05; // 5% service fee
    return subtotal + serviceFee;
  };

  const getCartCount = () => {
    const ticketsCount = tickets.reduce((count, ticket) => count + ticket.quantity, 0);
    return ticketsCount + coolerBoxes.length;
  };

  return (
    <CartContext.Provider 
      value={{ 
        tickets,
        coolerBoxes,
        addTicket,
        addCoolerBox,
        removeTicket,
        removeCoolerBox,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
