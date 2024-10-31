import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  CalendarIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  ListFilter,
  MoreVertical,
  Truck,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CheckIcon } from "@radix-ui/react-icons"
 
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

import { format } from 'date-fns';

  const frameworks = [
    {
      value: "Completed",
      label: "Completed",
    },
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "For Delivery",
      label: "For Delivery",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
    },
  ]

  type DataItem = {
    order_id: string;
    arrangement_name: string;
    type_name: string;
    ord_qty: number;
    ord_date: string;
    status: string;
    completion_date: string;
  }

const OrdersPage: React.FC = () =>  {
  const [currentOrders, setCurrentOrders] = useState<DataItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rowsToShow = 10;

  useEffect(() => {
    async function getOrders() {
      try {
        const orders = await fetchOrders();

        // If data is wrapped in an object, unwrap it
        const ordersArray = Array.isArray(orders) ? orders : orders.orders;

        // Check if ordersArray is a valid array
        if (Array.isArray(ordersArray)) {
          const completed = ordersArray.filter((order) => {
            const status = order.status.toLowerCase();
            return status === "completed" || status === "cancelled";
          });
          
          const current = ordersArray.filter((order) => {
            const status = order.status.toLowerCase();
            return status !== "completed" && status !== "cancelled";
          });
          
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
    {/*Cover the whole screen in div so that the columns can be separated*/}
      {/*Displays when enlarged screen*/}
      <Sidebar />  {/* Render the Sidebar */}
      {/*This one covers the right part so that the nav wont overlap */}
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
      <Header /> {/* Render the Header */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
          
          {/*First column */}
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
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
                <BreadcrumbPage>Orders</BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            {/*First row of the first column*/}
                <Card className="p-4 md:gap-2">
                  <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Orders</CardTitle>
                    <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">

              </div>
              </div>
                  </CardHeader>
                    <CardContent>
                  <Card x-chunk="dashboard-05-chunk-3" className="mt-4 ml-6 p-4 bg-gray-50">
                  <CardHeader className="px-7">
                    <CardTitle>Current Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead className="hidden sm:table-cell">Arrangement</TableHead>
                          <TableHead className="hidden sm:table-cell">Arrangement Type</TableHead>
                          <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                          <TableHead className="hidden md:table-cell">Order Date</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {(currentOrders.slice(0, rowsToShow)).map((item) => (
                        <TableRow key={item.order_id} className="bg-accent">
                          <TableCell>
                            <div className="font-medium">{item.order_id}</div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{item.arrangement_name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.type_name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.ord_qty}</TableCell>
                          <TableCell className="hidden sm:table-cell">{formatDate(item.ord_date)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                          <Popover
                            open={openPopovers[item.order_id] || false}
                            onOpenChange={(isOpen) => togglePopover(item.order_id, isOpen)}
                          >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-[150px] justify-between"
                                >
                                  {item.status}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandList>
                                    <CommandGroup>
                                      {frameworks.map((framework) => (
                                        <CommandItem
                                          key={framework.value}
                                          onSelect={() => {
                                            {handleStatusChange(item.order_id,  framework.value);}
                                          }}
                                        >
                                          {framework.label}
                                          <CheckIcon
                                            className={`ml-auto h-4 w-4 ${item.status === framework.value ? "opacity-100" : "opacity-0"}`}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(item.completion_date)}</TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <Button asChild size="sm" className="ml-auto gap-1" variant="ghost">
                    <Link to="/admin/current-orders">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
                </Card>
                      <Card x-chunk="dashboard-05-chunk-3" className="mt-6 ml-6 p-4 bg-gray-50">
                        <CardHeader className="px-7">
                          <CardTitle>Recent Orders</CardTitle>
                          <CardDescription>
                            Recent orders from your store.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead className="hidden sm:table-cell">Arrangement</TableHead>
                                <TableHead className="hidden sm:table-cell">Arrangement Type</TableHead>
                                <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                <TableHead className="hidden md:table-cell">Order Date</TableHead>
                                <TableHead className="hidden md:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                            {(completedOrders.slice(0, rowsToShow)).map((item) => (
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
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                          <Button asChild size="sm" className="ml-auto gap-1" variant="ghost">
                            <Link to="/admin/completed-orders">
                              View All
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </CardContent>
                </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;