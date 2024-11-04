// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode'; // Add this package to decode the JWT token

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
  loadCustomerCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    if (role === 'customer') {
      // Load customer cart from backend and remove any guest cart items
      loadCustomerCart();
    } else {
      setCartItems([]); // Clear cart items on logout
      // Load guest cart from session storage if it exists
      const storedCart = sessionStorage.getItem('guestCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [role]);
  
  useEffect(() => {
    // Save cart items to session storage only if the user is a guest
    if (role !== 'customer') {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, role]);

  // Load cart items from backend based on registered_customer_id from token
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
  
          // Map the data to match the CartItem structure expected by the frontend
          const formattedData: CartItem[] = data.map((item: any) => ({
            id: item.arrangement_id, // Assuming arrangement_id is the item id
            name: item.arrangement_name,
            price: item.price,
            quantity: item.qty, // Map qty to quantity
            image: item.img_link || '', // Use an empty string or a default image if not provided
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
        removeCartItemFromBackend(decoded.user_id, id); // Pass both IDs
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
        // Decode the JWT to extract the registered_customer_id
        const decoded: { user_id: string } = jwtDecode(token);
  
        // Construct the payload with the required fields
        const payload = {
          registered_customer_id: decoded.user_id,
          arrangement_id: item.id,
          qty: item.quantity  // Assuming `id` is the arrangement ID
        };
  
        const response = await fetch('/api/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
  
        const responseData = await response.json();
        console.log('Backend response:', responseData);
  
        if (!response.ok) {
          console.error('Failed to save cart item to backend');
        } else {
          console.log('Item saved to backend successfully');
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
        // Construct the payload with the required fields
        const payload = {
          registered_customer_id,
          arrangement_id,
        };
  
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
        } else {
          console.log('Item removed from backend successfully');
        }
      }
    } catch (error) {
      console.error('Error removing cart item from backend:', error);
    }
  };
  
  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalPrice, loadCustomerCart }}>
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
