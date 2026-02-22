import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';
import Marquee from '../components/Marquee';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div data-testid="home-page">
      <section
        data-testid="hero-section"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/33544795/pexels-photo-33544795.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold uppercase tracking-tight mb-6">
              <span className="text-white">THE STREET</span>
              <br />
              <span className="text-brand-primary">NEVER SLEEPS</span>
            </h1>
            <p className="text-neutral-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Bengaluru's premier destination for imported sneakers and premium footwear
            </p>
            <Link
              to="/shop"
              data-testid="hero-shop-button"
              className="inline-flex items-center gap-3 bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all"
            >
              SHOP NOW
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Marquee />

      <section data-testid="featured-products-section" className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4">
            <span className="text-brand-primary">FEATURED</span>
            <span className="text-white ml-2">DROPS</span>
          </h2>
          <p className="text-neutral-500 text-lg">Exclusive imported sneakers you won't find anywhere else</p>
        </div>

        {loading ? (
          <div data-testid="loading-spinner" className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/product/${product.id}`} data-testid={`product-card-${product.id}`}>
                  <div className="group bg-surface border border-border hover:border-brand-primary transition-all">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-subheading text-white text-sm tracking-wider uppercase mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="bg-brand-primary text-black px-3 py-1 text-sm font-bold">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-neutral-500 text-xs uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            data-testid="view-all-button"
            className="inline-flex items-center gap-3 border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section data-testid="features-section" className="py-24 px-4 md:px-8 bg-surface">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">
                AUTHENTIC IMPORTS
              </h3>
              <p className="text-neutral-500 text-sm">
                100% genuine imported sneakers from trusted sources worldwide
              </p>
            </div>
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">
                PREMIUM QUALITY
              </h3>
              <p className="text-neutral-500 text-sm">
                Carefully curated collection of high-quality footwear
              </p>
            </div>
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">
                EXPERT SERVICE
              </h3>
              <p className="text-neutral-500 text-sm">
                Knowledgeable staff ready to help you find the perfect fit
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;