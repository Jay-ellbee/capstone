import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CartItem } from '../context/CartContext';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";


interface CustomJwtPayload extends JwtPayload {
  user_id: string;
  role: string; // Add other properties like 'role' if necessary
}

const Checkout: React.FC = () => {
  const [orderConfirmation, setOrderConfirmation] = useState<string[]>([]); // Initialize as an empty array
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    address2: '',
    city: '',
    zip: '',
    recipient: '',
    phone: '',
    email: '',
    notes: '',
    referenceId: '',
  });
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] as CartItem[] };

  const handleOpenFirstDialog = () => setIsFirstDialogOpen(true);
  const handleCloseFirstDialog = () => setIsFirstDialogOpen(false);

  const handleFirstDialogSubmit = () => {
    setIsFirstDialogOpen(false); // Close the first dialog
    setIsSecondDialogOpen(true); // Open the second dialog
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setBillingDetails({
            ...billingDetails,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            address: data.address,
          });
        }
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (method: string) => {
    setSelectedPayment(method);
  };

  const handleDeliveryChange = (method: string) => {
    setSelectedDelivery(method);
  };

  const handlePlaceOrder = async () => {
    const token = sessionStorage.getItem('token');
    let userId = null;

if (token) {
  // Use the custom interface here
  const decoded = jwtDecode<CustomJwtPayload>(token);
  userId = decoded.user_id; // TypeScript now recognizes 'user_id' as valid
}

    console.log(userId);

    const payload = {
      referenceId: billingDetails.referenceId,
      registered_customer_id: userId || null,
      rec_name: billingDetails.recipient,
      address: `${billingDetails.address} ${billingDetails.address2}, ${billingDetails.city}, ${billingDetails.zip}`,
      customer_name: `${billingDetails.firstName} ${billingDetails.lastName}`,
      phone: billingDetails.phone,
      email: billingDetails.email,
      notes: billingDetails.notes,
      delivery_method: selectedDelivery,
      orderDetails: selectedItems.map((item: CartItem) => ({
        arrangement_id: item.id,
        quantity: item.quantity,
        delivery_date: selectedDate ? selectedDate.toLocaleDateString('en-CA') : null,
      })),
    };

    if (isAgreed && selectedPayment && selectedDelivery) {
      try {
        const response = await fetch('/api/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Backend response:", result); // Debugging line
          setOrderConfirmation(result.orderIds || []);
          alert('Order placed successfully');
        } else {
          const errorData = await response.json();
          alert(`Order failed: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
      }
    } else {
      alert('Please agree to the terms and conditions before placing the order.');
    }
  };

console.log(orderConfirmation);

const [files, setFiles] = useState<File[] | null>([]);
const dropzone = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  multiple: true,
  maxFiles: 4,
  maxSize: 1 * 1024 * 1024,
} satisfies DropzoneOptions;

const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [previewImage, setPreviewImage] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(false);


const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  setUploadedFile(file);
  setPreviewImage(URL.createObjectURL(file));

  try {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post("http://127.0.0.1:5000/ocr", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("OCR Response:", response.data);

    if (response.data?.transaction_id) {
      // Extract the transaction_id and trim whitespace
      setBillingDetails((prev) => ({
        ...prev,
        referenceId: response.data.transaction_id.trim(),
      }));
    } else {
      alert("Unable to extract transaction ID from the uploaded image. Please try again.");
    }
  } catch (error) {
    console.error("Error processing image for OCR:", error);
    alert("Failed to process the image. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      <HeaderFP />
      <main className="container mx-auto p-3 md:px-6 lg:px-10">
        <h1 className="text-2xl font-bold my-6 text-center sm:text-left">Billing Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md lg:col-span-2">
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="First name" name="firstName" value={billingDetails.firstName} onChange={handleInputChange} />
                <Input placeholder="Last name" name="lastName" value={billingDetails.lastName} onChange={handleInputChange} />
              </div>
              <Input placeholder="Company name (optional)" name="companyName" value={billingDetails.companyName} onChange={handleInputChange} />
              <Input placeholder="Street address" name="address" value={billingDetails.address} onChange={handleInputChange} />
              <Input placeholder="Apartment, suite, etc. (optional)" name="address2" value={billingDetails.address2} onChange={handleInputChange} />
              <Input placeholder="Town / City" name="city" value={billingDetails.city} onChange={handleInputChange} />
              <Input placeholder="ZIP Code" name="zip" value={billingDetails.zip} onChange={handleInputChange} />
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Phone" name="phone" value={billingDetails.phone} onChange={handleInputChange} />
                <Input placeholder="Email address" name="email" value={billingDetails.email} onChange={handleInputChange} />
              </div>
              <Input placeholder="Recipient's Name" name="recipient" value={billingDetails.recipient} onChange={handleInputChange} />
              <textarea placeholder="Order notes (optional)" name="notes" value={billingDetails.notes} onChange={handleInputChange} className="w-full p-3 border rounded-sm" rows={3} />

              {/* Delivery Method & Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-5 my-auto">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="pickup" onChange={() => handleDeliveryChange('pickup')} />
                    <span>Pick Up</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="deliver" onChange={() => handleDeliveryChange('delivery')} />
                    <span>Delivery</span>
                  </label>
                </div>
                <div className="rounded-md border shadow p-2 py-auto">
                  <Calendar className="mx-auto" mode="single" selected={selectedDate} onSelect={(date) => setSelectedDate(date)} />
                  <p className="mt-2 text-center text-sm">Selected Date: {selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          {/* <Card className="overflow-hidden rounded-lg shadow-md">
            <CardHeader className="px-5 md:px-7">
              <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:px-6 pt-0 text-sm">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty. Please add items to your cart before checking out.</p> */}
            
            {selectedItems.length === 0 ? (
              <Card
                  className="overflow-hidden rounded-lg shadow-md col-span-1" x-chunk="dashboard-05-chunk-4">
                  <CardHeader className="px-7">
                      <CardTitle className="group flex items-center text-xl font-semibold">
                        Order Summary
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-sm">
                  <p className="text-gray-500">Your cart is empty. Please add items to your cart before checking out.</p>
                  </CardContent>
                  </Card>
              ) : (
                <Card
                  className="overflow-hidden rounded-lg shadow-md col-span-1" x-chunk="dashboard-05-chunk-4">
                  <CardHeader className="px-7">
                      <CardTitle className="group flex items-center text-xl font-semibold">
                        Order Summary
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-sm">
                  <Table className="w-full mb-4 border-b-2 border-gray-200">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItems.map((item: CartItem) => (
                        <TableRow key={item.id} className="border-t">
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right"> {(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t">
                        <TableCell>Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right">₱{selectedItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><h2 className="text-xl font-semibold mt-6">Total:</h2></TableCell>
                        <TableCell></TableCell>
                        <TableCell><h2 className="text-xl font-semibold mt-6 text-right">₱{selectedItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0).toFixed(2)}</h2></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Payment Message */}
                  <div className="mt-4 mb-2text-sm">
                      <p>Make your payment directly into our bank account. Please see your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                    </div>

                  {/* Payment Options */}
                  <div className="mt-4">
                    <h3 className="font-bold text-lg">Payment Method</h3>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" value="bank" onChange={() => handlePaymentChange('bank')} />
                        <span>Credit/Debit Cards</span>
                      </label>
                      {selectedPayment === 'bank' && (
                        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
                          <p><strong>Bank Deposit:</strong></p>
                          <p>Bank: BPI Savings Bank</p>
                          <p>Account Name: Irish P. Hermano</p>
                          <p>Account no.: 3099220235</p>
                        </div>
                      )}

                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" value="mobile" onChange={() => handlePaymentChange('mobile')} />
                        <span>Mobile Payment (GCash, Maya, Paypal)</span>
                      </label>
                      {selectedPayment === 'mobile' && (
                        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
                          <p><strong>Mobile Payments:</strong></p>
                          <p>GoTyme Mobile no.: 0159 8044 0410</p>
                          <p>GCash Mobile no.: 09954501418</p>
                        </div>
                      )}
                      {selectedDelivery === 'pickup' && (
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="payment" value="cod" onChange={() => handlePaymentChange('cod')} />
                          <span>Cash on Delivery (COD)</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Payment Message */}
                  <div className="mt-4 text-sm">
                      <p>Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our <span className="font-semibold">privacy policy.</span></p>
                    </div>

                  {/* Agree to Terms */}
                  <div className="mt-10">
                    <input type="checkbox" id="agree" className="mr-2" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
                    <label htmlFor="agree">I have read and agree to the website <a href="/terms" className="text-blue-500">terms and conditions</a></label>
                  </div>
              
                  </CardContent>

                  <CardFooter className="flex flex-row bg-muted/50 justify-center p-0">
                  <Dialog>
                      {/* Trigger to open the first dialog */}
                      <DialogTrigger disabled={!isAgreed} className="w-full bg-black text-white rounded hover:bg-gray-800 transition-colors p-3" onClick={handleOpenFirstDialog}> 
                        Place Order
                      </DialogTrigger>
                      {/* <Button onClick={handleOpenFirstDialog} disabled={!isAgreed} className="w-full bg-black text-white rounded hover:bg-gray-800 transition-colors p-3">
                        Place Order
                      </Button> */}

                      {/* First Dialog to enter Reference ID */}
                      <Dialog open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
                        <DialogContent className="max-w-md mx-auto text-center">
                          <DialogTitle className="text-xl font-bold">Upload Reference Image</DialogTitle>
                          <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
                            Upload an image of your Reference ID. The text will be extracted automatically.
                          </DialogDescription>

                          {/* File Upload Section */}
                          <div
                            className="border-dashed border-2 rounded-md p-6 flex flex-col items-center justify-center"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer text-center text-muted-foreground"
                            >
                              Drag & Drop your file here or click to upload
                            </label>
                            {previewImage && (
                              <div className="mt-4">
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  className="rounded-md max-h-48"
                                />
                              </div>
                            )}
                            {uploadedFile && (
                              <p className="mt-2 text-sm text-foreground">
                                Uploaded: {uploadedFile.name}
                              </p>
                            )}
                          </div>

                          {/* Prefilled Reference ID Input */}
                          <DialogTitle className="text-xl font-bold mt-6">Enter Reference ID</DialogTitle>
                          <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
                            Confirm or edit the extracted Reference ID.
                          </DialogDescription>
                          <input
                            name="referenceId"
                            value={billingDetails.referenceId}
                            onChange={handleInputChange}
                            placeholder="Reference ID"
                            className="w-full p-2 border rounded-md"
                          />

                          <DialogFooter className="mt-6">
                            <Button
                              variant="outline"
                              onClick={() => {
                                handleFirstDialogSubmit();
                                handlePlaceOrder();
                              }}
                              disabled={!billingDetails.referenceId && !uploadedFile}
                            >
                              Submit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Second Dialog for Order Confirmation */}
                      <Dialog open={isSecondDialogOpen} onOpenChange={setIsSecondDialogOpen}>
                        <DialogContent className="max-w-md mx-auto text-center">
                          <div className="flex flex-col items-center">
                            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                            <DialogTitle className="text-xl font-bold">Thank you for your order!</DialogTitle>
                            <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
                              Your order has been successfully placed and is now being processed. If you have any questions, feel free to contact our support team.
                            </DialogDescription>
                          </div>
                          <div className="order-summary bg-gray-50 p-6 rounded-lg shadow-md">
                              {/* Display each item in the order */}
                              {selectedItems.map((item: CartItem) => (
                                  <div className="flex items-center justify-start p-4 bg-gray-100 rounded-md mb-4" key={item.id}>
                                      <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                                      <div className="text-left">
                                          <p className="text-md font-semibold">{item.name}</p>
                                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                          <p className="text-sm text-muted-foreground">Amount: ₱{(item.price * item.quantity).toFixed(2)}</p>
                                          
                                      </div>
                                  </div>
                              ))}

                              {/* Order Confirmation and Total Amount */}
                              {orderConfirmation.length > 0 && (
                                  <div className="mt-6 p-4 bg-gray-200 rounded-md">
                                      <p className="text-lg font-semibold">Order Confirmation</p>
                                      <p className="text-sm text-muted-foreground font-semibold">
                                          Total Amount: ₱{selectedItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0).toFixed(2)}
                                      </p> <br/>
                                      <p className="text-sm text-muted-foreground">
                                          Order Number(s): {orderConfirmation.join(', ')}
                                      </p><br/>
                                      <p className="text-sm text-muted-foreground">
                                        To get updates regarding your order, please contact us <Link to={"/contact-us"} className="text-blue-500">here</Link>.</p> <br/>
                                        <p className="text-sm text-muted-foreground">Or if you want direct communication, you can chat us at our <a href="https://www.facebook.com/laprimeraaa1" className="text-blue-500">fb page</a>. Just present your order number and our team will get back to you. 
                                      </p>
                                      <br/>
                                      <p className="text-sm text-muted-foreground">Thank you for your order!</p>
                                  </div>
                              )}
                          </div>
                          <DialogFooter className="mt-6">
                            <Link to="/"><Button variant="outline" onClick={() => setIsSecondDialogOpen(false)}>Okay</Button></Link>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </Dialog>
                  </CardFooter>
                </Card>
                )} 
          </div>
     

        {/* Cancel Button */}
        <div className="col-span-3 flex justify-start mt-6">
          <Link to="/cart">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
