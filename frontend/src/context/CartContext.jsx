import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add to Cart: Category validation ke sath
  const addToCart = (item) => {
    setCart((prevCart) => {
      // 1. Agar cart khali nahi hai, toh category check karein
      if (prevCart.length > 0) {
        const currentCategory = prevCart[0].category;
        
        // 2. Agar naye item ki category match nahi karti
        if (item.category && currentCategory && item.category !== currentCategory) {
          alert(`You can only add services from one category at a time. Your cart currently has items from another category`);
          return prevCart; // Cart mein item add nahi hoga, purana cart waise ka waisa rahega
        }
      }

      // 3. Normal Add / Quantity increase logic
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Remove From Cart: Cross (✖) button ke liye
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update Quantity: Plus (+) aur Minus (-) buttons ke liye
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) + amount;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) // Agar quantity 0 ho jaye toh cart se hata dein
    );
  };

  const clearCart = () => setCart([]);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalAmount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};