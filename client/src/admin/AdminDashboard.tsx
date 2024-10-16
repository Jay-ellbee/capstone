// src/admin/TransactionsPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckIcon,
  CreditCard,
  DollarSign,
  ListFilter,
  ArrowRight,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Calendar } from "@/components/ui/calendar"

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

import { Skeleton } from "@/components/ui/skeleton"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

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

export const description = "A donut chart with text"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export const description1 = "A stacked bar chart with a legend"
const chartData1 = [
  { month: "January", sales: 186},
  { month: "February", sales: 305},
  { month: "March", sales: 237},
  { month: "April", sales: 73},
  { month: "May", sales: 209},
  { month: "June", sales: 444},
  { month: "July", sales: 900},
  { month: "August", sales: 894},
  { month: "September", sales: 614},
  { month: "October", sales: 1114},
  { month: "November", sales: 2124},
  { month: "December", sales: 2014},
]
const chartConfig1 = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const Dashboard: React.FC = () => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const [currentOrders, setCurrentOrders] = useState<DataItem[]>([
    { id: "OR0001", arrangement: "bouquet", qty: 4, ordDate: "2024-03-9", amount: 1800, status: "Pending", deliveryDate: "2024-03-11" },
    { id: "OR0002", arrangement: "Vase", qty: 2, ordDate: "2024-03-10", amount: 1200, status: "For Delivery", deliveryDate: "2024-03-12" },
    // Add more current orders as needed
  ]);

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});
  const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header /> {/* Render the Header */}
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
                    <Link to="/admin/sales">
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
                    <Link to="/admin/customers">
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
                      <ChartContainer
                        config={chartConfig}
                        className=" mr-0 ml-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                      >
                                        {totalVisitors.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                      >
                                        Visitors
                                      </tspan>
                                    </text>
                                  )
                                }
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
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
                  <ChartContainer config={chartConfig1}>
                    <BarChart accessibilityLayer data={chartData1}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="sales"
                        stackId="a"
                        fill="var(--color-desktop)"
                        radius={[0, 0, 4, 4]}
                      />
                     
                    </BarChart>
                  </ChartContainer>
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
              {/*Fourth row of the first column */}              
              <Card x-chunk="dashboard-05-chunk-3" className="mt-4 ml-6 p-4 bg-gray-50">
                  <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Current Orders</CardTitle>
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
                </CardFooter>
                </Card>
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
                    <Link to="/admin/dashboard">
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

export default Dashboard;
