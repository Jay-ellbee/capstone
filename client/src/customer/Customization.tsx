import React, { useState } from 'react';

import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const arrangementTypes = ["filler", "flower", "leaves"] as const;
type ArrangementType = typeof arrangementTypes[number];

const Customization = () => {
  const [selectedType, setSelectedType] = useState<ArrangementType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const handleSelect = (value: ArrangementType) => {
    setSelectedType(value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-20">
      <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                          </span>
                        </Button>
                      </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*Second row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Product Name:
                              </Label>
                              <Input id="name" placeholder="Enter product name" className="col-span-5" />
                            </div>
                            {/*Third row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label htmlFor="arrangementType" className="block mb-1 text-gray-700">
                                Product Type
                              </Label>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Input
                                    id="arrangementType"
                                    placeholder="Select type"
                                    value={selectedType || ""}
                                    className="w-full p-2 border rounded-lg focus:outline-none col-span-2"
                                    readOnly
                                  />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full p-1">
                                  {arrangementTypes.map((type) => (
                                    <DropdownMenuItem
                                      key={type}
                                      onClick={() => handleSelect(type)}
                                      className="capitalize cursor-pointer"
                                    >
                                      {type}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                                <Label className="text-left">
                                  Variant Name:
                                </Label>
                                <Input id="variant_name" placeholder="Enter color" className="col-span-2" />
                            </div>
                            {/*Fourth row */}
                            <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Variant Color:
                              </Label>
                              <Input id="var_color" placeholder="Enter product id" className="col-span-2" />
                              <Label className="text-left">
                                Price:
                              </Label>
                              <Input id="price" placeholder="0.00" className="col-span-2" />
                              </div>
                              <div className="grid grid-cols-6 items-center gap-4">
                              <Label className="text-left">
                                Stock:
                              </Label>
                              <Input id="variant" placeholder="Enter product variant" className="col-span-2" />
                              <Label className="text-left">
                                Shelf Life:
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="col-span-2 pl-3 text-left font-normal"
                                  >
                                    {selectedDate ? (
                                      format(selectedDate, "yyyy-MM-dd")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Customization;
