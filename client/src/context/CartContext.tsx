// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {jwtDecode }from 'jwt-decode';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number; 
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  getTotalPrice: () => number;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; // Expose setCartItems
  loadCustomerCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    if (role === 'customer') {
      loadCustomerCart();
    } else {
      setCartItems([]); // Clear cart items on logout

      const storedCart = sessionStorage.getItem('guestCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [role]);

  useEffect(() => {
    if (role !== 'customer') {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, role]);

  const loadCustomerCart = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decoded: { user_id: string } = jwtDecode(token);
        const response = await fetch(`/api/${decoded.user_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedData: CartItem[] = data.map((item: any) => ({
            id: item.arrangement_id,
            name: item.arrangement_name,
            price: item.price,
            quantity: item.qty,
            image: item.img_link || '',
          }));
          setCartItems(formattedData);
        } else {
          console.error('Failed to load cart items from backend');
        }
      }
    } catch (error) {
      console.error('Error loading cart items from backend:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevItems, item];
      }
    });

    if (role === 'customer') {
      saveCartItemToBackend(item);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.id !== id));
  
    if (role === 'customer') {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decoded: { user_id: string } = jwtDecode(token);
        removeCartItemFromBackend(decoded.user_id, id);
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const saveCartItemToBackend = async (item: CartItem) => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decoded: { user_id: string } = jwtDecode(token);
        const payload = {
          registered_customer_id: decoded.user_id,
          arrangement_id: item.id,
          qty: item.quantity,
        };

        const response = await fetch('/api/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error('Failed to save cart item to backend');
        }
      }
    } catch (error) {
      console.error('Error saving cart item to backend:', error);
    }
  };

  const removeCartItemFromBackend = async (registered_customer_id: string, arrangement_id: string) => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const payload = { registered_customer_id, arrangement_id };
        const response = await fetch(`/api/remove`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to remove cart item from backend:', errorData);
        }
      }
    } catch (error) {
      console.error('Error removing cart item from backend:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalPrice, setCartItems, loadCustomerCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
