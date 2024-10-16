import { Link } from 'react-router-dom';
import React from "react";
import {
  ArrowDown,
  CalendarIcon,
  Copy,
  FilePenLine,
  ListFilter,
  PlusCircle,
  Trash,
  Maximize2
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Checkbox } from "@/components/ui/checkbox"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Sidebar from '@/components/Sidebar'; // Import the Sidebar
import Header from '@/components/Header';   // Import the Header

export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions."

  interface ProductsItem {
    batch_id: string;
    prod_id: string;
    name: string;
    color: string;
    variant: string;
    prod_type: string;
    stock: string; 
    price_per_qty: number;
    shelf_life: string;
  }

  interface MaterialItem {
    mat_id: string;
    mat_name: string;
    mat_type_id: string;
    color: string;
    stock_qty: number;
  }

  interface ArrangementItem {
    arr_id: string;
    arr_name: string;
    arr_type_id: string;
    prod_id: string;
    price: number;
    desc: string;
    num_rev: number;
    img: string;
    num_sold: number;
  }
  
  const products: ProductsItem[] = [
    { batch_id: "BA0001", prod_id: "PR0001", name: "Rose", color: "Pink", variant: "Ecuadorian", prod_type: "flower", stock:"200", price_per_qty: 350, shelf_life:"3" },
    { batch_id: "BA0002", prod_id: "PR0002", name: "Carnation", color: "Yellow", variant: "N/A", prod_type: "flower", stock:"200", price_per_qty: 350, shelf_life:"5" },
    { batch_id: "BA0003", prod_id: "PR0003", name: "Rose", color: "Red", variant: "China", prod_type: "flower", stock:"50", price_per_qty: 350, shelf_life:"10" },
    { batch_id: "BA0004", prod_id: "PR0004", name: "Carnation", color: "Pink", variant: "N/A", prod_type: "flower", stock:"400", price_per_qty: 350, shelf_life:"15" },
  ];

  const materials: MaterialItem[] = [
    {mat_id: "MA00001", mat_name: "Wrapper", mat_type_id: "MT00001", color: "Yellow", stock_qty: 1},
  ]

  const arrangements: ArrangementItem[] = [
    {arr_id: 'AR00001', arr_name: 'Blush Whispers', arr_type_id: 'AT00001', prod_id: 'PR00001', price: 1500, desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ', num_rev: 1, img: 'https://i.pinimg.com/564x/62/8b/4e/628b4eefdd9da234ff0c3ee86efaa9e2.jpg', num_sold: 0}
  ]
export function Inventory() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
    {/*Config ng wide screen na navigation */}
    <Sidebar />  {/* Render the Sidebar */}
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header /> {/* Render the Header */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                <BreadcrumbPage>Inventory</BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Tabs defaultValue="products">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="arrangements">Arrangements</TabsTrigger>
              </TabsList>
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
            <TabsContent value="products">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Inventory</CardTitle>
                  <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-left">
                                Details
                              </Label>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Product:
                              </Label>
                              <Input id="prod_id" placeholder="Search by product ID or name" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button type="submit">Save</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction>Yes</AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*First row */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-left">
                                Details
                              </Label>
                            </div>
                            {/*Second row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Name:
                              </Label>
                              <Input id="name" placeholder="Enter product name" className="col-span-2" />
                              <Label className="text-left">
                                Color:
                              </Label>
                              <Input id="color" placeholder="Enter color" className="col-span-2" />
                            </div>
                            {/*Third row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                ID:
                              </Label>
                              <Input id="id" placeholder="Enter product id" className="col-span-2" />
                              <Label className="text-left">
                                Stock:
                              </Label>
                              <Input id="stock" placeholder="Enter quantity" className="col-span-2" />
                            </div>
                            {/*Fourth row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Variant:
                              </Label>
                              <Input id="variant" placeholder="Enter product variant" className="col-span-2" />
                              <Label className="text-left">
                                Price:
                              </Label>
                              <Input id="price" placeholder="0.00" className="col-span-2" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardHeader>
                {/*add price per qty and type */}
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Color
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Variant
                        </TableHead>
                        <TableHead>Product Type</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price per Qty</TableHead>
                        <TableHead>Shelf Life (days-hours)</TableHead>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {products.map((item) => (
                      <TableRow key={item.batch_id}>
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.batch_id}
                        </TableCell>
                        <TableCell>
                          {item.prod_id}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.color}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.variant}
                        </TableCell>
                        <TableCell>
                          {item.prod_type}
                        </TableCell>
                        <TableCell>
                          {item.stock}
                        </TableCell>
                        <TableCell>
                          {item.price_per_qty}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.shelf_life}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='materials'>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Inventory</CardTitle>
                  <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-left">
                                Details
                              </Label>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Product:
                              </Label>
                              <Input id="prod_id" placeholder="Search by product ID or name" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button type="submit">Save</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction>Yes</AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*First row */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-left">
                                Details
                              </Label>
                            </div>
                            {/*Second row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Name:
                              </Label>
                              <Input id="name" placeholder="Enter product name" className="col-span-2" />
                              <Label className="text-left">
                                Color:
                              </Label>
                              <Input id="color" placeholder="Enter color" className="col-span-2" />
                            </div>
                            {/*Third row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                ID:
                              </Label>
                              <Input id="id" placeholder="Enter product id" className="col-span-2" />
                              <Label className="text-left">
                                Stock:
                              </Label>
                              <Input id="stock" placeholder="Enter quantity" className="col-span-2" />
                            </div>
                            {/*Fourth row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Variant:
                              </Label>
                              <Input id="variant" placeholder="Enter product variant" className="col-span-2" />
                              <Label className="text-left">
                                Price:
                              </Label>
                              <Input id="price" placeholder="0.00" className="col-span-2" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Material ID</TableHead>
                        <TableHead>Material Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Material Type ID
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Color
                        </TableHead>
                        <TableHead>Stock Quantity</TableHead>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {materials.map((item) => (
                      <TableRow key={item.mat_id}> 
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.mat_id}
                        </TableCell>
                        <TableCell>{item.mat_name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.mat_type_id}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.color}
                        </TableCell>
                        <TableCell>
                          {item.stock_qty}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='arrangements'>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Inventory</CardTitle>
                  <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-left">
                                Details
                              </Label>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Product:
                              </Label>
                              <Input id="prod_id" placeholder="Search by product ID or name" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button type="submit">Save</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete your product from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogAction>Yes</AlertDialogAction>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*First row */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-left">
                                Details
                              </Label>
                            </div>
                            {/*Second row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Name:
                              </Label>
                              <Input id="name" placeholder="Enter product name" className="col-span-2" />
                              <Label className="text-left">
                                Color:
                              </Label>
                              <Input id="color" placeholder="Enter color" className="col-span-2" />
                            </div>
                            {/*Third row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                ID:
                              </Label>
                              <Input id="id" placeholder="Enter product id" className="col-span-2" />
                              <Label className="text-left">
                                Stock:
                              </Label>
                              <Input id="stock" placeholder="Enter quantity" className="col-span-2" />
                            </div>
                            {/*Fourth row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Variant:
                              </Label>
                              <Input id="variant" placeholder="Enter product variant" className="col-span-2" />
                              <Label className="text-left">
                                Price:
                              </Label>
                              <Input id="price" placeholder="0.00" className="col-span-2" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Arrangement ID</TableHead>
                        <TableHead>Arrangement Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Arrangement Type ID
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Product ID
                        </TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Number Reviews</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Number Sold</TableHead>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {arrangements.map((item) => (
                      <TableRow key={item.arr_id}>
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.arr_id}
                        </TableCell>
                        <TableCell>
                          {item.arr_name}
                        </TableCell>
                        <TableCell>{item.arr_type_id}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.prod_id}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.price}
                        </TableCell>
                        <TableCell>
                          {item.desc}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.num_rev}
                        </TableCell>
                        <TableCell className="font-medium">
                        <Dialog>
                          <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 gap-1">
                              <Maximize2 className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <img src={item.img} alt="Product" className="w-full h-auto" onError={() => console.error("Image failed to load: ", item.img)}/>
                            </DialogContent>
                            </Dialog>
                          
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.num_sold}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
