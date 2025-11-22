import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReportItem, ReportContextType } from '../types';

const defaultContext: ReportContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  moveItem: () => {},
  clearReport: () => {}
};

const ReportContext = createContext<ReportContextType>(defaultContext);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ReportItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hyh_report_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse report cart", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hyh_report_cart', JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save report cart", e);
    }
  }, [items]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addItem = (item: Omit<ReportItem, 'id' | 'timestamp'>) => {
    const newItem: ReportItem = {
      ...item,
      id: generateId(), // Use safer ID generation
      timestamp: Date.now()
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const index = prev.findIndex(i => i.id === id);
      if (index === -1) return prev;
      
      const newItems = [...prev];
      if (direction === 'up' && index > 0) {
        [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      } else if (direction === 'down' && index < newItems.length - 1) {
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }
      return newItems;
    });
  };

  const clearReport = () => {
    setItems([]);
    localStorage.removeItem('hyh_report_cart');
  };

  return (
    <ReportContext.Provider value={{ items, addItem, removeItem, moveItem, clearReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) return defaultContext;
  return context;
};
