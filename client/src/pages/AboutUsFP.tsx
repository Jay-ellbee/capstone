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
    <div className="flex min-h-screen w-full flex-col sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-auto">
      <div className="w-full max-w-3xl p-6 rounded-lg backdrop-blur-lg bg-gray-200/30 shadow-md mx-auto my-16">
        <CardContent className="space-y-6 text-center text-gray-800">
          <h1 className="text-4xl font-bold text-rose-500 text-opacity-70">La Primera Nene's Flower Shop</h1>
          <p className="text-lg text-gray-700">
            Welcome to <span className="font-semibold text-rose-500 text-opacity-70">La Primera Nene's Flower Shop</span>, where elegance meets nature. Our mission is to bring a touch of beauty and joy to your every occasion with our fresh and carefully arranged flowers.
          </p>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-gray-600">
              To bloom smiles, one petal at a time. We strive to be more than just a flower shop; we aim to be part of your celebrations, sorrows, and every moment in between.
            </p>
          </div>
          <div className="grid md:mx-auto md:flex-row md:space-x-8 items-center justify-center space-y-6 lg:space-y-0 lg:grid-cols-2">
            <div className="rounded-xl backdrop-blur-md bg-white/40 p-6 shadow-md col-span-1">
              <h3 className="font-semibold">Visit Our Shop</h3>
              <p className="text-gray-600 text-sm">Dangwa Stall 34 Dos Castillas Street Sampaloc Manila</p>
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/40 p-6 shadow-md col-span-1">
              <h3 className="font-semibold">Contact Us</h3>
              <p className="text-gray-600 text-sm">Email: <a className="text-rose-600">irish_rina@yahoo.com</a></p>
              <p className="text-gray-600 text-sm">Phone: <a className="text-rose-600">0995 450 1418</a></p>
            </div>
          </div>
          <Button variant="outline" className="mt-6 text-rose-600 hover:bg-rose-100 transition-all" onClick={handleChatClick}>
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
