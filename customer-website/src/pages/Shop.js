import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  const categories = ['all', 'Sneakers', 'Casuals', 'Sports', 'Fashion'];
  const genders = ['all', 'Men', 'Women', 'Unisex'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedGender !== 'all') {
      filtered = filtered.filter(p => p.gender === selectedGender);
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedGender, products]);

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-4">
          <span className="text-brand-primary">SHOP</span>
          <span className="text-white ml-2">ALL</span>
        </h1>
        <p className="text-neutral-500 text-lg">Browse our complete collection of imported sneakers</p>
      </div>

      <div className="mb-12 space-y-6">
        <div>
          <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-3">CATEGORY</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button key={category} onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 border font-subheading text-xs tracking-wider uppercase transition-all ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-black border-brand-primary'
                    : 'bg-transparent text-white border-white/20 hover:border-brand-primary'
                }`}>{category}</button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-subheading text-white text-sm tracking-widest uppercase mb-3">GENDER</h3>
          <div className="flex flex-wrap gap-3">
            {genders.map(gender => (
              <button key={gender} onClick={() => setSelectedGender(gender)}
                className={`px-6 py-2 border font-subheading text-xs tracking-wider uppercase transition-all ${
                  selectedGender === gender
                    ? 'bg-brand-primary text-black border-brand-primary'
                    : 'bg-transparent text-white border-white/20 hover:border-brand-primary'
                }`}>{gender}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">No products found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="group bg-surface border border-border hover:border-brand-primary transition-all">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-subheading text-white text-sm tracking-wider uppercase mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-brand-primary text-black px-3 py-1 text-sm font-bold">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-neutral-500 text-xs uppercase tracking-wider">{product.gender}</span>
                  </div>
                  <span className="text-neutral-500 text-xs uppercase tracking-wider">{product.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;