
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReportItem, ReportContextType } from '../types';

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ReportItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hyh_report_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse report cart from storage", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('hyh_report_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<ReportItem, 'id' | 'timestamp'>) => {
    const newItem: ReportItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      timestamp: Date.now()
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearReport = () => {
    setItems([]);
    localStorage.removeItem('hyh_report_cart');
  };

  return (
    <ReportContext.Provider value={{ items, addItem, removeItem, clearReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
