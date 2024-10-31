import React, { useState } from 'react';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



const AboutUs: React.FC  = () => {
    const handleChatClick = () => {
        window.open('https://m.me/Joshii.Zumofu', '_blank');
      };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[url('flower-bg.jpg')] sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-20">
      <div className="w-full max-w-3xl p-6 rounded-lg backdrop-blur-lg bg-white/30 shadow-md">
        <CardContent className="space-y-6 text-center text-gray-800">
          <h1 className="text-4xl font-bold">La Primera Nene's Flower Shop</h1>
          <p className="text-lg text-gray-700">
            Welcome to <span className="font-semibold">La Primera Nene's Flower Shop</span>, where elegance meets nature. Our mission is to bring a touch of beauty and joy to your every occasion with our fresh and carefully arranged flowers.
          </p>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-gray-600">
              To bloom smiles, one petal at a time. We strive to be more than just a flower shop; we aim to be part of your celebrations, sorrows, and every moment in between.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8 items-center justify-center space-y-6 md:space-y-0">
            <div className="rounded-xl backdrop-blur-md bg-white/40 p-6 shadow-md">
              <h3 className="font-semibold">Visit Our Shop</h3>
              <p className="text-gray-600 text-sm">123 Flower Lane, Townsville, FL 12345</p>
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/40 p-6 shadow-md">
              <h3 className="font-semibold">Contact Us</h3>
              <p className="text-gray-600 text-sm">Email: <a href="mailto:info@neneflowershop.com" className="text-rose-600">info@neneflowershop.com</a></p>
              <p className="text-gray-600 text-sm">Phone: <a href="tel:+1234567890" className="text-rose-600">+1 (234) 567-890</a></p>
            </div>
          </div>
          <Button variant="ghost" className="mt-6 text-rose-600 hover:bg-rose-100 transition-all">
            Learn More
          </Button>
        </CardContent>
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

export default AboutUs;
