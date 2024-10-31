// src/admin/TransactionsPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ListFilter,
  ArrowDown,
  EllipsisVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

{/*Use the logic but use the shadcn design hehe */}

type Customers = {
  registered_customer_id: string;
  customer_name: string;
  address: string;
  phone: string;
  email: string;
}

const Customers: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [data, setData] = React.useState<Customers[]>([]);

  useEffect(() => {
    async function getCustomers() {
      try {
        const customers = await fetchCustomers();

        const customersArray = Array.isArray(customers) ? customers : customers.customers;

        if (Array.isArray(customersArray)) {
          setData(customersArray);
        } else {
          console.error('Invalid customers data format');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }

    getCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
      <Header /> {/* Render the Header */}
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-2">
        <div className="flex justify-between items-center p-4 pb-0">
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
                  <BreadcrumbPage>Customers</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center ml-auto">
              <div className="ml-auto flex items-center gap-2">
              </div>
            </div>
            </div>
        <div className="p-4">       
              <Card x-chunk="dashboard-06-chunk-0" className="mt-4 ml-6 p-4 bg-gray-50">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.registered_customer_id} className="hover:bg-gray-100">
                          <TableCell className="font-medium">{item.registered_customer_id}</TableCell>
                          <TableCell className="font-bold">{item.customer_name}</TableCell>
                          <TableCell>{item.address}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.phone}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.email}</TableCell>
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

export default Customers;
