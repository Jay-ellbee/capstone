import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { Separator } from '@/components/ui/separator';    // Define types for product and review
import { Badge } from '@/components/ui/badge';

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
    
const ProductDetail: React.FC  = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    console.log("Product ID:", id); // Debugging: Log the ID

    const fetchProduct = async () => {
      // Simulating fetching product data based on ID
      // useEffect(() => {
      //   const fetchProduct = async () => {
      //     const response = await fetch(`/api/products/${id}`);
      //     const data = await response.json();
      //     setProduct(data);
      //   };
      //   fetchProduct();
      // }, [id]);
    
      // if (!product) {
      //   return <p>Loading...</p>;
      // }*/
      const fetchedProduct: Product = {
        id: id!,
        name: "Rose Bouquet",
        description: "A beautiful bouquet of fresh roses.",
        price: 25.99,
        image: "/Blue-Ecuadorian-roses-4000.jpg",
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
  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)); // assuming max quantity is 10
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // assuming min quantity is 1
  };
    
  return (
<div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
    {/*Config ng wide screen na navigation */}
      <HeaderFP />
    <main className="container mx-auto p-3 md: px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <img src={product.image} alt={product.name} className="w-full m-auto h-auto object-cover rounded-md" />
        <div className="md:ml-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{product.description}</p>
              <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              <div className="my-4">
                <label htmlFor="color" className="block text-sm mb-2">Choose any color:</label>
                <div className="flex items-center gap-4">
                  {product.colors.map((colors) => (
                    <button
                      key={colors}
                      onClick={() => setColor(colors)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === colors ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colors }}
                      aria-label={colors}
                    />
                  ))}
                </div>
              </div>
              <div className="my-4 flex items-center">
                <label htmlFor="quantity" className="block text-sm mr-4">Quantity:</label>
                <div className="flex items-center border rounded overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 flex justify-center items-center bg-gray-200 hover:bg-gray-300 border-r"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 h-8 text-center border-none"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 flex justify-center items-center bg-gray-200 hover:bg-gray-300 border-l"
                  >
                    +
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center px-4 py-2 space-x-4">
              <Button className="w-32 mr-10">Add to Cart</Button>
              <Button variant="outline" className="w-32">Buy Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-10">
      <h2 className="text-xl font-bold my-4">Customer Reviews</h2>
      <Card>
        <CardContent className="flex items-center space-x-4 p-4">
              <p>⭐ ⭐ ⭐ ⭐ ⭐<span className="ml-2">5 out of 5</span></p>
              <Badge variant='outline'>All</Badge>
              <Badge variant='outline'>5 Stars (1)</Badge>
              <Badge variant='outline'>4 Stars</Badge>
              <Badge variant='outline'>3 Stars</Badge>
              <Badge variant='outline'>2 Stars</Badge>
              <Badge variant='outline'>1 Star</Badge>
        </CardContent>
      </Card>
          <Card className="mt-4">
          {product.reviews.map((review) => (
            <CardContent key={review.id} className="px-2 pb-0 pt-2 sm:px-6 ">
              <p className="font-semibold">Rating: {review.rating} ⭐</p>
              <p>{review.comment}</p>
              <Separator className="mt-2" />
            </CardContent>
            ))}
          </Card>
      </div>

      <h2 className="text-xl font-bold my-4">You May Also Like</h2>
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
      </main>
      <Footer />
    </div>
   
  );
};
    
export default ProductDetail;
    
    