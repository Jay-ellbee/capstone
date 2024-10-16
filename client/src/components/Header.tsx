import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, CircleUser, Package2, Home, ShoppingCart, Package, Users2, CreditCard, LineChart, Bell,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useAuth } from '@/context/AuthContext'; // Adjust the path to your AuthContext
import { useNavigate } from 'react-router-dom';

import NotificationsPopover from './NotificationsPopover';

const Header: React.FC = () => {
    const [notifications] = useState([
        {
            id: '1',
            name: 'John Doe',
            message: 'New order placed',
            phone: '123-456-7890',
            email: 'john@example.com',
          },
          {
            id: '2',
            name: 'Jane Smith',
            message: 'Your order has been shipped',
            phone: '987-654-3210',
            email: 'jane@example.com',
          },
      ]);

      const { logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = () => {
        logout();  // Call the logout function to clear session data
        navigate('/login');  // Redirect the user to the login page after logging out
      };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/admin/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  to="/admin/inventory"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Inventory
                </Link>
                <Link
                  to="/admin/customers"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  to="/admin/transactions"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <CreditCard className="h-5 w-5" />
                  Transactions
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            to="/admin/dashboard"
            className="text-foreground transition-colors hover:text-foreground bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            La Primera Nene's Flower Shop
          </Link>
          {/*Search Bar */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>

        <NotificationsPopover notifications={notifications}/>

          {/*Avatar as trigger for the dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><button onClick={handleLogout}>
                  Logout
                </button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </header>
  );
};

export default Header;
