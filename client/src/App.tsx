import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomeFP';
import LoginForm from './pages/Login';
import SignUpForm from './pages/Signup';
import ProductList from './pages/ProductListFP';
import ProductDetail from './pages/ProductDetailFP';
import Cart from './pages/CartFP';
import Checkout from './pages/CheckoutFP';
import Profile from './customer/Profile';
import Customization from './customer/Customization';
import NotFound from './error/NotFound'; 
import Dashboard from './admin/AdminDashboard';
import CompletedOrders from './admin/CompletedOrders';
import CurrentOrders from './admin/CurrentOrders';
import CustomerPage from './admin/CustomerPage';
import Inventory from './admin/InventoryPage';
import OrdersPage from './admin/OrdersPage';
import SalesPage from './admin/SalesPage';
import TransactionsPage from './admin/TransactionsPage';
import AccountSetup from './customer/AccountSetUp';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import CartProvider from './context/CartContext';
import AboutUs from './pages/AboutUsFP';
import { ToastProvider } from './components/ui/toast';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
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
          <Route path="/products/:arrangement_id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about-us" element={<AboutUs />} /> 
          <Route path="/services" element={<Services />} />    
          <Route path="/contact-us" element={<ContactUs />} />    
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
          <Route
            path="/customization"
            element={
              <ProtectedRoute allowedTypes={['customer']}>
                <Customization />
              </ProtectedRoute>
            } 
            />
          
          {/* Admin Pages - Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/completed-orders"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <CompletedOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/current-orders"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <CurrentOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <ToastProvider>
                  <Inventory />
                </ToastProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
                <SalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedTypes={['super_admin']}>
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
