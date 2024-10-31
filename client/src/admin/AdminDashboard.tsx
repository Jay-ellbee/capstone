// src/admin/TransactionsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CheckIcon,
  CreditCard,
  DollarSign,
  ListFilter,
  ArrowRight,
  EllipsisVertical,
  PhilippinePeso,
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

import { ScrollArea } from "@/components/ui/scroll-area"
import { set } from "date-fns";


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
  ord_qty: number;
  ord_date: string;
  status: string;
  completion_date: string;
}

type Revenue = {
  Revenue: number;
}

type Customers = {
  customers: number;
}

type ProdAnalysis = {
  Flowers: number;
  Fillers: number;
  Leaves: number;
}

const chartConfigProd = {
  flowers: {
    label: "Flowers",
    color: "hsl(var(--chart-1))",
  },
  fillers: {
    label: "Fillers",
    color: "hsl(var(--chart-2))",
  },
  leaves: {
    label: "Leaves",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type MatAnalysis = {
  Cellophane: number;
  Tissue: number;
  Sinamay: number;
  Kraft: number;
  Item: number;
  Taupe: number;
  Nylon: number;
  Fabric: number;
  Silk: number;
  Mesh: number;
}

const chartConfigMat = {
  cellophane: {
    label: "Cellophane",
    color: "hsl(var(--chart-1))",
  },
  tissue: {
    label: "Tissue",
    color: "hsl(var(--chart-2))",
  },
  sinamay: {
    label: "Sinamay",
    color: "hsl(var(--chart-3))",
  },
  kraft: {
    label: "Kraft",
    color: "hsl(var(--chart-4))",
  },
  item: {
    label: "Item",
    color: "hsl(var(--chart-5))",
  },
  taupe: {
    label: "Taupe",
    color: "hsl(var(--chart-6))",
  },
  nylon: {
    label: "Nylon",
    color: "hsl(var(--chart-7))",
  },
  fabric: {
    label: "Fabric",
    color: "hsl(var(--chart-8))",
  },
  silk: {
    label: "Silk",
    color: "hsl(var(--chart-9))",
  },
  mesh: {
    label: "Mesh",
    color: "hsl(var(--chart-10))",
  }
} satisfies ChartConfig

type ArrAnalysis = {
  Bouquet: number;
  Funeral: number;
  Entourage: number;
  "Bridal Bouquet": number;
  "Funeral Basket": number;
}

const chartConfigArr = {
  bouquet: {
    label: "Bouquet",
    color: "hsl(var(--chart-1))",
  },
  funeral: {
    label: "Funeral",
    color: "hsl(var(--chart-2))",
  },
  entourage: {
    label: "Entourage",
    color: "hsl(var(--chart-3))",
  },
  "bridal_bouquet": {
    label: "Bridal Bouquet",
    color: "hsl(var(--chart-4))",
  },
  "funeral_basket": {
    label: "Funeral Basket",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

type SalesAnalysis = {
  January: number;
  February: number;
  March: number; 
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number; 
  December: number;
}

const chartConfig1 = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const Dashboard: React.FC = () => {
  // const totalVisitors = React.useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  // }, [])

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const [currentOrders, setCurrentOrders] = useState<DataItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rowsToShow = 10;

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});
  
  // FETCHING ORDERS
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
// END OF ORDERS

  // FETCHING OF REVENUE
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  useEffect(() => {
    async function getRevenue() {
      try {
        const revenue = await fetchRevenue();
        setRevenue(revenue);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        setError('Error fetching revenue.');
      }
    }

    getRevenue();
  })

  async function fetchRevenue() {
    try {
      const response = await fetch('/api/dashboard/revenue', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching revenue:', error);
      setError('Error fetching revenue.');
      return null;
  }
}

function formatCurrency(value: number | string): string {
  if (typeof value !== 'number') {
    value = parseFloat(value);
  }

  if (isNaN(value)) return 'Invalid number';

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'PHP', // Change 'USD' to any other currency code if needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// FETCHING OF CUSTOMERS
const [customers, setCustomers] = useState<Customers[]>([]);
useEffect(() => {
  async function getCustomers() {
    try {
      const customers = await fetchCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Error fetching customers.');
    }
  }

  getCustomers();
})

async function fetchCustomers() {
  try {
    const response = await fetch('/api/dashboard/customers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok: ' + response.statusText);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching customers:', error);
  setError('Error fetching customers.');
  return null;
}
}

// FETCHING OF Product Analysis
const [prodAnalysisData, setProdAnalysisData] = useState<ProdAnalysis[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    async function fetchProdAnalysis() {
      try {
        const response = await fetch('/api/dashboard/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: ProdAnalysis[] = await response.json();
        setProdAnalysisData(data);
      } catch (error) {
        console.error('Error fetching production analysis data:', error);
      }
    }
  
    fetchProdAnalysis();
  }, []);

  const chartData = React.useMemo(() => {
    // Ensure prodAnalysisData has at least one item
    if (prodAnalysisData.length === 0) return [];
  
    // Take the first object in the array for transformation
    const [data] = prodAnalysisData;
  
    const transformedData = [
      { name: "Flowers", value: data.Flowers, fill: "var(--color-flowers)" },
      { name: "Fillers", value: data.Fillers, fill: "var(--color-fillers)" },
      { name: "Leaves", value: data.Leaves, fill: "var(--color-leaves)" },
    ];
  
    console.log("Transformed Chart Data:", transformedData); // Debugging transformed data
    return transformedData;
  }, [prodAnalysisData]);
  
  // Calculate the total products
  const totalProducts = chartData.reduce((acc, item) => acc + (item.value || 0), 0);


  // FETCHING OF MATERIALS ANALYSIS
  const [matAnalysisData, setMatAnalysisData] = useState<MatAnalysis[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    async function fetchMatAnalysis() {
      try {
        const response = await fetch('/api/dashboard/materials');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: MatAnalysis[] = await response.json();
        setMatAnalysisData(data);
      } catch (error) {
        console.error('Error fetching production analysis data:', error);
      }
    }
  
    fetchMatAnalysis();
  }, []);

  const chartData2 = React.useMemo(() => {
    // Ensure matAnalysisData has at least one item
    if (matAnalysisData.length === 0) return [];
  
    // Take the first object in the array for transformation  
    const [data] = matAnalysisData;
  
    const transformedData = [
      { name: "Cellophane", value: data.Cellophane, fill: "var(--color-cellophane)" },
      { name: "Tissue", value: data.Tissue, fill: "var(--color-tissue)" },
      { name: "Sinamay", value: data.Sinamay, fill: "var(--color-sinamay)" },
      { name: "Kraft", value: data.Kraft, fill: "var(--color-kraft)" },
      { name: "Item", value: data.Item, fill: "var(--color-paper)" },
      { name: "Taupe", value: data.Taupe, fill: "var(--color-taupe)" },
      { name: "Nylon", value: data.Nylon, fill: "var(--color-nylon)" },
      { name: "Fabric", value: data.Fabric, fill: "var(--color-fabric)" },
      { name: "Silk", value: data.Silk, fill: "var(--color-silk)" },
      { name: "Mesh", value: data.Mesh, fill: "var(--color-mesh)" },
    ];
  
    console.log("Transformed Chart Data:", transformedData); // Debugging transformed data
    return transformedData;
  }, [matAnalysisData]);

  // Calculate the total materials
  const totalMaterials = chartData2.reduce((acc, item) => acc + (item.value || 0), 0);
  
// FETCHING OF ARRANGEMENTS ANALYSIS
const [arrAnalysisData, setArrAnalysisData] = useState<ArrAnalysis[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    async function fetchArrAnalysis() {
      try {
        const response = await fetch('/api/dashboard/arrangements');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: ArrAnalysis[] = await response.json();
        setArrAnalysisData(data);
      } catch (error) {
        console.error('Error fetching production analysis data:', error);
      }
    }
  
    fetchArrAnalysis();
  }, []);

  const chartData3 = React.useMemo(() => {
    // Ensure arrAnalysisData has at least one item
    if (arrAnalysisData.length === 0) return [];
  
    // Take the first object in the array for transformation
    const [data] = arrAnalysisData;
  
    const transformedData = [
      {name: "Bouquet", value: data.Bouquet, fill: "var(--color-bouquet)"},
      {name: "Funeral", value: data.Funeral, fill: "var(--color-funeral)"},
      {name: "Entourage", value: data.Entourage, fill: "var(--color-entourage)"},
      {name: "Bridal Bouquet", value: data["Bridal Bouquet"], fill: "var(--color-bridal)"},
      {name: "Funeral Basket", value: data["Funeral Basket"], fill: "var(--color-funeral-basket)"}
    ]

    console.log("Transformed Chart Data:", transformedData); // Debugging transformed data
    return transformedData;
  }, [arrAnalysisData]);

  // Calculate the total arrangements
  const totalArrangements = chartData3.reduce((acc, item) => acc + (item.value || 0), 0);

// FETCHING OF SALES ANALYSIS
const [salesAnalysisData, setSalesAnalysisData] = useState<SalesAnalysis[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    async function fetchSalesAnalysis() {
      try {
        const response = await fetch('/api/dashboard/sales');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: SalesAnalysis[] = await response.json();
        setSalesAnalysisData(data);
      } catch (error) {
        console.error('Error fetching production analysis data:', error);
      }
    }
  
    fetchSalesAnalysis();
  }, []);

  const chartData1 = React.useMemo(() => {  
    if (salesAnalysisData.length === 0) return [];
  
    // Take the first object in the array for transformation
    const [data] = salesAnalysisData;
  
    const transformedData = [
      { month: "January", sales: data.January},
      { month: "February", sales: data.February},
      { month: "March", sales: data.March},
      { month: "April", sales: data.April},
      { month: "May", sales: data.May},
      { month: "June", sales: data.June},
      { month: "July", sales: data.July},
      { month: "August", sales: data.August},
      { month: "September", sales: data.September},
      { month: "October", sales: data.October},
      { month: "November", sales: data.November},
      { month: "December", sales: data.December},
    ];
  
    console.log("Transformed Chart Data:", transformedData); // Debugging transformed data
    return transformedData;
  }, [salesAnalysisData]);

  // Calculate the total sales
  const totalSales = chartData1.reduce((acc, item) => acc + (item.sales || 0), 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/*Config ng wide screen na navigation */}
      <Sidebar />  {/* Render the Sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
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
                    <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {(revenue.map((revenue) => (
                      <div className="text-2xl font-bold">{formatCurrency(revenue.Revenue)}</div>
                    )))}
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2" x-chunk="dashboard-01-chunk-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {(customers.map((customer) => (
                      <div className="text-2xl font-bold">{customer.customers}</div>
                    )))}
                  </CardContent>
                </Card>
              </div>
              {/*Third row of the first column*/}
              <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-between">
              <Card className="sm:col-span-1" x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfigProd}
                        className=" mr-0 ml-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
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
                                        {totalProducts.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                      >
                                        Products
                                      </tspan>
                                    </text>
                                  );
                                }
                                return null;
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="sm:col-span-1" x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfigMat}
                        className=" mr-0 ml-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData2}
                            dataKey="value"
                            nameKey="name"
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
                                        {totalMaterials.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                      >
                                        Materials
                                      </tspan>
                                    </text>
                                  )
                                }
                                return null;
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="sm:col-span-1" x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Arrangements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfigArr}
                        className=" mr-0 ml-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData3}
                            dataKey="value"
                            nameKey="name"
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
                                        {totalArrangements.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                      >
                                        Arrangements
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
              {/*Fourth row of the first column*/}
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
                  <Button asChild size="sm" className="ml-auto gap-1" variant="ghost">
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
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead className="hidden sm:table-cell">Arrangement</TableHead>
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
                    <ScrollArea className="h-80 w-auto rounded-md border">
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      <div className="flex flex-col space-y-3 mb-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      </div>
                      </ScrollArea>
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
