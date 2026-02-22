import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { PAYMENT_CONFIG } from '../config/payment';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCartTotal, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const orderId = searchParams.get('orderId');
  const totalAmount = getCartTotal();

  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
      return;
    }
    // Clear cart after successful order
    clearCart();
  }, [orderId, navigate, clearCart]);

  // Generate UPI payment string
  const upiString = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.merchantName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;

  const copyUPI = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-24 h-24 text-brand-primary mx-auto mb-6" />
        
        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4">
          <span className="text-brand-primary">ORDER</span>
          <span className="text-white ml-2">PLACED!</span>
        </h1>

        <p className="text-neutral-500 text-lg mb-2">
          Order ID: <span className="text-white font-mono">{orderId}</span>
        </p>
        <p className="text-neutral-500 mb-12">
          Thank you for your order! Please complete the payment to confirm.
        </p>

        <div className="bg-surface border border-brand-primary p-8 mb-8">
          <h2 className="font-subheading text-white text-xl tracking-widest uppercase mb-6">
            SCAN TO PAY
          </h2>

          <div className="bg-white p-6 inline-block mb-6">
            <QRCodeSVG 
              value={upiString} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-brand-primary text-3xl font-bold mb-2">
              ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-neutral-500 text-sm">
              Scan with any UPI app (PhonePe, GPay, Paytm)
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-white font-subheading text-sm tracking-wider uppercase mb-3">
              OR PAY MANUALLY
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="bg-background text-brand-primary px-4 py-2 text-lg font-mono">
                {PAYMENT_CONFIG.upiId}
              </code>
              <button
                onClick={copyUPI}
                className="bg-brand-primary text-black p-2 hover:bg-white transition-all"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border p-6 text-left mb-8">
          <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-4">
            PAYMENT INSTRUCTIONS
          </h3>
          <ol className="text-neutral-500 text-sm space-y-2 list-decimal list-inside">
            <li>Scan the QR code with any UPI app</li>
            <li>Or manually enter UPI ID: <span className="text-brand-primary">{PAYMENT_CONFIG.upiId}</span></li>
            <li>Enter amount: <span className="text-brand-primary">₹{totalAmount.toLocaleString()}</span></li>
            <li>Add note: Order {orderId}</li>
            <li>Complete payment</li>
            <li>Take screenshot of payment confirmation</li>
            <li>We'll contact you via WhatsApp/Phone for order confirmation</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/${PAYMENT_CONFIG.phoneNumber}?text=${encodeURIComponent(`Hi! I've placed order ${orderId} for ₹${totalAmount}. Sharing payment screenshot.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#20BA5A] transition-all"
          >
            SEND PAYMENT PROOF ON WHATSAPP
          </a>
          <button
            onClick={() => navigate('/shop')}
            className="border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        <p className="text-neutral-500 text-xs mt-8">
          Need help? Call us at {PAYMENT_CONFIG.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;