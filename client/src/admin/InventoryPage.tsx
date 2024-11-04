import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
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
  DropdownMenuItem
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
import { format } from 'date-fns';
import { ToastCopyIdButton } from '@/components/ToastCopyId';

  type ProductsItem = {
    batch_id: string;
    product_id: string;
    prod_name: string;
    variant_name: string;
    var_color: string;
    prod_type: string;
    stock_qty: string; 
    price_per_qty: number;
    shelf_life: number;
  }

  type MaterialItem = {
    material_id: string;
    mat_name: string;
    type_name: string;
    color: string;
    stock_qty: number;
  }

  type ArrangementItem = {
    arrangement_id: string;
    arrangement_name: string;
    arrangement_type: string;
    price: number;
    description: string;
    num_reviews: number;
    img_link: string;
    num_sold: number;
  }
  
  const productTypes = ["filler", "flower", "leaves"]
  const materialTypes = [
    {
      label: "Cellophane",
      value: "MT00001"
    },{
      label: "Tissue",
      value: "MT00002"
    },{
      label: "Sinamay",
      value: "MT00003"
    },{
      label: "Kraft",
      value: "MT00004"
    },{
      label: "Item/gift",
      value: "MT00005"
    },{
      label: "Taupe",
      value: "MT00006"
    },{
      label: "Nylon",
      value: "MT00007"
    },{
      label: "Fabric",
      value: "MT00008"  
    },{
      label: "Silk",
      value: "MT00009"
    },{
      label: "Mesh",
      value: "MT00010"
    }
  ]
  const arrangementTypes = [
    {
      label: "Bouquet",
      value: "AT00001"
    },{
      label: "Funeral",
      value: "AT00002"
    },{
      label: "Entourage",
      value: "AT00003"
    },{
      label: "Bridal Bouquet",
      value: "AT00004"
    },{
      label: "Funeral Basket",
      value: "AT00005"
    },
  ]

const Inventory: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [productsData, setProductsData] = useState<ProductsItem[]>([]);
  const [materialsData, setMaterialsData] = useState<MaterialItem[]>([]);
  const [arrangementsData, setArrangementsData] = useState<ArrangementItem[]>([]);
  const [selectedArrangementType, setSelectedArrangementType] = useState<string | null>(null);
  const [selectedMaterialsType, setSelectedMaterialsType] = useState<string | null>(null);
  const [selectedProductsType, setSelectedProductsType] = useState<string | null>(null);
  const [productId, setProductId] = useState("");
  const [productBatchId, setProductBatchId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [arrangementId, setArrangementId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // START OF FETCHING OF PRODUCTS
  useEffect(() => {
    async function getProducts() {
      const products = await fetchProducts();
      if (products) {
        setProductsData(products);
      }
    }
    getProducts();
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
// END OF FETCHING OF PRODUCTS

// START OF DELETING OF PRODUCTS BY ID
const deleteProduct = async (id: string) => {
  try {
    const response = await fetch(`/api/inventory/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    console.log(`Product with ID ${id} deleted successfully`);
    
    // Automatically update products data by filtering out the deleted product
    setProductsData((prevData) => prevData.filter((product) => product.product_id !== id));
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// HANDLE DELETE CONFIRM AND CALL DELETE FUNCTION
const handleDeleteConfirmation = () => {
  if (productId) {  // Assuming productId is the ID of the product you want to delete
    deleteProduct(productId);
  }
};
// END OF DELETING OF PRODUCTS BY ID

// START OF DELETING OF PRODUCTS BY BATCH ID
const deleteProductByBatch = async (id: string) => {
  try {
    const response = await fetch(`/api/inventory/products-batch/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    console.log(`Product with ID ${id} deleted successfully`);
    
    // Automatically update products data by filtering out the deleted product
    setProductsData((prevData) => prevData.filter((product) => product.batch_id !== id));
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// HANDLE DELETE CONFIRM AND CALL DELETE FUNCTION
const handleDeleteByBatchConfirmation = () => {
  if (productBatchId) {  // Assuming productId is the ID of the product you want to delete
    deleteProductByBatch(productBatchId);
  }
};
// END OF DELETING OF PRODUCTS BY BATCH ID

// START ADDING OF PRODUCTS
  const [product, setProduct] = useState({
    prod_name: '',
    prod_type: '',
    variant_name: '',
    var_color: '',
    price_per_qty: 0,
  });

  const [batch, setBatch] = useState({
    stock_qty: 0,
    shelf_life: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Check if the field is part of product or batch and update accordingly
    if (name in product) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    } else if (name in batch) {
      setBatch((prevBatch) => ({
        ...prevBatch,
        [name]: value,
      }));
    }
  };

  const handleSelect = (type: string) => {
    setSelectedType(type)
    setProduct((prev) => ({ ...prev, prod_type: type }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setBatch((prev) => ({ ...prev, shelf_life: format(date, "yyyy-MM-dd") }))
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", { product, batch });

    try {
      const response = await fetch('/api/inventory/add-product-with-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, batch }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product and batch added:', data);
      alert('Product and batch added successfully!');

      // Reset form if needed
      setProduct({ prod_name: '', prod_type: '', variant_name: '', var_color: '', price_per_qty: 0 });
      setBatch({ stock_qty: 0, shelf_life: '' });
    } catch (error) {
      console.error('Failed to add product and batch:', error);
      alert('Failed to add product and batch.');
    }
  };
// END OF ADDING OF PRODUCTS

//  START OF FETCHING OF MATERIALS
  useEffect(() => {
    async function getMaterials() {
      const products = await fetchMaterials();
      if (products) {
        setMaterialsData(products);
      }
    }
    getMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      const response = await fetch('/api/inventory/materials', {
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
  // END OF FETCHING OF MATERIALS

  // START OF DELETING OF MATERIALS
  const deleteMaterial = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete material');
      }
  
      console.log(`Material with ID ${id} deleted successfully`);
      
      // Automatically update products data by filtering out the deleted product
      setMaterialsData((prevData) => prevData.filter((material) => material.material_id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  // HANDLE DELETE CONFIRM AND CALL DELETE FUNCTION
  const handleMaterialDeleteConfirmation = () => {
    if (materialId) {  // Assuming materialId is the ID of the product you want to delete
      deleteMaterial(materialId);
    }
  };
  // END OF DELETING OF MATERIALS

  // START ADDING OF MATERIALS
  const [material, setMaterial] = useState({
    mat_name: '',
    material_type_id: '',
    color: '',
    stock_qty: 0,
  });

  const handleMaterialInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Check if the field is part of product or batch and update accordingly
    if (name in material) {
      setMaterial((prevMaterial) => ({
        ...prevMaterial,
        [name]: value,
      }));
    } 
  };

  const handleMaterialSelect = (type: string) => {
    setSelectedType(type)
    setMaterial((prev) => ({ ...prev, material_type_id: type }))
  }

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", { material });

    try {
      const response = await fetch('/api/inventory/add-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Material added:', data);
      alert('Material added successfully!');

      // Reset form if needed
      setMaterial({ mat_name: '', material_type_id: '', color: '', stock_qty: 0,});
    } catch (error) {
      console.error('Failed to add material:', error);
      alert('Failed to add material.');
    }
  };
  // END OF ADDING OF MATERIALS

  // START OF FETCHING OF ARRANGEMENTS
  useEffect(() => {
    async function getArrangements() {
      const products = await fetchArrangements();
      if (products) {
        setArrangementsData(products);
      }
    }
    getArrangements();
  }, []);

  async function fetchArrangements() {
    try {
      const response = await fetch('/api/inventory/arrangements', {
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
  // END OF FETCHING OF ARRANGEMENTS

  // START OF DELETING OF ARRANGEMENTS
  const deleteArrangement = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/arrangements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete arrangement');
      }
  
      console.log(`Arrangement with ID ${id} deleted successfully`);
      
      // Automatically update products data by filtering out the deleted product
      setArrangementsData((prevData) => prevData.filter((arrangement) => arrangement.arrangement_id !== id));
    } catch (error) {
      console.error('Error deleting arrangement:', error);
    }
  };

  // HANDLE DELETE CONFIRM AND CALL DELETE FUNCTION
  const handleArrangementDeleteConfirmation = () => {
    if (arrangementId) {  // Assuming arrangementId is the ID of the product you want to delete
      deleteArrangement(arrangementId);
    }
  };
  // END OF DELETING OF ARRANGEMENTS

  // START OF ADDING OF ARRANGEMENTS
  const [arrangement, setArrangement] = useState({
    arrangement_name: '',
    arrangement_type_id: '',
    price: 0,
    description: '',
    img_link: '',
  });

  const handleArrangementInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Check if the field is part of product or batch and update accordingly
    if (name in arrangement) {
      setArrangement((prevArrangement) => ({
        ...prevArrangement,
        [name]: value,
      }));
    } 
  };

  const handleArrangementSelect = (type: string) => {
    setSelectedType(type)
    setArrangement((prev) => ({ ...prev, arrangement_type_id: type }))
  }

  const handleArrangementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", { arrangement });

    try {
      const response = await fetch('/api/inventory/add-arrangement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arrangement }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Arrangement added:', data);
      alert('Arrangement added successfully!');

      // Reset form if needed
      setArrangement({ arrangement_name: '', arrangement_type_id: '', price: 0, description: '', img_link: '' });
    } catch (error) {
      console.error('Failed to add arrangement:', error);
      alert('Failed to add arrangement.');
    }
  };
  // END OF ADDING OF ARRANGEMENTS
  
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

// START OF FILTER ARRANGEMENTS BASED ON ARRANGEMENT TYPE
const filteredArrangements = selectedArrangementType
? arrangementsData.filter((product) => {
    console.log("Product Type:", product.arrangement_type); // Log arrangement_type
    return product.arrangement_type === selectedArrangementType;
  })
: arrangementsData;

//FILTER MATERIALS BASED ON MATERIAL TYPE
const filteredMaterials = selectedMaterialsType
? materialsData.filter((product) => {
    console.log("Product Type:", product.mat_name); // Log arrangement_type
    return product.mat_name === selectedMaterialsType;
  })
: materialsData;

// FILTER PRODUCTS BASED ON PRODUCT TYPE
const filteredProducts = selectedProductsType
? productsData.filter((product) => {
    console.log("Product Type:", product.prod_type); // Log product_type
    return product.prod_type === selectedProductsType;
  })
: productsData;
// END OF FILTER

// Sorting by shelf_life in ascending order
const [isShelfLifeAscending, setIsShelfLifeAscending] = useState(true);
const [sortedProducts, setSortedProducts] = useState(filteredProducts);
const sortByShelfLifeAscending = (data: ProductsItem[]): ProductsItem[] => {
  return [...data].sort((a, b) => Number(a.shelf_life) - Number(b.shelf_life));
};

// Sorting by shelf_life in descending order
const sortByShelfLifeDescending = (data: ProductsItem[]): ProductsItem[] => {
  return [...data].sort((a, b) => Number(b.shelf_life) - Number(a.shelf_life));
};

const handleSortByShelfLife = () => {
  const sorted = isShelfLifeAscending
    ? sortByShelfLifeAscending(filteredProducts)
    : sortByShelfLifeDescending(filteredProducts);
  setSortedProducts(sorted);
  setIsShelfLifeAscending(!isShelfLifeAscending);
};

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
    {/*Config ng wide screen na navigation */}
    <Sidebar />  {/* Render the Sidebar */}
    <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14">
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
              </div>
            </div>
            <TabsContent value="products">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Inventory</CardTitle>
                  <div className="ml-auto flex items-center gap-2">
                    {/* Sort Shelf Life Button */}
                      <Button size="sm" variant="outline" onClick={handleSortByShelfLife} className="h-7 gap-1">
                        Sort Shelf Life {isShelfLifeAscending ? "↑" : "↓"}
                      </Button>
       
                  <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1">
                              {selectedProductsType || "All"}
                            <ListFilter className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Show by Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem
                            checked={!selectedProductsType}
                            onClick={() => setSelectedProductsType(null)}
                          >
                            All
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedProductsType === "flower"}
                            onClick={() => setSelectedProductsType("flower")}
                          >
                            Flower
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedProductsType === "filler"}
                            onClick={() => setSelectedProductsType("filler")}
                          >
                            Filler
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedProductsType === "leaves"}
                            onClick={() => setSelectedProductsType("leaves")}
                          >
                            Leaves
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/*Product removal Modal */}
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
                              <Label htmlFor="username" className="text-right">
                                Product ID:
                              </Label>
                              <Input id="product_id" 
                              placeholder="Search by product ID" 
                              value={productId}
                              onChange={(e) => setProductId(e.target.value)}
                              className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction onClick={handleDeleteConfirmation}>Yes</AlertDialogAction>
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

                       {/*Product by batch removal Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Product By Batch
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Product By Batch</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Batch ID:
                              </Label>
                              <Input id="product_id" 
                              placeholder="Search by batch ID" 
                              value={productBatchId}
                              onChange={(e) => setProductBatchId(e.target.value)}
                              className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction onClick={handleDeleteByBatchConfirmation}>Yes</AlertDialogAction>
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

                      {/*Add Product Modal */}
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                              <DialogTitle>Add Product with Batch</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {/* Product Name */}
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label className="text-left">Product Name:</Label>
                                <Input
                                  type="text"
                                  name="prod_name"
                                  placeholder="Enter product name"
                                  className="col-span-5"
                                  value={product.prod_name}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Product Type and Variant Name */}
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label htmlFor="productType" className="block mb-1 text-gray-700">
                                  Product Type
                                </Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Input
                                      id="productType"
                                      placeholder="Select type"
                                      value={selectedType || ""}
                                      className="w-full p-2 border rounded-lg focus:outline-none col-span-2"
                                      readOnly
                                    />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full p-1">
                                    {productTypes.map((type) => (
                                      <DropdownMenuItem
                                        key={type}
                                        onClick={() => handleSelect(type)}
                                        className="capitalize cursor-pointer"
                                      >
                                        {type}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Label className="text-left">Variant Name:</Label>
                                <Input
                                  type="text"
                                  name="variant_name"
                                  placeholder="Enter variant name"
                                  className="col-span-2"
                                  value={product.variant_name}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Variant Color and Price */}
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label className="text-left">Variant Color:</Label>
                                <Input
                                  type="text"
                                  name="var_color"
                                  placeholder="Enter variant color"
                                  className="col-span-2"
                                  value={product.var_color}
                                  onChange={handleInputChange}
                                />
                                <Label className="text-left">Price:</Label>
                                <Input
                                  type="number"
                                  name="price_per_qty"
                                  placeholder="0.00"
                                  className="col-span-2"
                                  value={product.price_per_qty}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Stock Quantity and Shelf Life */}
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label className="text-left">Stock Quantity:</Label>
                                <Input
                                  type="number"
                                  name="stock_qty"
                                  placeholder="Enter stock quantity"
                                  className="col-span-2"
                                  value={batch.stock_qty}
                                  onChange={handleInputChange}
                                />
                                <Label className="text-left">Shelf Life:</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="col-span-2 pl-3 text-left font-normal">
                                        {batch.shelf_life || "Pick a date"}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                      <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => handleDateChange(date)}
                                        disabled={(date) => date < new Date("1900-01-01")}
                                        initialFocus
                                      />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button type="submit">Save</Button>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardHeader>
               
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell cursor-pointer" onClick={handleSortByShelfLife}>
                          Shelf Life {isShelfLifeAscending ? "↑" : "↓"}
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Variant
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Color
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
                    {(sortedProducts.length > 0 ? sortedProducts : filteredProducts).length > 0 ? (
                      (sortedProducts.length > 0 ? sortedProducts : filteredProducts).map((item) => (
                      <TableRow key={item.batch_id}>
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.batch_id}
                        </TableCell>
                        <TableCell>
                          {item.product_id}
                        </TableCell>
                        <TableCell>{item.prod_name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.variant_name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.var_color}
                        </TableCell>
                        <TableCell>
                          {item.prod_type}
                        </TableCell>
                        <TableCell>
                          {item.stock_qty}
                        </TableCell>
                        <TableCell>
                          {item.price_per_qty}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.shelf_life}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button> */}
                          <ToastCopyIdButton id={item.product_id} size="sm" variant="outline" className="h-7 gap-1">
                            </ToastCopyIdButton>
                        </div>
                        </TableCell>
                      </TableRow>
                       ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center">
                            No products found for this type.
                          </TableCell>
                        </TableRow>
                      )}
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
                  <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1">
                            {selectedMaterialsType || "All"}
                            <ListFilter className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Show by Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem
                            checked={!selectedMaterialsType}
                            onClick={() => setSelectedMaterialsType(null)}
                          >
                            All
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedMaterialsType === "Wrapper"}
                            onClick={() => setSelectedMaterialsType("Wrapper")}
                          >
                            Wrapper
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedMaterialsType === "Ribbon"}
                            onClick={() => setSelectedMaterialsType("Ribbon")}
                          >
                            Ribbon
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedMaterialsType === "Crepe"}
                            onClick={() => setSelectedMaterialsType("Crepe")}
                          >
                            Crepe
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Material
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Material</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Material ID:
                              </Label>
                              <Input id="material_id"
                               placeholder="Search by material ID" 
                               value={materialId}
                                onChange={(e) => setMaterialId(e.target.value)}
                               className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button type="button" variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction onClick={handleMaterialDeleteConfirmation}>Yes</AlertDialogAction>
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
                            Add Material
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                        <form onSubmit={handleMaterialSubmit}>
                          <DialogHeader>
                            <DialogTitle>Add Material</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*First row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Material Name:
                              </Label>
                              <Input 
                              type="text"
                              name="mat_name"
                              placeholder="Enter product name"
                              className="col-span-2"
                              value={material.mat_name}
                              onChange={handleMaterialInputChange} />

                              <Label htmlFor="materialType" className="block mb-1 text-gray-700">
                                  Material Type
                                </Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Input
                                      id="materialType"
                                      placeholder="Select type"
                                      value={selectedType || ""}
                                      className="p-2 border rounded-lg focus:outline-none col-span-2"
                                      readOnly
                                    />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full p-1">
                                    {materialTypes.map((type) => (
                                      <DropdownMenuItem
                                        key={type.value}
                                        onClick={() => handleMaterialSelect(type.value)}
                                        className="capitalize cursor-pointer"
                                      >
                                        {type.label}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                            {/*Second row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                            <Label className="text-left">Color:</Label>
                                <Input
                                  type="text"
                                  name="color"
                                  placeholder="Enter color"
                                  className="col-span-2"
                                  value={material.color}
                                  onChange={handleMaterialInputChange}
                                />
                              <Label className="text-left">Stock Quantity:</Label>
                                <Input
                                  type="number"
                                  name="stock_qty"
                                  placeholder="Enter stock quantity"
                                  className="col-span-2"
                                  value={material.stock_qty}
                                  onChange={handleMaterialInputChange}
                                />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                          </form>
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
                    {filteredMaterials.length > 0 ? (
                      filteredMaterials.map((item) => (
                      <TableRow key={item.material_id}> 
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.material_id}
                        </TableCell>
                        <TableCell>{item.mat_name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.type_name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.color}
                        </TableCell>
                        <TableCell>
                          {item.stock_qty}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button> */}
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                     ))
                    ) : (
                      <p>No products found for this type.</p>
                    )}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        {selectedArrangementType || "All"}
                        <ListFilter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Show by Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={!selectedArrangementType}
                        onClick={() => setSelectedArrangementType(null)}
                      >
                        All
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedArrangementType === "Bouquet"}
                        onClick={() => setSelectedArrangementType("Bouquet")}
                      >
                        Bouquet
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedArrangementType === "Funeral"}
                        onClick={() => setSelectedArrangementType("Funeral")}
                      >
                        Funeral
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedArrangementType === "Entourage"}
                        onClick={() => setSelectedArrangementType("Entourage")}
                      >
                        Entourage
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedArrangementType === "Bridal Bouquet"}
                        onClick={() => setSelectedArrangementType("Bridal Bouquet")}
                      >
                        Bridal Bouquet
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedArrangementType === "Funeral Basket"}
                        onClick={() => setSelectedArrangementType("Funeral Basket")}
                      >
                        Funeral Basket
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Delete Arrangement
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Remove Arrangement</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Arrangement ID:
                              </Label>
                              <Input id="arrangement_id" 
                              placeholder="Search by arrangement ID"
                              value={arrangementId}
                              onChange={(e) => setArrangementId(e.target.value)}
                               className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button type="button" variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to remove this product?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete your product from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogAction onClick={handleArrangementDeleteConfirmation}>Yes</AlertDialogAction>
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
                      {/* <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Arrangement
                          </span>
                        </Button>
                      </DialogTrigger> */}
                        <DialogContent className="sm:max-w-[700px]">
                          <DialogHeader>
                            <DialogTitle>Add Arrangement</DialogTitle>
                            <form onSubmit={handleArrangementSubmit}></form>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/* Arrangement Name */}
                            <div className="grid grid-cols-6 items-center gap-4">
                                <Label className="text-left">Arrangement Name:</Label>
                                <Input
                                  type="text"
                                  name="arrangement_name"
                                  placeholder="Enter arrangement name"
                                  className="col-span-5"
                                  value={arrangement.arrangement_name}
                                  onChange={handleArrangementInputChange}
                                />
                              </div>
                            {/* Product Type and Variant Name */}
                            <div className="grid grid-cols-6 items-center gap-4">
                                <Label htmlFor="productType" className="block mb-1 text-gray-700">
                                  Arrangement Type
                                </Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Input
                                      id="arrangementType"
                                      placeholder="Select type"
                                      value={selectedType || ""}
                                      className="w-full p-2 border rounded-lg focus:outline-none col-span-2"
                                      readOnly
                                    />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full p-1">
                                    {arrangementTypes.map((type) => (
                                      <DropdownMenuItem
                                        key={type.label}
                                        onClick={() => handleSelect(type.value)}
                                        className="capitalize cursor-pointer"
                                      >
                                        {type.label}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Label className="text-left">Price:</Label>
                                <Input
                                  type="number"
                                  name="price"
                                  placeholder="0.00"
                                  className="col-span-2"
                                  value={arrangement.price}
                                  onChange={handleArrangementInputChange}
                                />
                              </div>
                            {/*Third row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Description:
                              </Label>
                              <Input 
                              id="desc" 
                              placeholder="Enter arrangement description" className="col-span-5" />
                            </div>
                            {/*Fourth row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                            <Label className="text-left">
                                Image:
                              </Label>

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
                          Arrangement Type
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
                     {filteredArrangements.length > 0 ? (
                        filteredArrangements.map((item) => (
                      <TableRow key={item.arrangement_id}>
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox id="item1" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.arrangement_id}
                        </TableCell>
                        <TableCell>
                          {item.arrangement_name}
                        </TableCell>
                        <TableCell>{item.arrangement_type}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.price}
                        </TableCell>
                        <TableCell>
                          {item.description}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.num_reviews}
                        </TableCell>
                        <TableCell className="font-medium">
                        <Dialog>
                          <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 gap-1">
                              <Maximize2 className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <img src={item.img_link} alt={item.arrangement_name} className="w-full h-auto" onError={() => console.error("Image failed to load: ", item.img_link)}/>
                            </DialogContent>
                            </Dialog>
                          
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.num_sold}
                        </TableCell>
                        <TableCell>
                        <div className="ml-auto flex items-center gap-2">
                          {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                            <FilePenLine className="h-3.5 w-3.5" />
                          </Button> */}
                          <Button size="sm" variant="outline" className="h-7 gap-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                        ))
                      ) : (
                        <p>No products found for this type.</p>
                      )}
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

export default Inventory;