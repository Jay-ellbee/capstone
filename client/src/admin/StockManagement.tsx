import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ArrowRight, BadgeCheck, CalendarIcon, Circle, CircleAlert, CirclePlusIcon, Pencil, PlusCircle, Trash, TriangleAlert } from "lucide-react";
import { PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type Product = {
  product_id: string;
  buying_price_per_bundle: number;
  bundle_count: number;
  pc_per_bundle: number;
  selling_price_per_bundle: number;
  price_per_pc: number;
  stock_qty: number;
  expiration_date: string;
  shelf_life: number;
};

type ProductsItem = {
  product_id: string;
  prod_name: string;
  variant_name: string;
  var_color: string;
  prod_type: string;
}

type Batch = {
  batch_id: string;
  batch_date: string;
  products: Product[];
};

type BatchData = {
  batch_id: string;
  low: number;
  moderate: number;
  high: number;
};

const chartConfig = {
  low: {
    label: "Low Stock",
    color: "hsla(0,72.2%,50.6%,0.7)", // Red
  },
  moderate: {
    label: "Moderate Stock",
    color: "hsla(47.9,95.8%,53.1%,0.7)", // Yellow
  },
  high: {
    label: "High Stock",
    color: "hsla(142.1,70.6%,45.3%,0.7)", // Green
  },
};

const ITEMS_PER_PAGE = 10;

const StockManagement: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>({});
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  const [lowStockBatches, setLowStockBatches] = useState<Batch[]>([]);
  const [moderateStockBatches, setModerateStockBatches] = useState<Batch[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [highStockBatches, setHighStockBatches] = useState<Batch[]>([]);
  const [batchData, setBatchData] = useState<BatchData[]>([]);
  const [productsData, setProductsData] = useState<ProductsItem[]>([]);
  const [batchId, setBatchId] = useState<string>(""); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
  const [rows, setRows] = useState([
    { product: "", 
      buyingPrice: "", 
      bundles: "", 
      stems: "", 
      sellingPrice: "", 
      shelfLife: "" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { 
      product: "", 
      buyingPrice: "", 
      bundles: "", 
      stems: "", 
      sellingPrice: "", 
      shelfLife: "" }]);
  };

  const handleChange = (index: number, field: string, value: string | number) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/batches");
        const data: Batch[] = await response.json();
        setBatches(data);
        console.log(data);

        const lowStock: Batch[] = [];
        const moderateStock: Batch[] = [];
        const highStock: Batch[] = [];
        const transformedData: BatchData[] = data.map((batch) => {
          const lowStockProducts = batch.products.filter((product) => product.stock_qty <= 10);
          const moderateStockProducts = batch.products.filter(
            (product) => product.stock_qty > 10 && product.stock_qty <= 50
          );
          const highStockProducts = batch.products.filter((product) => product.stock_qty > 50);

          if (lowStockProducts.length > 0) {
            lowStock.push({ ...batch, products: lowStockProducts });
          }
          if (moderateStockProducts.length > 0) {
            moderateStock.push({ ...batch, products: moderateStockProducts });
          }
          if (highStockProducts.length > 0) {
            highStock.push({ ...batch, products: highStockProducts });
          }

          return {
            batch_id: batch.batch_id,
            low: lowStockProducts.length,
            moderate: moderateStockProducts.length,
            high: highStockProducts.length,
          };
        });

        setLowStockBatches(lowStock);
        setModerateStockBatches(moderateStock);
        setHighStockBatches(highStock);
        setBatchData(transformedData);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products");
        const products = await response.json();
        setProductsData(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  
  async function fetchProducts() {
    try {
      const response = await fetch('/api/inventory/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const products = await response.json();
      console.log(products);
      return products;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Pagination Logic
  const paginate = (products: Product[], batchId: string) => {
    const currentPage = currentPages[batchId] || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  const handleNext = (batchId: string, products: Product[]) => {
    const maxPage = Math.ceil(products.length / ITEMS_PER_PAGE);
    setCurrentPages((prev) => ({
      ...prev,
      [batchId]: Math.min((prev[batchId] || 1) + 1, maxPage),
    }));
  };

  const handlePrevious = (batchId: string) => {
    setCurrentPages((prev) => ({
      ...prev,
      [batchId]: Math.max((prev[batchId] || 1) - 1, 1),
    }));
  };

  const handleOpenAccordion = (batchId: string) => {
    setOpenAccordion(openAccordion === batchId ? undefined : batchId);
  };

  const handleDateChange = (date: Date | undefined, index: number) => {
    if (date) {
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0]; // Adjust for timezone offset
  
      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === index ? { ...row, shelfLife: formattedDate } : row
        )
      );
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

const handleSubmit = async () => {
  try {
    const payload = {
      batch: { /* Your batch data */ },
      products: rows.map((row) => ({
        product_id: row.product,
        buying_price_per_bundle: parseFloat(row.buyingPrice),
        bundle_count: parseInt(row.bundles, 10),
        pc_per_bundle: parseInt(row.stems, 10),
        selling_price_per_bundle: parseFloat(row.sellingPrice),
        expiration_date: row.shelfLife,
      })),
    };

    console.log("Submitting payload:", payload); // Log payload
    const response = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Batch submitted successfully:", result);

    // Clear rows and close dialog
    setRows([{ product: "", buyingPrice: "", bundles: "", stems: "", sellingPrice: "", shelfLife: "" }]);
    setIsDialogOpen(false); // Close dialog

    // Optional: Show success notification
    alert("Batch created successfully!");
  } catch (error: any) {
    console.error("Failed to submit batch:", error);

    // Show failure alert
    alert(`Failed to create batch: ${error.message || "Unknown error"}`);
  }
};

const handleDelete = async () => {
  if (!batchId.trim()) {
    alert("Batch ID is required.");
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch(`/api/batches/${batchId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete batch: ${response.statusText}`);
    }

    alert(`Batch ${batchId} deleted successfully.`);
    setBatchId(""); // Clear input field
  } catch (error) {
    if (error instanceof Error) {
      alert(`Error deleting batch: ${error.message}`);
    } else {
      alert(`An unexpected error occurred.`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

//Alterations start here

const [isEditing, setIsEditing] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [editableProduct, setEditableProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);

  const handleEditProduct = (product: Product, batchId: string) => {
    setEditableProduct(product); // Set product details
    setCurrentBatchId(batchId); // Set batch ID
    setIsEditing(true); // Open dialog
  };

  const handleEditableChange = (
    field: keyof Product,
    value: string | number | Date | undefined
  ) => {
    setEditableProduct((prev) => {
      if (!prev) return null;
  
      // Handle date formatting for expiration_date specifically
      if (field === "expiration_date" && value instanceof Date) {
        const formattedDate = new Date(
          value.getTime() - value.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]; // Format to 'YYYY-MM-DD'
  
        return {
          ...prev,
          [field]: formattedDate, // Ensure proper field update
        };
      }
  
      // Handle all other field updates
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  

  const handleSaveProduct = async () => {
    if (!editableProduct || !currentBatchId) {
      alert("No product or batch data to save.");
      return;
    }
  
    try {
      const payload = {
        batchId: currentBatchId,
        products: [editableProduct], // Send the updated product as an array
      };
  
      const response = await fetch(`/api/${currentBatchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }
  
      const result = await response.json();
      alert(result.message || "Product updated successfully!");
  
      setIsEditing(false); // Close dialog
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  
  
  
  
const handleCancelClick = () => {
  setEditableProduct(null); // Clear the product state
  setIsEditing(false); // Close the dialog
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (editableProduct) {
      setEditableProduct({
        ...editableProduct,
        [name]: isNaN(Number(value)) ? value : Number(value), // Convert numeric fields
      });
    }
  };



  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="grid col-span-1 auto-rows-max items-start gap-4 md:gap-8 md:col-span-3">
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
                      <BreadcrumbPage>Batch Management</BreadcrumbPage>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {batches.map((batch) => (
                <Card className="px-4">
                <Accordion
                  type="single" // Ensures only one accordion is open at a time
                  collapsible
                  key={batch.batch_id}
                  value={openAccordion} // Controlled by state
                  onValueChange={(value) => setOpenAccordion(value)} // Update the currently open accordion
                >
                  <AccordionItem value={batch.batch_id}>
                    <AccordionTrigger className="flex py-0">
                      {/* Updated CardHeader Layout */}
                      <CardHeader className="flex flex-row items-center justify-between text-lg w-full">
                      <span>{batch.batch_id || "No Batch ID"}</span>
                      <span>{formatDate(batch.batch_date)}</span>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center">Product</TableHead>
                            <TableHead className="text-center">Price Per Piece</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Shelf Life</TableHead>
                            <TableHead className="text-center hidden">Status</TableHead>
                            <TableHead className="text-center hidden">Edit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginate(batch.products, batch.batch_id).map((product) => (
                            <TableRow key={product.product_id}>
                              <TableCell className="text-center">{product.product_id}</TableCell>
                              <TableCell className="text-center">₱{product.price_per_pc}</TableCell>
                              <TableCell className="text-center">{product.stock_qty}</TableCell>
                              <TableCell className="text-center">{product.shelf_life} days</TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`
                                    px-5 rounded-full text-white text-sm font-medium
                                    ${
                                      product.stock_qty > 50
                                        ? "bg-green-500/40" // Green for stock_qty > 50
                                        : product.stock_qty > 10
                                        ? "bg-yellow-400/40" // Yellow for stock_qty between 10 and 50
                                        : "bg-red-600/40" // Red for stock_qty <= 10
                                    }
                                  `}
                                >
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProduct(product, batch.batch_id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <Button
                          variant="ghost"
                          onClick={() => handlePrevious(batch.batch_id)}
                          disabled={currentPages[batch.batch_id] === 1}
                        >
                          Previous
                        </Button>
                        <span>
                          Page {currentPages[batch.batch_id] || 1} of{" "}
                          {Math.ceil(batch.products.length / ITEMS_PER_PAGE)}
                        </span>
                        <Button
                          variant="ghost"
                          onClick={() => handleNext(batch.batch_id, batch.products)}
                          disabled={
                            currentPages[batch.batch_id] ===
                            Math.ceil(batch.products.length / ITEMS_PER_PAGE)
                          }
                        >
                          Next
                        </Button>
                      </CardFooter>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                </Card>
              ))}

              {/*Alterations here*/}
              {/* Edit Product Dialog */}
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent className="sm:max-w-[1000px]">
                      <DialogHeader>
                        <DialogTitle>Edit Product in Batch</DialogTitle>
                      </DialogHeader>
                      {editableProduct ? (
                        <div className="flex flex-col gap-6">
                          <div className="grid grid-cols-7 gap-4 items-center border-b pb-4 mb-4">
                            {/* Product Details */}
                            <div className="col-span-2">
                              <Label className="text-left">Product:</Label>
                              <select
                                value={editableProduct.product_id}
                                disabled
                                className="border rounded-md p-2 w-full"
                              >
                                <option value={editableProduct.product_id}>
                                  {`${editableProduct.product_id} - Pre-selected`}
                                </option>
                              </select>
                            </div>

                            {/* Numeric Inputs */}
                            <div>
                              <Label className="text-left">Buying Price:</Label>
                              <Input
                                type="number"
                                value={editableProduct.buying_price_per_bundle}
                                onChange={(e) =>
                                  handleEditableChange("buying_price_per_bundle", parseFloat(e.target.value))
                                }
                                placeholder="Buying Price"
                                className="border rounded-md p-2 w-full"
                              />
                            </div>
                            <div>
                              <Label className="text-left">Bundle Count:</Label>
                              <Input
                                type="number"
                                value={editableProduct.bundle_count}
                                onChange={(e) =>
                                  handleEditableChange("bundle_count", parseInt(e.target.value, 10))
                                }
                                placeholder="Bundles"
                                className="border rounded-md p-2 w-full"
                              />
                            </div>
                            <div>
                              <Label className="text-left">Stems per Bundle:</Label>
                              <Input
                                type="number"
                                value={editableProduct.pc_per_bundle}
                                onChange={(e) =>
                                  handleEditableChange("pc_per_bundle", parseInt(e.target.value, 10))
                                }
                                placeholder="Stems"
                                className="border rounded-md p-2 w-full"
                              />
                            </div>
                            <div>
                              <Label className="text-left">Selling Price:</Label>
                              <Input
                                type="number"
                                value={editableProduct.selling_price_per_bundle}
                                onChange={(e) =>
                                  handleEditableChange("selling_price_per_bundle", parseFloat(e.target.value))
                                }
                                placeholder="Selling Price"
                                className="border rounded-md p-2 w-full"
                              />
                            </div>

                            {/* Calendar for Shelf Life */}
                            <div className="col-span-1">
                              <Label className="text-left">Shelf Life:</Label>
                              <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="col-span-2 pl-3 text-left font-normal"
                                >
                                  {editableProduct.expiration_date
                                    ? format(new Date(editableProduct.expiration_date), "yyyy-MM-dd")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-2 h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                                <PopoverContent align="start">
                                <Calendar
                                  mode="single"
                                  selected={
                                    editableProduct.expiration_date
                                      ? new Date(editableProduct.expiration_date)
                                      : undefined
                                  }
                                  onSelect={(date) => handleEditableChange("expiration_date", date || undefined)}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>Loading product details...</p>
                      )}

                      {/* Save and Cancel Buttons */}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProduct} className="w-full bg-green-600 text-white">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>



            </div>
            <div className="grid col-span-1 auto-rows-max items-start gap-4 md:col-span-2 pt-2">
            <div className="ml-auto flex items-center gap-2">
                      {/*Batch removal Modal */}
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Batch
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Remove Batch</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="batchId" className="text-right">
                              Batch ID:
                            </Label>
                            <Input
                              id="batchId"
                              placeholder="Enter Batch ID"
                              value={batchId}
                              onChange={(e) => setBatchId(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                disabled={!batchId.trim() || isSubmitting}
                              >
                                {isSubmitting ? "Deleting..." : "Delete"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to remove this batch?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the batch
                                  and all associated data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction
                                  onClick={() => handleDelete()} // Only delete after confirmation
                                >
                                  Confirm
                                </AlertDialogAction>
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

                      {/*Add Batch Modal */}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[1000px]">
                        <DialogHeader>
                          <DialogTitle>Add New Batch</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-6">
                          {rows.map((row, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-7 gap-4 items-center border-b pb-4 mb-4"
                            >
                              {/* Dropdown for product */}
                              <div className="col-span-2">
                                <Label className="text-left">Product:</Label>
                                <select
                                  value={row.product}
                                  onChange={(e) => handleChange(index, "product", e.target.value)}
                                  className="border rounded-md p-2 w-full"
                                >
                                  <option value="">Select Product</option>
                                  {productsData.map((product) => (
                                    <option
                                      key={product.product_id}
                                      value={product.product_id}
                                    >
                                      {`${product.product_id} - ${product.prod_name} ${product.variant_name} ${product.var_color}`}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Numeric Inputs */}
                              <div>
                                <Label className="text-left">Buying Price:</Label>
                                <Input
                                  type="number"
                                  value={row.buyingPrice}
                                  onChange={(e) => handleChange(index, "buyingPrice", e.target.value)}
                                  placeholder="Buying Price"
                                  className="border rounded-md p-2 w-full"
                                />
                              </div>
                              <div>
                                <Label className="text-left">Bundle Count:</Label>
                                <Input
                                  type="number"
                                  value={row.bundles}
                                  onChange={(e) => handleChange(index, "bundles", e.target.value)}
                                  placeholder="Bundles"
                                  className="border rounded-md p-2 w-full"
                                />
                              </div>
                              <div>
                                <Label className="text-left">Stems per Bundle:</Label>
                                <Input
                                  type="number"
                                  value={row.stems}
                                  onChange={(e) => handleChange(index, "stems", e.target.value)}
                                  placeholder="Stems"
                                  className="border rounded-md p-2 w-full"
                                />
                              </div>
                              <div>
                                <Label className="text-left">Selling Price:</Label>
                                <Input
                                  type="number"
                                  value={row.sellingPrice}
                                  onChange={(e) => handleChange(index, "sellingPrice", e.target.value)}
                                  placeholder="Selling Price"
                                  className="border rounded-md p-2 w-full"
                                />
                              </div>

                              {/* Calendar for Shelf Life */}
                              <div className="col-span-1">
                                <Label className="text-left">Shelf Life:</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="col-span-2 pl-3 text-left font-normal"
                                    >
                                      {row.shelfLife || "Pick a date"}
                                      <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent align="start">
                                    <Calendar
                                      mode="single"
                                      selected={row.shelfLife ? new Date(row.shelfLife) : undefined} // Properly handle undefined
                                      onSelect={(date) => handleDateChange(date, index)} // Pass the date to handleDateChange
                                      disabled={(date) => date < new Date("1900-01-01")}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          ))}

                          {/* Add Row Button */}
                          <Button onClick={handleAddRow} variant="ghost" className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Row
                          </Button>
                        </div>

                        {/* Submit Button */}
                        <DialogFooter>
                          <Button onClick={handleSubmit} className="w-full bg-green-600 text-white">
                            Submit Batch
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                  </div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Stock Levels by Batch</CardTitle>
                  <CardDescription>Overview of stock levels per batch</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0">
                  {batchData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {batchData.map((batch) => {
                        const totalStock =
                          batch.low + batch.moderate + batch.high;

                        return (
                          <div key={batch.batch_id} className="flex flex-col items-center">
                            <h4 className="text-center font-semibold">{`Batch ${batch.batch_id}`}</h4>
                            <RadialBarChart
                              data={[batch]}
                              endAngle={180}
                              innerRadius={60}
                              outerRadius={120}
                              width={250}
                              height={200}
                            >
                              <PolarRadiusAxis
                                tick={false}
                                tickLine={false}
                                axisLine={false}
                              />
                              <RadialBar
                                dataKey="low"
                                stackId="a"
                                cornerRadius={5}
                                fill={chartConfig.low.color}
                                className="stroke-transparent stroke-2"
                              />
                              <RadialBar
                                dataKey="moderate"
                                stackId="a"
                                cornerRadius={5}
                                fill={chartConfig.moderate.color}
                                className="stroke-transparent stroke-2"
                              />
                              <RadialBar
                                dataKey="high"
                                stackId="a"
                                cornerRadius={5}
                                fill={chartConfig.high.color}
                                className="stroke-transparent stroke-2"
                              />
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-foreground text-2xl font-bold"
                              >
                                {totalStock}
                              </text>
                            </RadialBarChart>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted">No data available</p>
                  )}
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent>
                <div className="bg-white shadow rounded-lg">
                    {/* Low Stock Accordion */}
                    <Accordion type="single" collapsible className="my-2">
                      <AccordionItem value="low-stock">
                        <AccordionTrigger
                          className="flex bg-red-600/70 text-white px-4 py-2 rounded-t-lg"
                        >
                          <div className="flex items-center">
                            <CircleAlert className="w-8 h-8" />
                          </div>
                          <div className="flex flex-col text-left ml-2 mr-auto">
                            
                              <h1 className="text-lg drop-shadow-md">Low Stock Batches</h1>
                           
                            <div className="text-sm text-muted-foreground">
                              Stock has reached critical levels. Prioritize immediate resupply.
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-red-600/10 border-1 rounded-b-lg border-red-600 h-64 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">Batch ID</TableHead>
                                <TableHead className="text-center">Product ID</TableHead>
                                <TableHead className="text-center">Price per Piece</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {lowStockBatches && lowStockBatches.length > 0 ? (
                                lowStockBatches.map((batch) =>
                                  batch.products.map((product) => (
                                    <TableRow key={`${batch.batch_id}-${product.product_id}`}>
                                      <TableCell className="text-center">{batch.batch_id}</TableCell>
                                      <TableCell className="text-center">{product.product_id}</TableCell>
                                      <TableCell className="text-center">₱{product.price_per_pc.toFixed(2)}</TableCell>
                                      <TableCell className="text-red-600 font-bold text-center">
                                        {product.stock_qty}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No low stock batches.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Moderate Stock Accordion */}
                    <Accordion type="single" collapsible className="my-2">
                      <AccordionItem value="moderate-stock">
                        <AccordionTrigger
                          className="flex bg-yellow-400/70 text-white px-4 py-2"
                        >
                          <div className="flex items-center">
                           <TriangleAlert className="w-8 h-8" />
                           </div>
                           <div className="flex flex-col text-left ml-2 mr-auto">
                            <h1 className="text-lg drop-shadow-md">Moderate Stock Batches</h1>
                            <div className="flex text-sm text-muted-foreground">
                            Supply is stable but should be monitored to maintain optimal levels.
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-yellow-400/10 border-1 rounded-b-lg border-yellow-400 h-64 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">Batch ID</TableHead>
                                <TableHead className="text-center">Product ID</TableHead>
                                <TableHead className="text-center">Price per Piece</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {moderateStockBatches && moderateStockBatches.length > 0 ? (
                                moderateStockBatches.map((batch) =>
                                  batch.products.map((product) => (
                                    <TableRow key={`${batch.batch_id}-${product.product_id}`}>
                                      <TableCell className="text-center">{batch.batch_id}</TableCell>
                                      <TableCell className="text-center">{product.product_id}</TableCell>
                                      <TableCell className="text-center">₱{product.price_per_pc.toFixed(2)}</TableCell>
                                      <TableCell className="text-yellow-600 font-bold text-center">
                                        {product.stock_qty}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No moderate stock batches.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* High Stock Accordion */}
                    <Accordion type="single" collapsible className="my-2">
                      <AccordionItem value="high-stock">
                        <AccordionTrigger
                          className="bg-green-500/70 text-white px-4 py-2 rounded-b-lg"
                        >
                          <div className="flex items-center">
                           <BadgeCheck className="w-8 h-8" />
                           </div>
                           <div className="flex flex-col text-left ml-2 mr-auto">
                            <h1 className="text-lg drop-shadow-md">High Stock Batches</h1>
                            <div className="flex text-sm text-muted-foreground">
                            Sufficient supply available. No immediate action required.
                            </div>
                          </div>
                         
                        </AccordionTrigger>
                        <AccordionContent className="bg-green-500/10 border-1 rounded-b-lg border-green-500 h-64 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">Batch ID</TableHead>
                                <TableHead className="text-center">Product ID</TableHead>
                                <TableHead className="text-center">Price per Piece</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {highStockBatches && highStockBatches.length > 0 ? (
                                highStockBatches.map((batch) =>
                                  batch.products.map((product) => (
                                    <TableRow key={`${batch.batch_id}-${product.product_id}`}>
                                      <TableCell className="text-center">{batch.batch_id}</TableCell>
                                      <TableCell className="text-center">{product.product_id}</TableCell>
                                      <TableCell className="text-center">₱{product.price_per_pc.toFixed(2)}</TableCell>
                                      <TableCell className="text-green-600 font-bold text-center">
                                        {product.stock_qty}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No high stock batches.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockManagement;
