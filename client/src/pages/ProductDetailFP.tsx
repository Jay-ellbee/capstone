import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart, CartItem } from '../context/CartContext';
import { useParams, Link, useNavigate } from 'react-router-dom';

type Product = {
  arrangement_id: string;
  arrangement_name: string;
  arrangement_type_id: string;
  description: string;
  price: number;
  img_link: string;
  num_reviews: number;
  num_sold: number;
  // reviews: Review[];
  // colors: string[];
};

type Bouquet = {
  arrangement_id: string;
  arrangement_name: string;
  arrangement_type: string;
  price: number;
  num_sold: number;
  description: string;
  img_link: string;
};


interface Review {
  id: number;
  rating: number;
  comment: string;
}

const ProductDetail: React.FC = () => {
  const { arrangement_id } = useParams<{ arrangement_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]); // State for recommendations
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { role } = useAuth(); // useAuth to access the role
  const isCustomer = role === 'customer';
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<Bouquet[]>([]);

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
      const response = await fetch('/api/arrangements/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/inventory/arrangements/${arrangement_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product with ID ${arrangement_id}`);
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (arrangement_id) {
      fetchProduct();
    }
  }, [arrangement_id]);

  // Fetch Recommendations
  useEffect(() => {
    const fetchRecommendations = async (topN = 4) => {
      try {
        const response = await fetch(`http://localhost:5000/recommend/${arrangement_id}?top_n=${topN}`);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`);
        }
  
        const recommendationData = await response.json();
        setRecommendations(recommendationData);
      } catch (error) {
        // Type assertion to ensure 'error' is treated as an Error
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error fetching recommendations:", errorMessage);
        setError(errorMessage); // Set an error state to display in the UI
      }
    };
  
    if (arrangement_id) {
      fetchRecommendations();
    }
  }, [arrangement_id]);
  

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      id: product.arrangement_id,
      name: product.arrangement_name,
      price: product.price,
      quantity: quantity,
      image: product.img_link,
    };

    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(isCustomer ? '/checkout-cust' : '/checkout');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-20">
        {product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <img src={product.img_link} alt={product.arrangement_name} className="w-full m-auto h-auto object-cover rounded-md" />
            <div className="md:ml-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{product.arrangement_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{product.description}</p>
                  <p className="text-xl font-bold">₱{product.price.toFixed(2)}</p>
                  <div className="my-4 flex items-center">
                    <label htmlFor="quantity" className="block text-sm mr-4">Quantity:</label>
                    <div className="flex items-center border rounded overflow-hidden">
                      <button onClick={decreaseQuantity} className="w-8 h-8 flex justify-center items-center bg-gray-200 hover:bg-gray-300 border-r">-</button>
                      <input id="quantity" type="text" value={quantity} readOnly className="w-12 h-8 text-center border-none" />
                      <button onClick={increaseQuantity} className="w-8 h-8 flex justify-center items-center bg-gray-200 hover:bg-gray-300 border-l">+</button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col md:flex-row justify-center items-center px-4 py-2 space-y-2 md:space-y-0 md:space-x-4">
                  <Button className="w-full md:w-32" onClick={handleAddToCart}>Add to Cart</Button>
                  <Button variant="outline" className="w-full md:w-32" onClick={handleBuyNow}><Link to="/checkout">Buy Now</Link></Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <p>Loading product...</p>
        )}

        <h2 className="text-xl font-bold my-4 mt-20">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-6">
          {recommendations.length > 0 ? (
            recommendations.map((item) => (
              <Card key={item.arrangement_id}>
                <CardHeader>
                <img src={item.img_link} alt={item.arrangement_name} className="w-full h-60 rounded object-cover" />
                  <CardTitle className="text-center">{item.arrangement_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-xl font-bold">₱{item.price.toFixed(2)}</p>
                  <Link to={`/products/${item.arrangement_id}`} key={item.arrangement_id}><Button className="w-full mt-4 bg-rose-300" variant="outline">View Details</Button></Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
