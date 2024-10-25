import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CustomerData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
};

const Profile = () => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');

      // If token is missing or user is not a customer, redirect to login
      if (!token || role !== 'customer') {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5500/api/customer/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer data.');
        }

        const data: CustomerData = await response.json();
        setCustomerData(data);
        setLoading(false);
      } catch (error) {
        setError('Unable to load customer data.');
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Loading state while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show error message if data fetching fails
  }

  if (!customerData) {
    return <div>No customer data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center bg-white p-6 shadow-md">
        <div className="flex items-center">
          <button className="p-3 rounded-full bg-gray-200">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="ml-3 text-xl font-bold">Logo</h1>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#about" className="text-gray-700">About us</a>
          <a href="#contact" className="text-gray-700">Contact</a>
          <a href="#services" className="text-gray-700">Services</a>
          <i className="fas fa-bell text-gray-700"></i>
          <i className="fas fa-shopping-cart text-gray-700"></i>
        </div>
      </nav>

      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6">My Account</h2>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              <li>
                <button className="w-full text-left py-2 px-4 bg-gray-200 rounded-md">
                  Manage Account
                </button>
              </li>
              <li>
                <button className="w-full text-left py-2 px-4 bg-gray-200 rounded-md">
                  My Addresses
                </button>
              </li>
              <li>
                <button className="w-full text-left py-2 px-4 bg-gray-200 rounded-md">
                  My Orders
                </button>
              </li>
              <li>
                <button className="w-full text-left py-2 px-4 bg-gray-200 rounded-md">
                  Other Options
                </button>
              </li>
            </ul>
          </aside>

          {/* Customer Info Section */}
          <div className="col-span-2 bg-white p-8 rounded-lg shadow-md flex justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-bold">{customerData.name}</h3>
                  <p className="text-gray-500">{customerData.email}</p>
                  <p className="text-gray-500">{customerData.phone}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="font-semibold">Gender: {customerData.gender}</p>
                <p className="font-semibold">Birthday: {customerData.birthday}</p>
              </div>
            </div>
            <button className="self-start bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto grid grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Name</h4>
            <div className="flex space-x-4 mb-4">
              <i className="fab fa-twitter"></i>
              <i className="fab fa-github"></i>
              <i className="fab fa-linkedin"></i>
            </div>
            <p className="text-gray-400">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.</p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Menu</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-gray-300">Home</a></li>
              <li><a href="#store" className="hover:text-gray-300">Store</a></li>
              <li><a href="#about" className="hover:text-gray-300">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Pages</h4>
            <ul className="space-y-2">
              <li><a href="#lorem" className="hover:text-gray-300">Lorem</a></li>
              <li><a href="#ipsum" className="hover:text-gray-300">Ipsum</a></li>
              <li><a href="#hotdog" className="hover:text-gray-300">Hotdog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: contact@imageagency.io</p>
            <p className="text-gray-400">Phone: (+44) 7522 - 507979</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
