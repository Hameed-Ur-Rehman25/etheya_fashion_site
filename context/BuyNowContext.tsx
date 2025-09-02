"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types";

interface BuyNowItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  price: number;
}

interface BuyNowContextType {
  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (product: Product, quantity: number, selectedSize: string) => void;
  clearBuyNowItem: () => void;
  isBuyNowMode: boolean;
}

const BuyNowContext = createContext<BuyNowContextType | undefined>(undefined);

export const BuyNowProvider = ({ children }: { children: ReactNode }) => {
  const [buyNowItem, setBuyNowItemState] = useState<BuyNowItem | null>(null);

  const setBuyNowItem = (product: Product, quantity: number, selectedSize: string) => {
    // Parse price robustly: handle formatted strings like "Rs. 7,560"
    let numericPrice = 0;
    if (typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/[^\d]/g, ''));
    } else {
      numericPrice = product.price;
    }

    const newBuyNowItem: BuyNowItem = {
      product,
      quantity,
      selectedSize,
      price: numericPrice,
    };

    setBuyNowItemState(newBuyNowItem);
  };

  const clearBuyNowItem = () => {
    setBuyNowItemState(null);
  };

  const isBuyNowMode = buyNowItem !== null;

  return (
    <BuyNowContext.Provider value={{ 
      buyNowItem, 
      setBuyNowItem, 
      clearBuyNowItem, 
      isBuyNowMode 
    }}>
      {children}
    </BuyNowContext.Provider>
  );
};

export const useBuyNow = () => {
  const context = useContext(BuyNowContext);
  if (!context) {
    throw new Error('useBuyNow must be used within a BuyNowProvider');
  }
  return context;
};
