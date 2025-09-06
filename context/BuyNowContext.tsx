"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types";

interface BuyNowItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  price: number;
}

interface DeliveryDetails {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  phone: string;
  apartment?: string;
  postalCode?: string;
}

interface BuyNowOrder {
  item: BuyNowItem;
  deliveryDetails: DeliveryDetails | null;
  orderId?: string;
  timestamp: Date;
}

interface BuyNowContextType {
  buyNowOrder: BuyNowOrder | null;
  setBuyNowItem: (product: Product, quantity: number, selectedSize: string) => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  clearBuyNowOrder: () => void;
  isBuyNowMode: boolean;
  getOrderSummary: () => { subtotal: number; shipping: number; total: number } | null;
}

const BuyNowContext = createContext<BuyNowContextType | undefined>(undefined);

export const BuyNowProvider = ({ children }: { children: ReactNode }) => {
  const [buyNowOrder, setBuyNowOrderState] = useState<BuyNowOrder | null>(null);

  const setBuyNowItem = (product: Product, quantity: number, selectedSize: string) => {
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

    const newOrder: BuyNowOrder = {
      item: newBuyNowItem,
      deliveryDetails: null,
      timestamp: new Date(),
    };

    setBuyNowOrderState(newOrder);
  };

  const setDeliveryDetails = (details: DeliveryDetails) => {
    if (buyNowOrder) {
      setBuyNowOrderState({
        ...buyNowOrder,
        deliveryDetails: details,
      });
    }
  };

  const clearBuyNowOrder = () => {
    setBuyNowOrderState(null);
  };

  const isBuyNowMode = buyNowOrder !== null;

  const getOrderSummary = () => {
    if (!buyNowOrder) return null;
    
    const subtotal = buyNowOrder.item.price * buyNowOrder.item.quantity;
    const shipping = 250; // Fixed shipping cost
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
  };

  return (
    <BuyNowContext.Provider value={{
      buyNowOrder,
      setBuyNowItem,
      setDeliveryDetails,
      clearBuyNowOrder,
      isBuyNowMode,
      getOrderSummary
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
