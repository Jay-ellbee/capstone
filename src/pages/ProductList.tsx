import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Rose Bouquet",
    price: 25.99,
    image: "/images/rose-bouquet.jpg", // Add your image path here
  },
  {
    id: 2,
    name: "Tulip Bouquet",
    price: 18.99,
    image: "/images/tulip-bouquet.jpg",
  },
  // Add more products here
];

export default function ProductList() {
  return (
    <div className="container mx-auto p-6">
      {/* Navigation Bar */}
      <nav className="mb-6">
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <CardTitle className="text-center mt-4">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-xl font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Link to={`/product/${product.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
