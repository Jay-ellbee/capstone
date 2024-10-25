// src/pages/Home.tsx
import React, { useState } from 'react';
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

const Landing: React.FC = () => {
  const handleChatClick = () => {
    window.open('https://m.me/Joshii.Zumofu', '_blank');
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
    {/*Config ng wide screen na navigation */}
      <HeaderFP />
    <main className="p-4 sm:px-16 sm:py-8 md:px-22 lg:px-32 grid gap-6">
      {/*first row - containts the search bar */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">         
        <div className="relative ml-auto w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
      </div>

      {/*second row */}
      <div className="relative bg-[url('/flower-bg.jpg')] bg-no-repeat bg-cover bg-center rounded-lg h-80">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent rounded-lg"></div>

          {/* Content */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 z-10">
            <h2 className="text-4xl font-bold text-white">Fresh Flowers</h2>
            <p className="text-lg text-white mt-2">Lorem ipsum dolor sit amet...</p>
            <Link to="/products">
            <button className="mt-4 px-4 py-2 bg-rose-200 text-white rounded-lg">Shop Now</button></Link>
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 right-4 bg-white p-4 rounded-full z-10">
            <span className="text-rose-200 font-bold text-lg">15% OFF</span>
          </div>
        </div>

      {/*third row */}
      <div className="flex space-between">
        <h1 className="text-3xl font-semibold">Best Seller</h1>
        <Button asChild size="sm" variant="ghost" className="ml-auto gap-1 text-black hover:text-gray-700 text-xl">
            <Link to="/products">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
      </div>

      {/*Fourth row*/}
      <div className="grid gap-2 sm:gap-4 md:gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 h-100">
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/*Fifth row*/}
      <div className="flex space-between">
        <h1 className="text-3xl font-semibold">Seasonal Picks</h1>
        <Button asChild size="sm" variant="ghost" className="ml-auto gap-1 text-black hover:text-gray-700 text-xl">
            <Link to="/products">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
      </div>

      {/*Sixth row*/}
      <div className="grid gap-2 sm:gap-4 md:gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 h-100">
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/*Seventh row*/}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-right mt-4">
            <h1 className="text-xl">Welcome to </h1>
            <h1 className="text-3xl font-semibold">La Primera Nene’s Flower Shop</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mollis mi vel fringilla pellentesque. Proin viverra elit quis elit lobortis, ut malesuada velit vulputate. Fusce et metus leo. Vestibulum a consequat lorem. Duis vitae mi eget nisi vehicula semper. Aliquam tempus, libero eget porttitor tempus, nisl leo rutrum urna, elementum ornare tortor dolor in leo.</p>
          </CardContent>
        </Card>
      </div>

      {/*Eighth row*/}
      <div className="flex space-between" id="services">
        <h1 className="text-3xl font-semibold">Services</h1>
      </div>

      {/*Ninth row*/}
      <div className="grid gap-2 sm:gap-4 md:gap-8 sm:grid-cols-2 h-100">
      <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/*Tenth row*/}
      <div className="grid gap-2 sm:gap-4 md:gap-8 sm:grid-cols-2 h-100">
      <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            {/*<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />*/}
            <CardTitle className="text-center mt-4">Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$12.00</p>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
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
