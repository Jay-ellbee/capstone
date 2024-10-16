// src/admin/TransactionsPage.tsx
import React from "react";
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

interface DataItemReg {
  id: string;
  name: string;
  address: string;
  city: string;
  contact: string;
}

const data: DataItemReg[] = [
  { id: "RDU0001", name: "Juan Dela Cruz", address: "#423 Saklolo St.", city: "Pasay City", contact: "09764536434" },
  { id: "RDU0002", name: "Bongbong Martes", address: "#543 Iran St.", city: "Caloocan City", contact: "+639454536435" },
  { id: "RDU0003", name: "Risa Hontiverus", address: "#27 De Jesus", city: "Taguig City", contact: "+639604351205" },
  { id: "RDU0004", name: "Risa Hontiverus", address: "#27 De Jesus", city: "Taguig City", contact: "+639604351205"},
  { id: "RDU0005", name: "Bongbong Martes", address: "#543 Iran St.", city: "Caloocan City", contact: "+639454536435" },
  { id: "RDU0006", name: "Juan Dela Cruz", address: "#423 Saklolo St.", city: "Pasay City", contact: "09764536434" },
];

const Customers: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
            </div>
        <div className="p-4">       
              <Card x-chunk="dashboard-06-chunk-0" className="mt-4 ml-6 p-4 bg-gray-50">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Customers</CardTitle>
                  <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 text-sm"
                            >
                              <ListFilter className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only">Filter</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                              Bouquet
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                              Funeral
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                              Entourage
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                <EllipsisVertical className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                   </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>City / Town</TableHead>
                        <TableHead >Contact No.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-100">
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell className="font-bold">{item.name}</TableCell>
                          <TableCell>{item.address}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.city}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.contact}</TableCell>
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
                    </div>
                </CardFooter>
              </Card>
          </div>
        </main>
      </div>
  </div>
  )}

export default Customers;
