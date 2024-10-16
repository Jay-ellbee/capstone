// src/pages/Checkout.tsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Checkout: React.FC = () => {
  const cartContext = useContext(CartContext);

  // Type guard to ensure context is defined
  if (!cartContext) {
    return <div>Loading...</div>; // Handle loading or undefined context appropriately
  }

  const { cartItems, getTotalPrice } = cartContext;

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Please add items to your cart before checking out.</p>
      ) : (
        <div>
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
          <h2>Total: ${getTotalPrice()}</h2>
          <button onClick={() => alert('Proceeding to payment...')}>Proceed to Payment</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
