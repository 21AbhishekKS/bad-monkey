import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const cartItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const response = await axios.post(`${API}/checkout/session`, {
        cart_items: cartItems,
        origin_url: originUrl
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div data-testid="checkout-page" className="pt-32 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto min-h-screen">
      <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-12">
        <span className="text-brand-primary">CHECKOUT</span>
      </h1>

      <div className="bg-surface border border-border p-8 mb-8">
        <h2 className="font-subheading text-white text-lg tracking-widest uppercase mb-6">
          ORDER SUMMARY
        </h2>

        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <div key={item.id} data-testid={`checkout-item-${item.id}`} className="flex justify-between text-neutral-500">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 flex justify-between text-white text-2xl font-bold mb-8">
          <span>Total</span>
          <span data-testid="checkout-total">₹{getCartTotal().toLocaleString()}</span>
        </div>

        <div className="bg-background p-6 border border-border mb-6">
          <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-4">
            PAYMENT INFORMATION
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            You will be redirected to our secure payment gateway to complete your purchase. We accept all major credit cards, debit cards, and digital payment methods.
          </p>
        </div>

        <button
          data-testid="proceed-payment-button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-5 hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              PROCESSING...
            </>
          ) : (
            'PROCEED TO PAYMENT'
          )}
        </button>
      </div>

      <div className="text-center text-neutral-500 text-sm">
        <p>Secure payment powered by Stripe</p>
      </div>
    </div>
  );
};

export default Checkout;