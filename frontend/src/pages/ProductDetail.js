import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div data-testid="product-detail-page" className="pt-32 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-square bg-surface border border-border overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-4">
            <span className="text-brand-primary font-subheading text-xs tracking-widest uppercase">
              {product.category} • {product.gender}
            </span>
          </div>
          
          <h1 data-testid="product-name" className="font-heading text-4xl md:text-5xl font-bold uppercase text-white mb-6">
            {product.name}
          </h1>

          <div className="mb-8">
            <span data-testid="product-price" className="inline-block bg-brand-primary text-black px-6 py-3 text-3xl font-bold">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <p data-testid="product-description" className="text-neutral-500 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-8">
            <label className="font-subheading text-white text-sm tracking-widest uppercase mb-3 block">
              QUANTITY
            </label>
            <div className="flex items-center gap-4">
              <button
                data-testid="quantity-decrease"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span data-testid="quantity-display" className="text-white text-xl font-bold w-12 text-center">
                {quantity}
              </span>
              <button
                data-testid="quantity-increase"
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            data-testid="add-to-cart-button"
            onClick={handleAddToCart}
            className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-5 hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            ADD TO CART
          </button>

          <div className="mt-8 p-6 border border-border">
            <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-4">PRODUCT INFO</h3>
            <div className="space-y-2 text-neutral-500 text-sm">
              <p>• 100% Authentic imported product</p>
              <p>• Premium quality materials</p>
              <p>• Available for in-store pickup</p>
              <p>• Contact us for size availability</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;