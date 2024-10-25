import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
//import Footer from '@/components/Footer'; // Reusable footer component
import { Link } from 'react-router-dom';
import { Menu, Search, CircleUser, Package2, Home, ShoppingCart, Package, BoxesIcon, Flower, MoreHorizontal, CircleHelp } from 'lucide-react';

const HeaderFP: React.FC = () => {
    return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-rose-200 px-4 sm:px-6 space-between">
    <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-16 h-[50%] flex flex-col items-center justify-start gap-4 py-4 rounded-br-full">
          <nav className="flex flex-col items-center gap-6">
            <Link
              to="/"
              className="text-muted-foreground"
            >
              <div className="h-5 w-5" />
            </Link>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/products"
                className="text-foreground"
              >
                <BoxesIcon className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/products"
                className="text-muted-foreground hover:text-foreground"
              >
                <Package className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="default" variant="ghost" className="ml-auto gap-1 text-black hover:bg-rose-200 rounded-full">
              <Link
                to="/about-us"
                className="text-muted-foreground hover:text-foreground"
              >
                <CircleHelp className="h-5 w-5" />
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <Link
        to="/"
        className="text-foreground transition-colors hover:text-foreground bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <Flower className="h-6 w-6" />
      </Link>
       {/* Right Side - Buttons */}
       <div className="flex justify-end items-center space-x-4 ml-auto">
                {/* Larger screens */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button asChild size="sm" variant="ghost">
                        <Link to="/products">Products</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                        <Link to="/about-us">About Us</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                        <Link to="/contact-us">Contact</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                        <a href="/#services">Services</a>
                    </Button>
                </div>

                {/* Popover for smaller screens */}
                <div className="md:hidden">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-5 w-5" />
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
                                    <a href="#services">Services</a>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Shopping Cart and Bell Icon - Always visible */}
                <Button asChild size="sm" variant="ghost">
                    <Link to="/cart" className="text-muted-foreground hover:text-foreground">
                        <ShoppingCart className="h-5 w-5" />
                    </Link>
                </Button>

                {/* User Icon - Redirect to Login */}
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Link to="/login">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Link>
                </Button>
            </div>
      </header>
    )
}

export default HeaderFP;