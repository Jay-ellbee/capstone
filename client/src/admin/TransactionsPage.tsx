// src/admin/TransactionsPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ListFilter,
  ArrowDown,
  EllipsisVertical
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

interface DataItem {
  id: string;
  date: string;
  ref_id: string;
  order_id: string;
  reg_cus_id: string;
  timestamp: string;
  rec_name: string;
  address: string;
}

const data: DataItem[] = [
  { id: "TR00001", date: "2023-08-01 10:00:00", ref_id: "1001", order_id: "OR00001, OR00002, OR00003, OR00001, OR00002, OR00003, OR00001, OR00002, OR00003, OR00001, OR00002, OR00003, OR00001, OR00002, OR00003, OR00001, OR00002, OR00003", reg_cus_id: "RDU00001", timestamp: "2023-08-01 10:15:00", rec_name: "John Doe", address: "123 Flower St, Sta. Cruz, Manila" },
];

const Transactions: React.FC = () => {
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
                  <BreadcrumbPage>Transactions</BreadcrumbPage>
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
                  <CardTitle>Transactions</CardTitle>
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
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Registered Customer ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Receiver Name</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-100">
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell className="font-bold">{item.date}</TableCell>
                          <TableCell>{item.ref_id}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.order_id}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.reg_cus_id}</TableCell>
                          <TableCell>{item.timestamp}</TableCell>
                          <TableCell>{item.rec_name}</TableCell>
                          <TableCell>{item.address}</TableCell>
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

export default Transactions;
