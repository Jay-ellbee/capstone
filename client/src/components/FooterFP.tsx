import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-rose-950/80 text-white py-6 px-8 rounded-t-3xl mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">La Primera Nene Flower Shop</h2>
          <div className="flex space-x-4 mb-4">
            <Link to="#" className="hover:text-white">
              <Twitter />
            </Link>
            <Link to="#" className="hover:text-white">
              <Instagram />
            </Link>
            <Link to="#" className="hover:text-white">
              <Facebook />
            </Link>
            <Link to="#" className="hover:text-white">
              <Linkedin />
            </Link>
          </div>
          <p className="text-sm">
          Dangwa Stall 34 Dos Castillas Street Sampaloc Manila
          </p>
        </div>

        {/* Menu Links */}
        <div>
          <h3 className="text-white font-bold mb-4">MENU</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link to="/customization" className="hover:text-white">
                Customization
              </Link>
            </li>
          </ul>
        </div>

        {/* Pages Links */}
        <div>
          <h3 className="text-white font-bold mb-4">PAGES</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about-us" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Services
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-bold mb-4">CONTACT US</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Mail />
              <span>Email irish_rina@yahoo.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone />
              <span>Phone (+63) 995 450 1418</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto mt-8 border-t border-gray-700 pt-6 flex justify-between items-center">
        <span className="text-sm">
          &copy; {new Date().getFullYear()} laprimeraneneflowershop
        </span>
        <div className="flex space-x-4">
          <img src="/images/paypal.png" alt="PayPal" className="h-8"/>
          <img src="/images/stripe.png" alt="Stripe" className="h-8"/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;