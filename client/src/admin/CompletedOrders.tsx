// src/admin/TransactionsPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckIcon,
File,
ListFilter,
CalendarIcon,
ArrowDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header
import { Calendar } from "@/components/ui/calendar"


{/*Use the logic but use the shadcn design hehe */}

type DataItem = {
  order_id: string;
  arrangement_name: string;
  type_name: string;
  ord_qty: number;
  ord_date: string;
  status: string;
  completion_date: string;
}

const CompletedOrdersPage: React.FC = () => {
  const [currentOrders, setCurrentOrders] = useState<DataItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function getOrders() {
      try {
        const orders = await fetchOrders();
  
        // Ensure orders is an array or contains an array in 'orders'
        const ordersArray = Array.isArray(orders) ? orders : orders?.orders;
  
        if (Array.isArray(ordersArray)) {
          // Separate orders based on status
          const completed = ordersArray.filter((order) => {
            const status = order.status.toLowerCase();
            return status === "completed" || status === "cancelled";
          });
  
          const current = ordersArray.filter((order) => {
            const status = order.status.toLowerCase();
            return status !== "completed" && status !== "cancelled";
          });
  
          // Update state with the filtered data
          setFilteredData(completed);
          setData(completed);
          setCurrentOrders(current);
          setCompletedOrders(completed);
        } else {
          console.error('Invalid orders data format.');
          setError('Invalid orders data format.');
        }
      } catch (fetchError) {
        console.error('Failed to fetch orders:', fetchError);
        setError('Failed to fetch orders.');
      }
    }
  
    getOrders();
  }, []);
  
  async function fetchOrders() {
    try {
      const response = await fetch('/api/orders/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
  
      const orders = await response.json();
      console.log("Fetched orders:", orders);  // Log the response for debugging
      return orders;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setError('Error fetching orders.');
      return null;
    }
  }
  
  // Type guard to validate DataItem structure
  function isValidDataItem(item: any): item is DataItem {
    return (
      typeof item.order_id === 'string' &&
      typeof item.arrangement_id === 'string' &&
      typeof item.ord_qty === 'number' &&
      typeof item.ord_date === 'string' &&
      typeof item.status === 'string' &&
      typeof item.completion_date === 'string'
    );
  }

  // Sorting by date from most recent to oldest
const sortByMostRecent = () => {
  const sortedData = [...filteredData].sort((a, b) => new Date(b.ord_date).getTime() - new Date(a.ord_date).getTime());
  setFilteredData(sortedData);
};

// Sorting by date from oldest to most recent
const sortByOldest = () => {
  const sortedData = [...filteredData].sort((a, b) => new Date(a.ord_date).getTime() - new Date(b.ord_date).getTime());
  setFilteredData(sortedData);
};

  // Filter function to apply based on date range
  const filterData = (startDate: Date) => {
    const filtered = data.filter((item) => new Date(item.ord_date) >= startDate);
    setFilteredData(filtered);
  };

  // Apply single date filter when calendar date is selected
  useEffect(() => {
    if (date) {
      const filtered = data.filter((item) => new Date(item.ord_date).toDateString() === date.toDateString());
      setFilteredData(filtered);
    }
  }, [date, data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});

  // Function to handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
     // Find the order in the current orders list
  const order = currentOrders.find((order) => order.order_id === id);

  if (!order) return; // Exit if order is not found

  // Update the order in the database
  try {
    const response = await fetch(`/api/orders/stat/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }

    // If successfully updated in the database, update the state
    if (newStatus === "Completed" || newStatus === "Cancelled") {
      setCurrentOrders((prevOrders) =>
        prevOrders.filter((o) => o.order_id !== id)
      );
      setCompletedOrders((prevOrders) => [
        ...prevOrders,
        { ...order, status: newStatus },
      ]);
    } else {
      // Update the order's status in current orders if not moving to completed
      setCurrentOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.order_id === id ? { ...o, status: newStatus } : o
        )
      );
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    // Optionally handle UI feedback for the error here
  }
  };

  const togglePopover = (id: string, isOpen: boolean) => {
    setOpenPopovers((prevState) => ({ ...prevState, [id]: isOpen }));
  };

      return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
      <Header /> {/* Render the Header */}
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-2">
        <div className="flex items-center">
          <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                  <Link to="/admin/orders">Orders</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                  <BreadcrumbPage>View Completed Orders</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
             
            </div>
          <div className="p-4">
          <Card x-chunk="dashboard-05-chunk-3" className="mt-6 ml-6 p-4 bg-gray-50">
                        <CardHeader className="px-7">
                          <CardTitle>Recent Orders</CardTitle>
                          <CardDescription>
                            Completed and cancelled orders from your store.
                          </CardDescription>
                          <div className="ml-auto flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 gap-1">
                                  <CalendarIcon className="h-3.5 w-3.5" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={(newDate) => setDate(newDate)}
                                  className="rounded-md border shadow"
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 gap-1">
                                  <ArrowDown className="h-3.5 w-3.5" /> Sort By
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Sort by Date</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={sortByMostRecent}>
                                  Most Recent to Oldest
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={sortByOldest}>
                                  Oldest to Most Recent
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead className="hidden sm:table-cell">Arrangement</TableHead>
                                <TableHead className="hidden sm:table-cell">Arrangement Type</TableHead>
                                <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                <TableHead className="hidden md:table-cell">Order Date</TableHead>                                <TableHead className="hidden md:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredData.map((item) => (
                              <TableRow key={item.order_id} className="bg-accent">
                                <TableCell>
                                  <div className="font-medium">{item.order_id}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{item.arrangement_name}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.type_name}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.ord_qty}</TableCell>
                                <TableCell className="hidden sm:table-cell">{formatDate(item.ord_date)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.status}</TableCell>
                                <TableCell className="hidden md:table-cell">{formatDate(item.completion_date)}</TableCell>
                              </TableRow>
                            ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
          </div>
        </main>
      </div>
  </div>
  )}

export default CompletedOrdersPage;
