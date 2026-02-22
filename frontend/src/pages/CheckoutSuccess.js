import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      navigate('/cart');
      return;
    }

    const pollPaymentStatus = async (attempts = 0) => {
      const maxAttempts = 5;
      const pollInterval = 2000;

      if (attempts >= maxAttempts) {
        setStatus('timeout');
        return;
      }

      try {
        const response = await axios.get(`${API}/checkout/status/${sessionId}`);
        const data = response.data;

        if (data.payment_status === 'paid') {
          setStatus('success');
          setPaymentDetails(data);
          clearCart();
          toast.success('Payment successful!');
          return;
        } else if (data.status === 'expired') {
          setStatus('expired');
          return;
        }

        setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };

    pollPaymentStatus();
  }, [searchParams, navigate, clearCart]);

  if (status === 'checking') {
    return (
      <div data-testid="checking-payment" className="min-h-screen flex flex-col items-center justify-center px-4">
        <Loader2 className="w-16 h-16 text-brand-primary animate-spin mb-6" />
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
          VERIFYING PAYMENT
        </h2>
        <p className="text-neutral-500 text-center">Please wait while we confirm your payment...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div data-testid="payment-success" className="pt-32 pb-24 px-4 min-h-screen flex flex-col items-center justify-center">
        <CheckCircle className="w-24 h-24 text-brand-primary mb-6" />
        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-center mb-4">
          <span className="text-brand-primary">PAYMENT</span>
          <span className="text-white ml-2">SUCCESSFUL!</span>
        </h1>
        <p className="text-neutral-500 text-lg text-center mb-8 max-w-md">
          Thank you for your order! We'll contact you shortly regarding pickup details.
        </p>
        {paymentDetails && (
          <div className="bg-surface border border-border p-6 mb-8 max-w-md w-full">
            <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-4">
              ORDER DETAILS
            </h3>
            <div className="space-y-2 text-neutral-500 text-sm">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="text-brand-primary font-bold">
                  ₹{(paymentDetails.amount_total / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-brand-primary font-bold uppercase">{paymentDetails.payment_status}</span>
              </div>
            </div>
          </div>
        )}
        <button
          data-testid="continue-shopping-button"
          onClick={() => navigate('/shop')}
          className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div data-testid="payment-error" className="pt-32 pb-24 px-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-center mb-4 text-brand-secondary">
        PAYMENT VERIFICATION FAILED
      </h1>
      <p className="text-neutral-500 text-center mb-8 max-w-md">
        We couldn't verify your payment. Please contact us if you were charged.
      </p>
      <button
        onClick={() => navigate('/cart')}
        className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all"
      >
        BACK TO CART
      </button>
    </div>
  );
};

export default CheckoutSuccess;