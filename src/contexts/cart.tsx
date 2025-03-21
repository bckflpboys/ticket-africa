'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './toast';
import useLocalStorage from '@/hooks/useLocalStorage';

interface TicketItem {
  id: string;
  eventId: string;
  eventName: string;
  ticketType: string;
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
  addMultipleTickets: (tickets: Array<Omit<TicketItem, 'id'>>) => void;
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
  addMultipleTickets: () => {},
  addCoolerBox: () => {},
  removeTicket: () => {},
  removeCoolerBox: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets, ticketsInitialized] = useLocalStorage<TicketItem[]>('cart_tickets', []);
  const [coolerBoxes, setCoolerBoxes, coolerBoxesInitialized] = useLocalStorage<CoolerBoxItem[]>('cart_coolerBoxes', []);
  const { showToast } = useToast();

  // Don't render children until storage is initialized
  if (!ticketsInitialized || !coolerBoxesInitialized) {
    return null;
  }

  const addTicket = (ticket: Omit<TicketItem, 'id'>) => {
    setTickets(prev => {
      const updatedTickets = [...prev];
      const existingIndex = updatedTickets.findIndex(t => 
        t.eventId === ticket.eventId && 
        t.ticketType === ticket.ticketType
      );

      if (existingIndex !== -1) {
        updatedTickets[existingIndex] = {
          ...updatedTickets[existingIndex],
          quantity: updatedTickets[existingIndex].quantity + ticket.quantity
        };
      } else {
        const id = `${ticket.eventId}-${ticket.ticketType}-${Date.now()}`;
        updatedTickets.push({ ...ticket, id });
      }

      return updatedTickets;
    });
  };

  const addMultipleTickets = (tickets: Array<Omit<TicketItem, 'id'>>) => {
    setTickets(prev => {
      const updatedTickets = [...prev];
      
      tickets.forEach(ticket => {
        const existingIndex = updatedTickets.findIndex(t => 
          t.eventId === ticket.eventId && 
          t.ticketType === ticket.ticketType
        );

        if (existingIndex !== -1) {
          updatedTickets[existingIndex] = {
            ...updatedTickets[existingIndex],
            quantity: updatedTickets[existingIndex].quantity + ticket.quantity
          };
        } else {
          const id = `${ticket.eventId}-${ticket.ticketType}-${Date.now()}`;
          updatedTickets.push({ ...ticket, id });
        }
      });

      return updatedTickets;
    });
  };

  const addCoolerBox = (coolerBox: Omit<CoolerBoxItem, 'id'>) => {
    setCoolerBoxes(prev => {
      const id = `${coolerBox.eventId}-cooler-${Date.now()}`;
      return [...prev, { ...coolerBox, id }];
    });
  };

  const removeTicket = (ticketId: string) => {
    const ticketToRemove = tickets.find(t => t.id === ticketId);
    if (!ticketToRemove) return;

    console.log('Removing ticket:', ticketToRemove);
    console.log('Current tickets:', tickets);
    console.log('Current cooler boxes:', coolerBoxes);

    // Check if this is the last ticket for this event
    const remainingEventTickets = tickets.filter(t => 
      t.eventId === ticketToRemove.eventId && t.id !== ticketId
    );

    console.log('Remaining event tickets:', remainingEventTickets);

    // If this is the last ticket and there's a cooler box for this event
    const hasEventCoolerBox = coolerBoxes.some(cb => cb.eventId === ticketToRemove.eventId);
    
    console.log('Has event cooler box:', hasEventCoolerBox);
    console.log('Remaining event tickets length:', remainingEventTickets.length);

    if (remainingEventTickets.length === 0 && hasEventCoolerBox) {
      console.log('Should show error toast - Cannot remove last ticket with cooler box');
      showToast('Cannot remove the last ticket while a cooler box pass exists for this event.', 'error');
      return;
    }

    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    showToast('Ticket removed from cart', 'info');
  };

  const removeCoolerBox = (coolerBoxId: string) => {
    setCoolerBoxes(prev => prev.filter(box => box.id !== coolerBoxId));
    showToast('Cooler box removed from cart', 'info');
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
        addMultipleTickets,
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
