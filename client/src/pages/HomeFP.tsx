// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
//import Footer from '@/components/Footer'; // Reusable footer component
import { Link } from 'react-router-dom';
import { Menu, Search, ArrowRight, MessageCircle} from 'lucide-react';
import { Input } from '@/components/ui/input';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Bouquet = {
  arrangement_id: string;
  arrangement_name: string;
  arrangement_type: string;
  price: number;
  description: string;
  img_link: string;
};

const Landing: React.FC = () => {
  const handleChatClick = () => {
    window.open('https://m.me/Joshii.Zumofu', '_blank');
  };

  const [productsData, setProductsData] = useState<Bouquet[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const rowsToShow = 4;


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
      const response = await fetch('/api/arrangements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const products = await response.json();
      console.log("Fetched Products:", products); // Log the fetched products
      return products;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  // Filter products based on the selected arrangement type
  const filteredProducts = selectedType
  ? productsData.filter((product) => {
      console.log("Product Type:", product.arrangement_type); // Log arrangement_type
      return product.arrangement_type === selectedType;
    })
  : productsData;

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-400/20 sm:py-0">
    {/*Config ng wide screen na navigation */}
      <HeaderFP />
    <main className="p-4 sm:px-16 sm:py-8 md:px-22 lg:px-32 grid gap-6">
      {/*first row - containts the search bar */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">         
        {/* <div className="relative ml-auto w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div> */}
      </div>

      {/*second row */}
      <div className="relative bg-[url('/flower-bg.jpg')] bg-no-repeat bg-cover bg-center rounded-lg h-80">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent rounded-lg"></div>

          {/* Content */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 z-10">
            <h2 className="text-4xl font-bold text-white text-opacity-80">Welcome to La Primera Nene's Flower Shop</h2>
            <p className="text-lg text-white mt-2">We, at La Primera Nene's Flower Shop delivers not only the flowers <br/>but also the love, happiness, and memories to remember ❤️</p>
            <Link to="/products">
            <Button className="mt-4 px-4 py-2 backdrop-blur-lg bg-white/30 text-rose-300 rounded-lg hover:scale-105" variant="outline">Shop Now</Button></Link>
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 right-4 bg-white p-4 rounded-full z-10">
            <span className="text-rose-200 font-bold text-lg">15% OFF</span>
          </div>
        </div>

      {/*third row */}
      <div className="flex space-between mt-8">
        <h1 className="text-3xl font-semibold text-rose-400">Best Seller</h1>
        <Button asChild size="sm" variant="link" className="ml-auto gap-1 text-rose-500 hover:text-rose-200 text-lg">
            <Link to="/products">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
      </div>

      {/*Fourth row*/}
      <div className="grid gap-2 sm:gap-3 md:gap-5 sm:grid-cols-2 md:grid-cols-4 xl:gap-10 lg:grid-cols-4 xl:grid-cols-4 h-100 xl:px-16">
      {filteredProducts.length > 0 ? (
            (filteredProducts.slice(0, rowsToShow)).map((product) => (
              <Link to={`/products/${product.arrangement_id}`}>
              <Card key={product.arrangement_id} className="shadow-md hover:shadow-lg">
                <CardHeader className="pb-2 p-0">
                  <img src={product.img_link} alt={product.arrangement_name} className="w-full h-60 rounded object-cover" />
                </CardHeader>
                <CardContent>
                <CardTitle className="text-left text-md md:text-lg pt-2 mb-0">{product.arrangement_name}</CardTitle>
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

      {/*Fifth row*/}
      <div className="flex space-between mt-8">
        <h1 className="text-3xl font-semibold text-rose-400">Seasonal Picks</h1>
        <Button asChild size="sm" variant="link" className="ml-auto gap-1 text-rose-500 hover:text-rose-200 text-lg">
            <Link to="/products">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
      </div>

      {/*Sixth row*/}
      <div className="grid gap-2 sm:gap-3 md:gap-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 h-100 xl:gap-10 xl:px-16">
      {filteredProducts.length > 0 ? (
            (filteredProducts.slice(0, rowsToShow)).map((product) => (
              <Link to={`/products/${product.arrangement_id}`}>
              <Card key={product.arrangement_id} className="shadow-md hover:shadow-lg">
                <CardHeader className="pb-2 p-0">
                  <img src={product.img_link} alt={product.arrangement_name} className="w-full h-60 rounded object-cover" />
                </CardHeader>
                <CardContent>
                <CardTitle className="text-left text-md md:text-lg pt-2 mb-0">{product.arrangement_name}</CardTitle>
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

      {/*Seventh row*/}
      <div className="relative bg-[url('/flower-bg.jpg')] bg-no-repeat bg-cover bg-center rounded-lg h-80 my-16">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent rounded-lg"></div>

          {/* Content */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 z-10">
            <h2 className="text-4xl font-bold text-white">Cant imagine your dream bouquet?</h2>
            <p className="text-lg text-white mt-2">Try our new customization feature</p>
            <Link to="/customization">
            <Button className="mt-4 px-4 py-2 backdrop-blur-lg bg-white/30 text-rose-300 rounded-lg" variant="outline">Try it!</Button></Link>
          </div>

      </div>

      <button
          onClick={handleChatClick}
          className="fixed bottom-5 right-5 bg-rose-200 hover:bg-rose-300 text-black px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 transition-colors duration-300"
          style={{ zIndex: 1000 }}
        >
        <MessageCircle className="h-5 w-5 text-black" />
          <span>Chat with us!</span>
        </button>
    </main>
    <Footer />
  </div>
  );
};

export default Landing;
