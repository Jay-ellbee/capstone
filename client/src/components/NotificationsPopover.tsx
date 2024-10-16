import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, CircleUser, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface Notification {
    id: string;
    name: string;
    message: string;
    phone: string;
    email: string;
  }
  
  // Define the props for the NotificationsPopover component
  interface NotificationsPopoverProps {
    notifications: Notification[];
  }
  

// Ensure this is a functional component and not a regular function
const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-200">
          <Bell className="h-6 w-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li key={notification.id} className="text-sm text-gray-600">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`notification-${notification.id}`}>
                    <AccordionTrigger className="flex justify-between items-center">
                      <div className="grid grid-cols-5 items-center gap-4">
                        <div className="col-span-1">
                          <CircleUser className="h-5 w-5" />
                        </div>
                        <div className="col-span-4">
                          <span className="font-bold">{notification.name}</span>
                          <span className="m-2">{notification.message}</span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="mt-2 space-y-1">
                        <p><strong>Name:</strong> {notification.name}</p>
                        <p><strong>Phone:</strong> {notification.phone}</p>
                        <p><strong>Email:</strong> {notification.email}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No notifications</p>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
