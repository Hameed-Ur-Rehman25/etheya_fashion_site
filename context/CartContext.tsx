"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product, CartItem } from "@/types";

// CartItem now imported from types

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Parse price robustly: handle formatted strings like "Rs. 7,560"
        let numericPrice = 0;
        if (typeof product.price === 'string') {
          numericPrice = parseInt(product.price.replace(/[^\d]/g, ''));
        } else {
          numericPrice = product.price;
        }
        return [
          ...prev,
          {
            product,
            quantity,
            selectedSize,
            price: numericPrice,
          },
        ];
      }
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
};
