import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderFP from "@/components/HeaderFP";
import Footer from "@/components/FooterFP";
import { ArrowRight, Search, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const ContactUs: React.FC = () => {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
        <HeaderFP />
        <main className="container mx-auto p-3 lg:px-20">
        <div className="relative bg-[url('/flower-bg.jpg')] bg-no-repeat bg-cover bg-center rounded-lg h-80 my-16">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent rounded-lg"></div>
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 z-10">
          <h1 className="text-8xl font-bold text-white text-center bg-clip-text  bg-opacity-10 bg-white/70 text-transparent">
            Contact Us
          </h1></div>
        </div>
          <div className="flex flex-col md:flex-row justify-center items-start gap-12 p-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-rose-500 text-2xl font-semibold mb-4">Contact Details</h2>
              
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L12 21l-5.657-4.343C4.222 15.11 3 12.667 3 10a9 9 0 1118 0c0 2.667-1.222 5.11-3.343 6.657z"/>
                    </svg>
                  </span>
                  <h3 className="text-rose-500 font-semibold">Our Location</h3>
                </div>
                <p className="text-gray-700 ml-7">
                  Stall #34 Dangwa Hawkers, Dos Castillas St. Sampaloc<br/>
                  Manila
                </p>
              </div>
              
             
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5.75V7.5a11.25 11.25 0 0011.25 11.25h1.75m0 0l3.5-3.5a2.25 2.25 0 000-3.182l-1.066-1.066a2.25 2.25 0 00-3.182 0l-1.782 1.782"/>
                    </svg>
                  </span>
                  <h3 className="text-rose-500 font-semibold">Call Us</h3>
                </div>
                <p className="text-gray-700 ml-7">
                  09076379814<br/>
                  0995450418<br/>
                  09938664246
                </p>
              </div>
              
             
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l6-6m-6 0l-6 6m6-6v18"/>
                    </svg>
                  </span>
                  <h3 className="text-rose-500 font-semibold">Our Email</h3>
                </div>
                <p className="text-gray-700 ml-7">irish_rina@yahoo.com</p>
              </div>
            </div>
            
          
            <div className="w-full md:w-1/2">
              <h2 className="text-rose-500 text-2xl font-semibold mb-4">Send Us a Message</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
                <button
                  type="submit"
                  className="w-full p-3 bg-rose-500/70 text-white font-semibold rounded-md hover:bg-rose-600 transition"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default ContactUs;