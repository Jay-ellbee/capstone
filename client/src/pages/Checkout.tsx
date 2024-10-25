import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
//import Footer from '@/components/Footer'; // Reusable footer component
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"


const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, addToCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isAgreed, setIsAgreed] = useState(false); // State to manage the agreement checkbox
  const [canAgree, setCanAgree] = useState(false); // New state to control the checkbox availability


  // Temporary sample item for testing
  if (cartItems.length === 0) {
    addToCart({ id: 1, name: "Bouquet", price: 3200, quantity: 2, image: "/2doz-Ecuador-roses-Php6000.jpg" });
  }

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    address2: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };
  
  const handlePaymentChange = (method: string) => {
    setSelectedPayment(method);
    setCanAgree(true); // Enable the checkbox when a payment method is selected
  };


  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  const handlePlaceOrder = () => {
    if (isAgreed && selectedPayment) {
      // Implement order submission logic here
      alert('Proceeding to payment...');
    } else {
      alert('Please agree to the terms and conditions before placing the order.');
    }
  };

  const [currentDate] = useState(new Date().toLocaleDateString());

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-20">
        {/*first row - containts the search bar */}
        <h1 className="text-2xl font-bold my-6">Billing Details</h1>

        {/*second row containing the two columns */}
        <div className="grid grid-cols-3 gap-8 mx-auto">
           {/* Billing Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md col-span-2">
            <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="First name"
                name="firstName"
                value={billingDetails.firstName}
                onChange={handleInputChange}
              />
              <Input 
                placeholder="Last name"
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
              />
            </div>
            <Input 
              placeholder="Company name (optional)"
              name="companyName"
              value={billingDetails.companyName}
              onChange={handleInputChange}
            />
            <Input 
              placeholder="Street address"
              name="address"
              value={billingDetails.address}
              onChange={handleInputChange}
            />
            <Input 
              placeholder="Apartment, suite, unit, etc. (optional)"
              name="address2"
              value={billingDetails.address2}
              onChange={handleInputChange}
            />
            <Input 
              placeholder="Town / City"
              name="city"
              value={billingDetails.city}
              onChange={handleInputChange}
            />
            <Input 
              placeholder="ZIP Code"
              name="zip"
              value={billingDetails.zip}
              onChange={handleInputChange}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="Phone"
                name="phone"
                value={billingDetails.phone}
                onChange={handleInputChange}
              />
              <Input 
                placeholder="Email address"
                name="email"
                value={billingDetails.email}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              placeholder="Order notes (optional)"
              name="notes"
              value={billingDetails.notes}
              onChange={(e) => setBillingDetails({ ...billingDetails, notes: e.target.value })}
              className="w-full p-3 border rounded-sm"
              rows={3}
            />
            <div className="text-center mt-4 text-sm">
              <span>Already have an account? <a href="/login" className="text-blue-500">Login</a></span>
              <span> or <a href="/signup" className="text-blue-500">Sign Up</a></span>
            </div>
          </form>
            </div>

            
            
                {cartItems.length === 0 ? (
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
                            {cartItems.map((item, index) => (
                              <TableRow key={index} className="border-t">
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">₱{(item.price * item.quantity).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-t">
                              <TableCell>Subtotal</TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right">₱{getTotalPrice().toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                {/* Total Calculation */}
                                <TableCell><h2 className="text-xl font-semibold mt-6">Total:</h2></TableCell>
                                <TableCell></TableCell>
                                <TableCell><h2 className="text-xl font-semibold mt-6 text-right">₱{getTotalPrice().toFixed(2)}</h2></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                    {/* Payment Message */}
                    <div className="mt-4 text-sm">
                      <p>Make your payment directly into our bank account. Please see your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                    </div>
                
                       {/* Payment Method */}
                  <div className="mt-4">
                    <h3 className="font-bold text-lg">Payment Method</h3>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          onChange={() => handlePaymentChange('bank')}
                        />
                        <span>Credit/Debit Cards</span>
                      </label>
                      {selectedPayment === 'bank' && (
                        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
                          <p><strong>Bank Deposit:</strong></p>
                          <p>Bank: BPI Savings Bank</p>
                          <p>Account Name: Irish P. Hermano</p>
                          <p>Account no.: 3099220235</p>
                          <p className="mt-2">Bank: BDO UNIBANK</p>
                          <p>Account Name: Irish P. Hermano</p>
                          <p>Account no.: 007280069379</p>
                        </div>
                      )}

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="mobile"
                          onChange={() => handlePaymentChange('mobile')}
                        />
                        <span>Mobile Payment (GCash, Maya, Paypal)</span>
                      </label>
                      {selectedPayment === 'mobile' && (
                        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
                          <p><strong>Mobile Payments:</strong></p>
                          <p>GoTyme</p>
                          <p>Mobile no.: 0159 8044 0410</p>
                          <p>GCash</p>
                          <p>Mobile no.: 09954501418</p>
                          <p>MAYA</p>
                          <p>Mobile no.: 09954501418</p>
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Payment Message */}
                    <div className="mt-4 text-sm">
                      <p>Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our <span className="font-semibold">privacy policy.</span></p>
                    </div>

                    {/* Agree Checkbox */}
                    <div className="mt-8">
                    <input
                      type="checkbox"
                      id="agree"
                      className="mr-2"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      disabled={!selectedPayment} // Disable if no payment method is selected
                    />
                      <label htmlFor="agree">
                        I have read and agree to the website <a href="/terms" className="text-blue-500">terms and conditions</a>
                      </label>
                    </div>

                      </CardContent>
                      <CardFooter className="flex flex-row bg-muted/50 justify-center p-0">
                      <Dialog>
                        <DialogTrigger disabled={!isAgreed} className="w-full bg-black text-white rounded hover:bg-gray-800 transition-colors items-center p-3" onClick={handlePlaceOrder}> 
                          <button 
                                 >
                                Place Order
                                </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md mx-auto text-center">
                                <div className="flex flex-col items-center">
                                  <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                                  <DialogTitle className="text-xl font-bold">Thank you for your order!</DialogTitle>
                                  <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
                                    Your order has been successfully placed and is now being processed. If you have any questions, feel free to contact our support team. Thanks for shopping with us!
                                  </DialogDescription>
                                </div>
                                {cartItems.map((item, index) => (
                                <div className="flex items-center justify-start p-4 bg-gray-100 rounded-md mt-4" key={index}>
                                  <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                                  <div className="text-left">
                                    <p className="text-md font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Purchase Date: {currentDate}</p>
                                    <p className="text-sm text-muted-foreground">Order Number: {item.id}</p>
                                    <p className="text-sm text-muted-foreground">Amount: ₱{getTotalPrice().toFixed(2)}</p>
                                  </div>
                                </div>
                                ))}
                                 <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
                                    For further inquiries about your order, please contact us throught our social media accounts. Just present your Order ID and reference ID of the payment.
                                  </DialogDescription>
                                <DialogFooter className="mt-6">
                                  <Button variant="outline" onClick={() => alert('Proceeding to confirmation')}>Okay</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog> 
                          </CardFooter>
                    </Card>
              )}
             
            {/* Cancel Button */}
            <div className="col-span-3 flex justify-start mt-6">
              <Link to="/cart">
                <Button variant="outline">Cancel</Button></Link>
              </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};


export default Checkout;
