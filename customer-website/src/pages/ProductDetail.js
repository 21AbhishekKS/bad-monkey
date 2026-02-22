import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { SIZES } from '../config/payment';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeSystem, setSizeSystem] = useState('UK');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert('Product not found');
          navigate('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.stock <= 0) {
      alert('Sorry, this product is out of stock');
      return;
    }
    if (product) {
      addToCart(product, quantity, selectedSize);
      alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  // Get available sizes for selected system
  const availableSizes = product.availableSizes?.[sizeSystem] || SIZES[sizeSystem];

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square bg-white border border-border overflow-hidden p-4 md:p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-brand-primary font-subheading text-xs tracking-widest uppercase">
              {product.category} • {product.gender}
            </span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-white mb-6">
            {product.name}
          </h1>

          <div className="mb-8">
            <span className="inline-block bg-brand-primary text-black px-6 py-3 text-3xl font-bold">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <p className="text-neutral-500 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mb-8">
            <label className="font-subheading text-white text-sm tracking-widest uppercase mb-3 block">
              SELECT SIZE *
            </label>
            
            {/* Size System Tabs */}
            <div className="flex gap-2 mb-4">
              {['UK', 'US', 'EU'].map(system => (
                <button
                  key={system}
                  onClick={() => {
                    setSizeSystem(system);
                    setSelectedSize('');
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 font-subheading text-xs tracking-wider uppercase transition-all ${
                    sizeSystem === system
                      ? 'bg-brand-primary text-black'
                      : 'bg-surface text-white border border-border hover:border-brand-primary'
                  }`}
                >
                  {system}
                </button>
              ))}
            </div>

            {/* Size Options */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 md:py-3 font-subheading text-sm tracking-wider transition-all ${
                    selectedSize === size
                      ? 'bg-brand-primary text-black'
                      : 'bg-surface text-white border border-border hover:border-brand-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-brand-primary text-sm mt-2">
                Selected: {sizeSystem} {selectedSize}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="font-subheading text-white text-sm tracking-widest uppercase mb-3 block">
              QUANTITY
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-white text-xl font-bold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-5 hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            ADD TO CART
          </button>

          <div className="mt-8 p-6 border border-border">
            <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-4">
              PRODUCT INFO
            </h3>
            <div className="space-y-2 text-neutral-500 text-sm">
              <p>• 100% Authentic imported product</p>
              <p>• Premium quality materials</p>
              <p>• In stock: {product.stock} units</p>
              <p>• Contact for size availability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
