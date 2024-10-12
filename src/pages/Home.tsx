// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-bold">E-Shop</h1>
        </div>
        <div>
          <Link to="/login">
            <Button className="mr-4">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center my-12">
        <h2 className="text-4xl font-bold mb-4">Welcome to E-Shop!</h2>
        <p className="text-lg mb-6">Shop the latest trends with amazing deals.</p>
        <Link to="/products">
          <Button className="text-xl">Shop Now</Button>
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p>$29.99</p>
              <Button className="mt-4">Add to Cart</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p>$49.99</p>
              <Button className="mt-4">Add to Cart</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p>$19.99</p>
              <Button className="mt-4">Add to Cart</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customization Section */}
      <section className="text-center my-12">
        <h3 className="text-2xl font-semibold mb-4">Customize Your Own</h3>
        <p className="mb-6">Try our custom products using text-to-image API</p>
        <Link to="/customization">
          <Button className="text-xl">Start Customizing</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
