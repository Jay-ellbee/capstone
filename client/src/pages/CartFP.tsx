// src/pages/Cart.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { FilePenLine, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  //const { cartItems, removeFromCart, getTotalPrice, addToCart } = useCart();

  //delete this after testing
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Half Dozen Mixed Flowers",
      price: 3200.00,
      quantity: 1,
      image: "/Carnation-Peony-3pcs-Peony-10pcs-Carnation-Php4200-_-1.jpg", // Placeholder image URL
    },
    {
      id: 2,
      name: "Dozen Red Roses",
      price: 4500.00,
      quantity: 2,
      image: "/Blue-Ecuadorian-roses-4000.jpg",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const adjustQuantity = (id: number, amount: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Function to adjust the quantity of an item
  // const adjustQuantity = (id: number, amount: number) => {
  //   const item = cartItems.find((item) => item.id === id);
  //   if (item) {
  //     const newQuantity = item.quantity + amount;
  //     if (newQuantity > 0) {
  //       addToCart({ ...item, quantity: newQuantity });
  //     }
  //   }
  // };

  // Function to handle editing an item (You can customize this as needed)
  const editItem = (id: number) => {
    console.log(`Editing item with ID: ${id}`);
    // Add your edit logic here (e.g., open a modal to update item details)
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      {/* Header Component */}
      <HeaderFP />
      
      {/* Main Content */}
      <main className="container mx-auto p-3 md:px-20">
        <div className="cart p-4">
          <div className="flex flex-row items-center mb-6">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <Button variant="outline" className="ml-10"
                  onClick={handleSelectAll}> 
              Select All
            </Button>
          </div>

          {/* Cart Table */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Your cart is empty.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cartItems.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-100">
                      {/* Checkbox */}
                      <TableCell className="flex items-center">
                          <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="mr-2"
                        />
                        {/* Product Image */}
                        <img src={item.image} alt={item.name} className="h-12 w-12 object-cover mr-4" />
                        {/* Product Details */}
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">⭐ ⭐ ⭐ ⭐ ☆</span>
                          </div>
                        </div>
                      </TableCell>
                      {/* Price */}
                      <TableCell className="font-bold">
                        ₱{item.price.toFixed(2)}
                      </TableCell>
                      {/* Quantity Controls */}
                      <TableCell>
                        <div className="flex items-center">
                          <button
                            onClick={() => adjustQuantity(item.id, -1)}
                            className="px-2 border rounded-l bg-gray-200"
                          >
                            -
                          </button>
                          <span className="px-4 border-t border-b">{item.quantity}</span>
                          <button
                            onClick={() => adjustQuantity(item.id, 1)}
                            className="px-2 border rounded-r bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      {/* Subtotal */}
                      <TableCell>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      {/* Actions: Edit and Delete */}
                      <TableCell className="flex items-center space-x-2">
                        <button onClick={() => editItem(item.id)} className="text-gray-600 hover:text-gray-800">
                          <FilePenLine />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-700">
                          <Trash2/>
                        </button>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
              {/* Total Price */}
              <Separator />
            <CardFooter className="flex justify-between items-center p-4">
              
            <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label onClick={handleSelectAll} className="cursor-pointer">
                  Select All ({cartItems.length})
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <span>Total ({cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}): ₱{getTotalPrice().toFixed(2)}</span>
                <Link to="/checkout">
                <Button variant="default" className="bg-black text-white px-4 py-2 rounded">
                  Checkout
                </Button></Link>
              </div>
          
            </CardFooter>
          </Card>
          
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Cart;
