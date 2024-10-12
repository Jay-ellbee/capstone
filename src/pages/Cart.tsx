// src/pages/Cart.tsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);

  // Type guard to ensure context is defined
  if (!cartContext) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-2">
          <div className="h-3.5 w-3.5 rounded-full bg-gray-400 animate-ping delay-\[150ms\]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-gray-400 animate-ping delay-\[300ms\]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-gray-400 animate-ping delay-\[450ms\]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-gray-400 animate-ping delay-\[600ms\]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-gray-400 animate-ping delay-\[750ms\]"></div>
        </div>
      </div>
    );
  }

  const { cartItems, removeFromCart, getTotalPrice } = cartContext;

  return (
    <div className="cart p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center border-b pb-2">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg">${item.price}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mt-6">Total: ${getTotalPrice()}</h2>
    </div>
  );
};

export default Cart;
