import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext'; // Ensure this path is correct
import Home from '@/pages/Home'; // Adjust paths as necessary
import { LoginForm } from '@/pages/Login';
import { SignUpForm } from '@/pages/Signup';
import ProductList from '@/pages/ProductList';
import ProductDetail from '@/pages/ProductDetail'; // Adjust path as necessary
import Dashboard from '@/admin/AdminDashboard';
import OrdersPage from '@/admin/OrdersPage';
import { Inventory } from './admin/InventoryPage';
import Customers from './admin/CustomerPage';
import Sales from '@/admin/SalesPage';
import TransactionsPage from '@/admin/TransactionsPage';
import Cart from '@/pages/Cart';
import RegCustomersPage from './admin/RegisteredCustomers';
import GuestCustomersPage from './admin/GuestCustomers';
import CurrentOrdersPage from './admin/CurrentOrders';
import CompletedOrdersPage from './admin/CompletedOrders';

import Auth from './pages/Auth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home Page */}
          <Route path="/login" element={<LoginForm />} /> {/* Login Page */}
          <Route path="/signup" element={<SignUpForm />} /> {/* Sign Up Page */}
          <Route path="/products" element={<ProductList />} /> {/* Product List Page */}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Product Detail */}
          <Route path="/admin/dashboard" element={<Dashboard />}/>{/* Admin Dashboard */}
          <Route path="/admin/orders" element={<OrdersPage />}/>{/* Orders */}
          <Route path="/admin/inventory" element={<Inventory />}/>{/* Inventory */}
          <Route path="/admin/customers" element={<Customers />}/>{/* Customers */}
          <Route path="/admin/sales" element={<Sales />}/>{/* Sales */}
          <Route path="/admin/transactions" element={<TransactionsPage />}/>{/* Transactions */}
          <Route path="/cart" element={<Cart />}/>{/* Cart */}
          <Route path="/admin/customers/registered" element={<RegCustomersPage/>}/> {/* Registered Customers */}
          <Route path="/admin/customers/guest" element={<GuestCustomersPage/>}/> {/* Guest Customers */}
          <Route path="/admin/orders/current" element={<CurrentOrdersPage/>}/> {/* Current Orders*/}
          <Route path="/admin/orders/completed" element={<CompletedOrdersPage/>}/> {/* Completed Orders*/}

          <Route path="/auth" element={<Auth/>}/> {/*Auth */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
