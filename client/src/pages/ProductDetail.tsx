/*const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null); // Use proper product type

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }*/

   
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
    
    // Define types for product and review
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  colors: string[];
  reviews: Review[];
}
    
interface Review {
  id: number;
  rating: number;
  comment: string;
}
    
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    console.log("Product ID:", id); // Debugging: Log the ID

    const fetchProduct = async () => {
      // Simulating fetching product data based on ID
      const fetchedProduct: Product = {
        id: id!,
        name: "Rose Bouquet",
        description: "A beautiful bouquet of fresh roses.",
        price: 25.99,
        image: "/images/rose-bouquet.jpg",
        colors: ["Red", "Pink", "White"],
        reviews: [
          { id: 1, rating: 5, comment: "Absolutely stunning!" },
          { id: 2, rating: 4, comment: "Very beautiful roses." },
        ],
      };
      setProduct(fetchedProduct);
      setColor(fetchedProduct.colors[0]); // Set color only after product is fetched
    };

    fetchProduct();
  }, [id]);
    
  if (!product) {
    return <p>Loading...</p>;
  }
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };
    
  return (
<div className="container mx-auto p-6">
      {/* Navigation Buttons */}
      <nav className="mb-6">
        <Link to="/">
          <Button className="mr-2">Back to Home</Button>
        </Link>
        <Link to="/products">
          <Button>Back to Product List</Button>
        </Link>
      </nav>

      <div className="flex flex-col md:flex-row">
        <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-auto object-cover rounded-md" />
        <div className="md:ml-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{product.description}</p>
              <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              <div className="my-4">
                <label htmlFor="color" className="block text-sm">Choose a color:</label>
                <select id="color" value={color} onChange={(e) => setColor(e.target.value)} className="border p-2">
                  {product.colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="my-4">
                <label htmlFor="quantity" className="block text-sm">Quantity:</label>
                <select id="quantity" value={quantity} onChange={handleQuantityChange} className="border p-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <Button className="mr-2">Add to Cart</Button>
              <Button variant="outline">Buy Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-xl font-bold my-4">Customer Reviews</h2>
      <div className="space-y-4">
        {product.reviews.map((review) => (
          <Card key={review.id}>
            <CardContent>
              <p className="font-semibold">Rating: {review.rating} ⭐</p>
              <p>{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold my-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Here you would map over related products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Another Bouquet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-xl font-bold">$20.99</p>
            <Button className="w-full">View Details</Button>
          </CardContent>
        </Card>
        {/* Repeat for other products */}
      </div>
    </div>
  );
};
    
export default ProductDetail;
    
    