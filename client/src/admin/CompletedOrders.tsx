// src/admin/TransactionsPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  File,
  ListFilter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

{/*Use the logic but use the shadcn design hehe */}

interface DataItem {
    id: string;
    arrangement: string;
    qty: number;
    ordDate: string;
    amount: number;
    status: string;
    deliveryDate: string;
}

const CompletedOrdersPage: React.FC = () => {
    const [currentOrders, setCurrentOrders] = useState<DataItem[]>([
        { id: "OR0001", arrangement: "bouquet", qty: 4, ordDate: "2024-03-9", amount: 1800, status: "Pending", deliveryDate: "2024-03-11" },
        { id: "OR0002", arrangement: "Vase", qty: 2, ordDate: "2024-03-10", amount: 1200, status: "For Delivery", deliveryDate: "2024-03-12" },
        // Add more current orders as needed
      ]);
      const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);

      return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
              </div>
            </div>
          <div className="p-4">
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
                      </CardFooter>
                      </Card>
          </div>
        </main>
      </div>
  </div>
  )}

export default CompletedOrdersPage;
