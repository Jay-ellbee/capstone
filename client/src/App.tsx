import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './pages/Login';
import SignUpForm from './pages/Signup';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './customer/Profile';
import Customization from './pages/Customization';
import NotFound from './error/NotFound'; 
import Dashboard from './admin/AdminDashboard';
import CompletedOrders from './admin/CompletedOrders';
import CurrentOrders from './admin/CurrentOrders';
import CustomerPage from './admin/CustomerPage';
import { Inventory } from './admin/InventoryPage';
import OrdersPage from './admin/OrdersPage';
import SalesPage from './admin/SalesPage';
import TransactionsPage from './admin/TransactionsPage';
import AccountSetup from './customer/AccountSetUp';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import CartProvider from './context/CartContext';
import AboutUs from './pages/AboutUs';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/customization" element={<Customization />} /> 
          <Route path="/about-us" element={<AboutUs />} />         
          {/* Protected Customer Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedTypes={['customer']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-set-up"
            element={
              <ProtectedRoute allowedTypes={['customer']}>
                <AccountSetup />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Pages - Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/completed-orders"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <CompletedOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/current-orders"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <CurrentOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <SalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
