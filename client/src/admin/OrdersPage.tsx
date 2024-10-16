import React, { useState } from "react";
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

import { Calendar } from "@/components/ui/calendar"

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

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

  interface DataItem {
    id: string;
    arrangement: string;
    qty: number;
    ordDate: string;
    amount: number;
    status: string;
    deliveryDate: string;
  }

const OrdersPage: React.FC = () =>  {
  // State for current and completed orders
  const [currentOrders, setCurrentOrders] = useState<DataItem[]>([
    { id: "OR0001", arrangement: "bouquet", qty: 4, ordDate: "2024-03-9", amount: 1800, status: "Pending", deliveryDate: "2024-03-11" },
    { id: "OR0002", arrangement: "Vase", qty: 2, ordDate: "2024-03-10", amount: 1200, status: "For Delivery", deliveryDate: "2024-03-12" },
    // Add more current orders as needed
  ]);

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});
  const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);

  // Function to handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    const order = currentOrders.find((order) => order.id === id); // Find the order in the current orders list
    if (order && newStatus === "Completed") { // Remove the order from current orders
      setCurrentOrders(currentOrders.filter((o) => o.id !== id));  // Update the status and add it to completed orders
      setCompletedOrders([...completedOrders, { ...order, status: newStatus }]);
    }
    setCurrentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    setOpenPopovers((prevState) => ({ ...prevState, [id]: false }));
  };

  const togglePopover = (id: string, isOpen: boolean) => {
    setOpenPopovers((prevState) => ({ ...prevState, [id]: isOpen }));
  };

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
    {/*Cover the whole screen in div so that the columns can be separated*/}
      {/*Displays when enlarged screen*/}
      <Sidebar />  {/* Render the Sidebar */}
      {/*This one covers the right part so that the nav wont overlap */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header /> {/* Render the Header */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          
          {/*First column */}
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
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
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
                >
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
              
                <Card className="p-4 md:gap-2">
                  <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Orders</CardTitle>
                    <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                          onSelect={setDate}
                          className="rounded-md border shadow"
                          initialFocus
                        />       
                </PopoverContent>
              </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        All time
                      </span>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Show by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      This Week
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>This Month</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      This Year
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                          <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                          <TableHead className="hidden md:table-cell">Order Date</TableHead>
                          <TableHead className="hidden md:table-cell">Amount</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {currentOrders.map((item) => (
                        <TableRow key={item.id} className="bg-accent">
                          <TableCell>
                            <div className="font-medium">{item.id}</div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{item.arrangement}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.qty}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.ordDate}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.amount}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                          <Popover
                            open={openPopovers[item.id] || false}
                            onOpenChange={(isOpen) => togglePopover(item.id, isOpen)}
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
                                            {handleStatusChange(item.id,  framework.value);}
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
                          <TableCell className="hidden md:table-cell">{item.deliveryDate}</TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong> products
                  </div>
                    <div>
                      <Link to="/admin/current-orders">
                      <Button size="sm" className="ml-auto gap-1">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button></Link>
                    </div>
                </CardFooter>
                </Card>
                      <Card x-chunk="dashboard-05-chunk-3" className="mt-6 ml-6 p-4 bg-gray-50">
                        <CardHeader className="px-7">
                          <CardTitle>Completed Orders</CardTitle>
                          <CardDescription>
                            Completed orders from your store.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead className="hidden sm:table-cell">Arrangement</TableHead>
                                <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                <TableHead className="hidden md:table-cell">Order Date</TableHead>
                                <TableHead className="hidden md:table-cell">Amount</TableHead>
                                <TableHead className="hidden md:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                            {completedOrders.map((item) => (
                              <TableRow key={item.id} className="bg-accent">
                                <TableCell>
                                  <div className="font-medium">{item.id}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{item.arrangement}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.qty}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.ordDate}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.amount}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.status}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.deliveryDate}</TableCell>
                              </TableRow>
                            ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          Showing <strong>1-10</strong> of <strong>32</strong> products
                        </div>
                          <div>
                            <Link to="/admin/completed-orders">
                            <Button size="sm" className="ml-auto gap-1">
                              View All
                              <ArrowRight className="h-4 w-4" />
                            </Button></Link>
                          </div>
                      </CardFooter>
                      </Card>
                    </CardContent>
                </Card>
          </div>
          <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order Oe31b70H
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">Billing Information</div>
                    <div className="text-muted-foreground">
                      Same as shipping address
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>Liam Johnson</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">liam@acme.com</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Payment Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;