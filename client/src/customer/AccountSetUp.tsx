import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Add this package to decode the JWT token

const AccountSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    street: '',
    apartment: '',
    city: '',
    province: '',
    zip: '',
    isDefault: false,
  });
  const navigate = useNavigate();

  // Type the event for handleInputChange as React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const fullAddress = `${formData.street} ${formData.apartment} ${formData.city}, ${formData.province}`;
  
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("No token found");
  
      // Decode the token to get the registered_customer_id
      const decoded: { user_id: string } = jwtDecode(token);
      const registered_customer_id = decoded.user_id;
  
      const payload = {
        registered_customer_id, // Add customer ID
        address: fullAddress,
      };
  
      const response = await fetch('/api/customer-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to update the address');
  
      const result = await response.json();
      console.log('Server response:', result);
      navigate('/'); // Redirect or show a success message
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-3xl bg-white rounded-[20px] shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Complete Your Account Setup</h2>
        <p className="text-center text-gray-600 mb-6">
          Please provide your shipping address.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="House number and street name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, unit, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Town/City"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Province"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Zip code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                We value your privacy and will only use this information to process your orders.
              </p>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-500">Set as Default Address</span>
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Save and Continue
            </button>
            <Link to="/" className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors">
              Skip For Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSetup;
