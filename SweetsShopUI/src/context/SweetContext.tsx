import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

interface SweetContextType {
  sweets: Sweet[];
  addSweet: (sweet: Omit<Sweet, 'id'>) => void;
  updateSweet: (id: string, sweet: Partial<Sweet>) => void;
  deleteSweet: (id: string) => void;
  purchaseSweet: (id: string) => boolean;
}

const SweetContext = createContext<SweetContextType | undefined>(undefined);

const INITIAL_SWEETS: Sweet[] = [
  { id: '1', name: 'Chocolate Truffle', category: 'Chocolates', price: 3.99, quantity: 25, image: '🍫' },
  { id: '2', name: 'Strawberry Macaron', category: 'Macarons', price: 2.49, quantity: 30, image: '🍓' },
  { id: '3', name: 'Vanilla Cupcake', category: 'Cupcakes', price: 4.99, quantity: 15, image: '🧁' },
  { id: '4', name: 'Caramel Candy', category: 'Candies', price: 1.99, quantity: 50, image: '🍬' },
  { id: '5', name: 'Lemon Tart', category: 'Pastries', price: 5.49, quantity: 12, image: '🍋' },
  { id: '6', name: 'Mint Chocolate', category: 'Chocolates', price: 3.49, quantity: 20, image: '🍃' },
  { id: '7', name: 'Raspberry Macaron', category: 'Macarons', price: 2.49, quantity: 28, image: '🫐' },
  { id: '8', name: 'Red Velvet Cupcake', category: 'Cupcakes', price: 5.49, quantity: 18, image: '❤️' },
  { id: '9', name: 'Fruit Gummy Bears', category: 'Candies', price: 2.99, quantity: 0, image: '🐻' },
  { id: '10', name: 'Apple Pie Slice', category: 'Pastries', price: 4.49, quantity: 8, image: '🥧' },
];

export function SweetProvider({ children }: { children: ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>(INITIAL_SWEETS);

  const addSweet = (sweet: Omit<Sweet, 'id'>) => {
    const newSweet: Sweet = {
      ...sweet,
      id: `sweet_${Date.now()}`,
    };
    setSweets(prev => [...prev, newSweet]);
  };

  const updateSweet = (id: string, updates: Partial<Sweet>) => {
    setSweets(prev => prev.map(sweet => 
      sweet.id === id ? { ...sweet, ...updates } : sweet
    ));
  };

  const deleteSweet = (id: string) => {
    setSweets(prev => prev.filter(sweet => sweet.id !== id));
  };

  const purchaseSweet = (id: string): boolean => {
    const sweet = sweets.find(s => s.id === id);
    if (!sweet || sweet.quantity <= 0) return false;
    
    setSweets(prev => prev.map(s => 
      s.id === id ? { ...s, quantity: s.quantity - 1 } : s
    ));
    return true;
  };

  return (
    <SweetContext.Provider value={{ sweets, addSweet, updateSweet, deleteSweet, purchaseSweet }}>
      {children}
    </SweetContext.Provider>
  );
}

export function useSweets() {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
}

export const CATEGORIES = ['Chocolates', 'Macarons', 'Cupcakes', 'Candies', 'Pastries'];
