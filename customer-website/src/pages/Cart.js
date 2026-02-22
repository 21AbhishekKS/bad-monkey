import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 px-4 min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag className="w-24 h-24 text-neutral-500 mb-6" />
        <h2 className="font-heading text-3xl font-bold text-white mb-4">YOUR CART IS EMPTY</h2>
        <p className="text-neutral-500 mb-8">Add some fresh kicks to your collection</p>
        <Link to="/shop" className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all">
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-12">
        <span className="text-brand-primary">SHOPPING</span>
        <span className="text-white ml-2">CART</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="bg-surface border border-border p-4 md:p-6 flex gap-6">
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 object-cover border border-border" />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-subheading text-white text-base md:text-lg tracking-wider uppercase hover:text-brand-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-neutral-500 text-sm mt-1">{item.category} • {item.gender} • Size: {item.size}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-brand-primary font-bold text-lg">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button onClick={() => removeFromCart(item.id, item.size)}
                      className="text-neutral-500 hover:text-brand-secondary transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border p-6 sticky top-32">
            <h2 className="font-subheading text-white text-lg tracking-widest uppercase mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-brand-primary">FREE</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="block w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all mb-4 text-center">
              PROCEED TO CHECKOUT
            </Link>

            <Link to="/shop" className="block w-full text-center border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black hover:border-white transition-all">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;