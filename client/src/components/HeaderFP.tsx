import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, Search, CircleUser, Home, ShoppingCart, BoxesIcon, Package, CircleHelp, MoreHorizontal, Flower, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

type CustomerName = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

const HeaderFP: React.FC = () => {
  const { role } = useAuth(); // useAuth to access the role
  const isCustomer = role === 'customer';
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerName | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError('Unable to load customer data.');
      }
    };

   fetchCustomerData();
 }, [navigate]);


  const handleLogout = () => {
    logout();  // Call the logout function to clear session data
    navigate('/');  // Redirect the user to the login page after logging out
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-rose-200 px-4 sm:px-6 space-between opacity-90 rounded-b">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="h-7 w-7" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-16 h-[50%] flex flex-col items-center justify-start gap-4 py-4 rounded-br-full">
        <nav className="flex flex-col items-center gap-6">
            <Link
              to="/"
              className="text-muted-foreground"
            >
              <div className="h-7 w-7" />
            </Link>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="h-7 w-7" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/products"
                className="text-foreground"
              >
                <BoxesIcon className="h-7 w-7" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/services"
                className="text-muted-foreground hover:text-foreground"
              >
                <Package className="h-7 w-7" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/about-us"
                className="text-muted-foreground hover:text-foreground"
              >
                <CircleHelp className="h-7 w-7" />
              </Link>
            </Button>
            {isCustomer ? (
               <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
               <Link
                 to="/customization"
                 className="text-muted-foreground hover:text-foreground"
               >
                 <Sparkles className="h-7 w-7" />
               </Link>
             </Button>
            ) : (
              <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full hidden">
               <Link
                 to="/customization"
                 className="text-muted-foreground hover:text-foreground"
               >
                 <Sparkles className="h-7 w-7" />
               </Link>
             </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <Link to="/" className="text-foreground transition-colors hover:text-foreground bg-primary text-lg font-semibold text-primary-foreground md:text-base">
        <Flower className="h-7 w-7"/>
      </Link>

      {/* Right Side - Buttons */}
      <div className="flex justify-end items-center space-x-4 ml-auto">
                {/* Larger screens */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button asChild size="default" variant="ghost" className="hover:bg-white/30">
                        <Link to="/products">Products</Link>
                    </Button>
                    <Button asChild size="default" variant="ghost" className="hover:bg-white/30">
                        <Link to="/about-us">About Us</Link>
                    </Button>
                    <Button asChild size="default" variant="ghost" className="hover:bg-white/30">
                        <Link to="/contact-us">Contact</Link>
                    </Button>
                    <Button asChild size="default" variant="ghost" className="hover:bg-white/30">
                        <Link to="/services">Services</Link>
                    </Button>
                </div>

                {/* Popover for smaller screens */}
                <div className="md:hidden">
                    <Popover>
                        <PopoverTrigger asChild className="hover:bg-white/30">
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-7 w-7" />
                                <span className="sr-only">More Options</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="p-4 bg-white rounded-md shadow-lg">
                            <div className="flex flex-col space-y-2">
                                <Button asChild size="sm" variant="ghost">
                                    <Link to="/products">Products</Link>
                                </Button>
                                <Button asChild size="sm" variant="ghost">
                                    <Link to="/">About Us</Link>
                                </Button>
                                <Button asChild size="sm" variant="ghost">
                                    <Link to="/contact-us">Contact</Link>
                                </Button>
                                <Button asChild size="sm" variant="ghost">
                                    <Link to="/services">Services</Link>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

         {/* Shopping Cart - Always visible */}
         <Button asChild size="sm" variant="ghost">
                    <Link to="/cart" className="text-muted-foreground hover:bg-white/30">
                        <ShoppingCart className="h-6 w-6" />
                    </Link>
                </Button>

        {/* User Icon */}
        {isCustomer ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="secondary" size="icon" className="rounded-full">
                <Link to="/profile">
                  <Avatar className="w-8 h-8 flex items-center justify-center">
                    <AvatarFallback className="text-sm font-semibold text-center leading-tight">{customerData?.firstName[0]}{customerData?.lastName[0]}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel><Link to="/profile">My Account</Link></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><button onClick={handleLogout}>
                  Logout
                </button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="secondary" size="icon" className="rounded-full">
            <Link to="/login">
              <CircleUser className="h-6 w-6" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default HeaderFP;
