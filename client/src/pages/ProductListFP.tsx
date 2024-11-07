import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderFP from "@/components/HeaderFP";
import Footer from "@/components/FooterFP";
import { ArrowDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Bouquet = {
  arrangement_id: string;
  arrangement_name: string;
  arrangement_type: string;
  price: number;
  num_sold: number;
  description: string;
  img_link: string;
};

const ProductList: React.FC = () => {
  const [productsData, setProductsData] = useState<Bouquet[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<'price' | 'num_sold'>('price');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Bouquet[]>([]);

  // Fetch initial product data
  useEffect(() => {
    async function getProducts() {
      const products = await fetchProducts();
      if (products) {
        setProductsData(products);
      }
    }
    getProducts();
  }, []);

  // Fetch products data from the API
  async function fetchProducts() {
    try {
      const response = await fetch('/api/arrangements/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  // Update search results based on the search term
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]); // Reset search results if search term is empty
        return;
      }
      try {
        const response = await fetch(`/api/search/customer?keyword=${encodeURIComponent(searchTerm)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Filter products based on the search term, selected type, and initial data
  const filteredProducts = (searchTerm ? searchResults : productsData).filter((product) => {
    return selectedType ? product.arrangement_type === selectedType : true;
  });

  // Sort products based on the selected criteria
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortCriteria === 'price') {
      return a.price - b.price;
    } else {
      return b.num_sold - a.num_sold;
    }
  });

  const handleSortChange = (criteria: 'price' | 'num_sold') => {
    setSortCriteria(criteria);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      <HeaderFP />
      <main className="container mx-auto my-5 p-3 lg:px-20">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-semibold mb-6">Our Products</h1>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative ml-auto w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-background pl-8"
              />
            </div>
          </div>

          {/* Sorting Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Sort by: {sortCriteria === 'price' ? 'Price (Lowest to Highest)' : 'Most Sold'}
                <ArrowDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortCriteria === 'price'}
                onClick={() => handleSortChange('price')}
              >
                Price (Lowest to Highest)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortCriteria === 'num_sold'}
                onClick={() => handleSortChange('num_sold')}
              >
                Most Sold
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter by Type Dropdown */}
          <div className="flex items-center space-x-2">
            <h1 className="text-base">Filter By Type:</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {selectedType || "All"}
                  </span>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Show by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={!selectedType}
                  onClick={() => setSelectedType(null)}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Bouquet"}
                  onClick={() => setSelectedType("Bouquet")}
                >
                  Bouquet
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Funeral"}
                  onClick={() => setSelectedType("Funeral")}
                >
                  Funeral
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Entourage"}
                  onClick={() => setSelectedType("Entourage")}
                >
                  Entourage
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Bridal Bouquet"}
                  onClick={() => setSelectedType("Bridal Bouquet")}
                >
                  Bridal Bouquet
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Funeral Basket"}
                  onClick={() => setSelectedType("Funeral Basket")}
                >
                  Funeral Basket
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedType === "Funeral Urn"}
                  onClick={() => setSelectedType("Funeral Urn")}
                >
                  Funeral Urn
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <Link to={`/products/${product.arrangement_id}`} key={product.arrangement_id}>
                <Card className="shadow-md hover:shadow-lg">
                  <CardHeader className="pb-2 p-0">
                    <img src={product.img_link} alt={product.arrangement_name} className="w-full h-60 rounded object-cover" />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-left text-default md:text-lg pt-2 mb-0 line-clamp-1">
                      {product.arrangement_name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-left text-md font-semibold">₱{product.price.toFixed(2)}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <p>No products found for this type.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductList;
