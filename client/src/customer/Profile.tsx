import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

type CustomerData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

type OrderData = {
  orderId: string;
  arrangementName: string;
  quantity: number;
  status: string;
  price: number;
};

const Profile = () => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [editableData, setEditableData] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');

      if (!token || role !== 'customer') {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/me', {
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
        setEditableData(data);
        setLoading(false);
      } catch (error) {
        setError('Unable to load customer data.');
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

      const data: OrderData[] = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Unable to load orders.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = sessionStorage.getItem('token');
  
    const { username, email, phone, address } = editableData || {};
  
    const payload = {
      username,
      email,
      phone,
      address
    };
  
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile data.');
      }
  
      const updatedData = await response.json();
      setCustomerData(updatedData);
      setEditableData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile data.');
    }
  };
  
  const handleCancelClick = () => {
    setEditableData(customerData);
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!customerData || !editableData) return <div>No customer data available.</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      <HeaderFP />
      <main className="container mx-auto p-3 md:px-20">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Account</h1>
          
          <Tabs defaultValue="manage" className="flex gap-6">
            <TabsList className="w-1/4 flex flex-col rounded-lg bg-gray-100 p-4 space-y-2 h-1/2">
              <TabsTrigger value="manage" className="w-full text-left">Manage Account</TabsTrigger>
              <TabsTrigger value="orders" className="w-full text-left" onClick={fetchOrders}>My Orders</TabsTrigger>
            </TabsList>

            <div className="flex-grow p-0">
              <TabsContent value="manage">
                <Card className="p-6 bg-gray-100">
                  <CardHeader className="flex flex-row items-center">
                    <Avatar className="w-24 h-24 flex items-center justify-center rounded-full ">
                      <AvatarFallback className="text-4xl font-semibold text-center leading-tight bg-rose-300">
                        {customerData?.firstName?.[0] || ''}{customerData?.lastName?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ml-16 mt-0 gap-2 w-3/5">
                      <CardTitle className="text-3xl font-semibold">
                        {customerData.firstName} {customerData.lastName}
                      </CardTitle>
                      <div className="w-full">
                        <Input 
                          placeholder="Username"
                          name="username"
                          value={editableData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                        <Input 
                          placeholder="Email Address"
                          name="email"
                          value={editableData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                        <Input 
                          placeholder="Phone Number"
                          name="phone"
                          value={editableData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                        <Input 
                          placeholder="Address"
                          name="address"
                          value={editableData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-end mt-4 space-x-2">
                    {!isEditing ? (
                      <Button variant="outline" className="text-sm" onClick={handleEditClick}>Edit</Button>
                    ) : (
                      <>
                        <Button variant="outline" className="text-sm" onClick={handleSaveClick}>Save</Button>
                        <Button variant="outline" className="text-sm" onClick={handleCancelClick}>Cancel</Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="p-6 bg-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">My Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4">
                    {orders.length > 0 ? (
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th className="py-2 px-4">Order ID</th>
                            <th className="py-2 px-4">Arrangement Name</th>
                            <th className="py-2 px-4">Quantity</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.orderId}>
                              <td className="py-2 px-4">{order.orderId}</td>
                              <td className="py-2 px-4">{order.arrangementName}</td>
                              <td className="py-2 px-4">{order.quantity}</td>
                              <td className="py-2 px-4">{order.status}</td>
                              <td className="py-2 px-4">₱{order.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600">No orders found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
