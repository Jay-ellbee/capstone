// src/admin/TransactionsPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  ArrowDown,
  ArrowRight,
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
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

const Sales: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header /> {/* Render the Header */}
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
                  <BreadcrumbPage>Sales</BreadcrumbPage>
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
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
              {/*First row of the first column*/}


              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 justify-between">
                  <h1 className="font-semibold">Overview</h1>
              </div>
              {/*Second row of the first column*/}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 justify-between">
                <Card
                  className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
                  >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/admin/transactions">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardFooter>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                  <CardFooter><Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/admin/transactions">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardFooter>
                </Card>
                <Card className="sm:col-span-1" x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      
                    </CardContent>
                  </Card>
              </div>
              {/*Third row of the first column*/}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <Card className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>January - December 2024</CardDescription>
                </CardHeader>
                <CardContent>
                 
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/admin/sales">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
                  <Card x-chunk="dashboard-01-chunk-2">
                      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calendar</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center">
                      <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border shadow"
                        />
                        </CardContent>
                    </Card>
              </div>            
              </div>
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                <Card
                  className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
                  >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Suggested Products
                    </CardTitle>
                    
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center items-center overflow-hidden">
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                  </CardContent>
                  <CardFooter><Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/admin/inventory">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  </CardFooter>
                </Card>
                </div>
              </div>
          </main>
        </div>
    </div>
  )}

export default Sales;
