import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderFP from "@/components/HeaderFP";
import Footer from "@/components/FooterFP";
import { ArrowRight, Search, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type bouquet = {
  arrangement_id: string,
  arrangement_name: string,
  arrangement_type: string, 
  price: number,
  description:string,
  img_link: string,
}

const ProductList: React.FC  = () =>{
  const [productsData, setProductsData] = useState<bouquet[]>([]);

  // Fetch products data on component mount
  useEffect(() => {
    async function getProducts() {
      const products = await fetchProducts();
      if (products) {
        setProductsData(products);
      }
    }
    getProducts();
  }, []);

  // Function to fetch products from the backend
  async function fetchProducts() {
    try {
      const response = await fetch('/api/admin/products', {
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


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
    {/*Config ng wide screen na navigation */}
      <HeaderFP />
    <main className="container mx-auto my-5 p-3 lg:px-20">
      {/* Navigation Bar */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-semibold mb-6">Our Products</h1>
        
        {/* Spacer to push the next items to the right */}
        <div className="flex-1"></div>
        
        {/* Search Bar */}
        <div className="relative md:w-[200px] lg:w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        
        {/* Dropdown and Second H1 */}
        <div className="flex items-center space-x-2">
          <h1 className="text-base ">Sort By:</h1>
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
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Popularity</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                This Year
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:gap-8">
        {productsData.map((product) => (
          <Card key={product.arrangement_id}>
            <CardHeader className="pb-2">
              <img src={product.img_link} alt={product.arrangement_name} className="w-full h-60 rounded object-cover" />
              <CardTitle className="text-left mt-6 mb-0">{product.arrangement_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-left text-xl font-bold">₱{product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Link to={`/products/${product.arrangement_id}`} className="ml-auto">
                <Button className="w-full" variant="ghost">View Details
                  <ArrowRight className="h-5 w-5"/>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
    <Footer />
    </div>
  );
}


export default ProductList;