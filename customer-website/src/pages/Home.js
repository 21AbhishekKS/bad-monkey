import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, limit, getDocs } from 'firebase/firestore';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold uppercase tracking-tight mb-6">
            <span className="text-white">THE STREET</span><br />
            <span className="text-brand-primary">NEVER SLEEPS</span>
          </h1>
          <p className="text-neutral-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Bengaluru's premier destination for imported sneakers and premium footwear
          </p>
          <Link to="/shop" className="inline-flex items-center gap-3 bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all">
            SHOP NOW<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4">
            <span className="text-brand-primary">FEATURED</span>
            <span className="text-white ml-2">DROPS</span>
          </h2>
          <p className="text-neutral-500 text-lg">Exclusive imported sneakers you won't find anywhere else</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="group bg-surface border border-border hover:border-brand-primary transition-all">
                  <div className="aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-subheading text-white text-xs md:text-sm tracking-wider uppercase mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="bg-brand-primary text-black px-2 md:px-3 py-1 text-xs md:text-sm font-bold">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <span className="text-neutral-500 text-xs uppercase tracking-wider">{product.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">No products yet. Check back soon!</p>
          </div>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-3 border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black hover:border-white transition-all">
              VIEW ALL PRODUCTS<ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>

      <section className="py-24 px-4 md:px-8 bg-surface">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">AUTHENTIC IMPORTS</h3>
              <p className="text-neutral-500 text-sm">100% genuine imported sneakers from trusted sources worldwide</p>
            </div>
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">PREMIUM QUALITY</h3>
              <p className="text-neutral-500 text-sm">Carefully curated collection of high-quality footwear</p>
            </div>
            <div className="text-center p-8 border border-border">
              <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
              <h3 className="font-subheading text-white text-lg tracking-wider uppercase mb-2">EXPERT SERVICE</h3>
              <p className="text-neutral-500 text-sm">Knowledgeable staff ready to help you find the perfect fit</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;