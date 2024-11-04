import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
//import Footer from '@/components/Footer'; // Reusable footer component
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';

const Customization: React.FC = () => {
  

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 my-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Customization</CardTitle>
            </CardHeader>
            <CardContent>
            <textarea placeholder="Type a detailed description of your desired arrangement." name="notes" className="w-full p-3 border rounded-sm" rows={10} />
            </CardContent>
            <CardFooter>
              <Button className="w-1/3 ml-auto">Generate</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader> 
              <CardTitle className="text-2xl font-bold">Results</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid grid-cols-2 gap-2 h-40">
                <Skeleton className="w-full rounded-xl"/>
                <Skeleton className="w-full rounded-xl"/>
              </div>
              <div className="grid grid-cols-3 gap-2 h-40">
                <Skeleton className="w-full rounded-xl"/>
                <Skeleton className="w-full rounded-xl"/>
                <Skeleton className="w-full rounded-xl"/>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default Customization;
