import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/admin/AdminDashboard'; // Ensure this path is correct
import OrdersPage from '@/admin/OrdersPage'; // Ensure this path is correct
import SalesPage from '@/admin/SalesPage'; // Ensure this path is correct
import TransactionsPage from '@/admin/TransactionsPage'; // Ensure this path is correct
import Customers from '@/admin/CustomerPage'; // Ensure this path is correct
import {Inventory} from '@/admin/InventoryPage'; // Ensure this path is correct

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
        </Routes>
    );
};

export default AdminRoutes;
