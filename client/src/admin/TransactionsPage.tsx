import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Progress } from "@/components/ui/progress"

type DataItem = {
  transaction_id: string;
  date: string;
  reference_id: string;
  order_id: string;
  registered_customer_id: string;
  rec_name: string;
  address: string;
  total: number;
};

type MonthlyRevenue = {
  total_sales: number;
}

type WeeklyRevenue = {
  weekly_sales: number;
}

const Transactions: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transactions/', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        const transactions = Array.isArray(result) ? result : result.transactions;
        setData(transactions);
        setFilteredData(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
    fetchTransactions();
  }, []);

// Sorting by date from most recent to oldest
const sortByMostRecent = () => {
  const sortedData = [...filteredData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  setFilteredData(sortedData);
};

// Sorting by date from oldest to most recent
const sortByOldest = () => {
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  setFilteredData(sortedData);
};

  // Filter function to apply based on date range
  const filterData = (startDate: Date) => {
    const filtered = data.filter((item) => new Date(item.date) >= startDate);
    setFilteredData(filtered);
  };

  // Apply single date filter when calendar date is selected
  useEffect(() => {
    if (date) {
      const filtered = data.filter((item) => new Date(item.date).toDateString() === date.toDateString());
      setFilteredData(filtered);
    }
  }, [date, data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

// Fetch the revenue data
const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue[]>([]);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function getMonthlyRevenue() {
    try {
      const monthlyRevenue = await fetchMonthlyRevenue();
      setMonthlyRevenue(monthlyRevenue);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      setError('Error fetching revenue.');
    }
  }

  getMonthlyRevenue();
})

async function fetchMonthlyRevenue() {
  try {
    const response = await fetch('/api/transactions/revenue/month', {
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

useEffect(() => {
  async function getWeeklyRevenue() {
    try {
      const weeklyRevenue = await fetchWeeklyRevenue();
      setWeeklyRevenue(weeklyRevenue);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      setError('Error fetching revenue.');
    }
  }

  getWeeklyRevenue();
})

async function fetchWeeklyRevenue() {
  try {
    const response = await fetch('/api/transactions/revenue/week', {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-2">
          <div className="flex items-start gap-4 md:gap-8">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/admin/dashboard">Dashboard</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Transactions</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">
                  {(weeklyRevenue.map((revenue) => (
                      <div className="text-2xl font-bold">{formatCurrency(revenue.weekly_sales)}</div>
                    )))}
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  <Progress value={0} aria-label="0% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">
                  {(monthlyRevenue.map((revenue) => (
                      <div className="text-2xl font-bold">{formatCurrency(revenue.total_sales)}</div>
                    )))}
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  <Progress value={0} aria-label="0% increase" />
                </CardFooter>
              </Card>
            </div>
          <div className="">
            <Card className="mt-4 bg-gray-50">
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Transactions</CardTitle>
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
                      <TableHead>Receiver Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.transaction_id} className="hover:bg-gray-100">
                        <TableCell className="font-medium">{item.transaction_id}</TableCell>
                        <TableCell className="font-semibold">{formatDate(item.date)}</TableCell>
                        <TableCell>{item.reference_id}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.order_id}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.registered_customer_id}</TableCell>
                        <TableCell>{item.rec_name}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.total}</TableCell>
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
  );
};

export default Transactions;
