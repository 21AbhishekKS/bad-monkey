import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in Firestore
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        total: getCartTotal(),
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        status: 'pending',
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Navigate to success page with order ID
      navigate(`/checkout/success?orderId=${docRef.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto min-h-screen">
      <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-12">
        <span className="text-brand-primary">CHECKOUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleCheckout} className="space-y-6">
            <h2 className="font-subheading text-white text-lg tracking-widest uppercase mb-4">
              CUSTOMER DETAILS
            </h2>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">
                FULL NAME *
              </label>
              <input
                type="text"
                name="name"
                value={customerData.name}
                onChange={handleChange}
                required
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">
                EMAIL *
              </label>
              <input
                type="email"
                name="email"
                value={customerData.email}
                onChange={handleChange}
                required
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">
                PHONE *
              </label>
              <input
                type="tel"
                name="phone"
                value={customerData.phone}
                onChange={handleChange}
                required
                pattern="[0-9+\-\s()]+"
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-5 hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PLACING ORDER...
                </>
              ) : (
                'PLACE ORDER'
              )}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-surface border border-border p-6 sticky top-32">
            <h2 className="font-subheading text-white text-lg tracking-widest uppercase mb-6">
              ORDER SUMMARY
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-neutral-500">
                    {item.name} x {item.quantity} (Size: {item.size})
                  </span>
                  <span className="text-white">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex justify-between text-white text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-brand-primary">₹{getCartTotal().toLocaleString()}</span>
            </div>

            <div className="text-neutral-500 text-xs">
              <p>✓ Secure checkout</p>
              <p>✓ No payment gateway charges</p>
              <p>✓ Pay via UPI after order confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;