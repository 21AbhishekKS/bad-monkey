import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Sneakers',
    gender: 'Men',
    description: '',
    image: '',
    stock: 10,
    availableSizes: { UK: [], US: [], EU: [] }
  });

  const categories = ['Sneakers', 'Casuals', 'Sports', 'Fashion'];
  const genders = ['Men', 'Women', 'Unisex'];
  const sizes = {
    UK: ['6', '7', '8', '9', '10', '11', '12'],
    US: ['7', '8', '9', '10', '11', '12', '13'],
    EU: ['40', '41', '42', '43', '44', '45', '46']
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, image: url });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('Product updated!');
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('Product added!');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('Product deleted!');
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      gender: product.gender,
      description: product.description,
      image: product.image,
      stock: product.stock,
      availableSizes: product.availableSizes || { UK: [], US: [], EU: [] }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Sneakers',
      gender: 'Men',
      description: '',
      image: '',
      stock: 10,
      availableSizes: { UK: [], US: [], EU: [] }
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const toggleSize = (system, size) => {
    const current = formData.availableSizes[system] || [];
    const updated = current.includes(size)
      ? current.filter(s => s !== size)
      : [...current, size];
    setFormData({
      ...formData,
      availableSizes: { ...formData.availableSizes, [system]: updated }
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold uppercase">
          <span className="text-brand-primary">PRODUCTS</span>
        </h1>
        <button onClick={() => setShowModal(true)}
          className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-6 py-3 hover:bg-white transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          ADD PRODUCT
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center">
          <p className="text-neutral-500 mb-4">No products yet. Add your first product!</p>
          <button onClick={() => setShowModal(true)}
            className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-3 hover:bg-white transition-all">
            ADD PRODUCT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-surface border border-border overflow-hidden">
              <div className="aspect-square bg-white p-4 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-white font-subheading text-xs md:text-sm tracking-wider uppercase mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-brand-primary font-bold text-base md:text-lg mb-2">
                  ₹{product.price?.toLocaleString()}
                </p>
                <p className="text-neutral-500 text-xs mb-3">
                  {product.category} • {product.gender} • Stock: {product.stock}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => handleEdit(product)}
                    className="flex-1 bg-background border border-border text-white px-3 py-2 hover:border-brand-primary transition-all flex items-center justify-center gap-2 text-xs">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-background border border-border text-white px-3 py-2 hover:border-brand-secondary hover:text-brand-secondary transition-all flex items-center justify-center gap-2 text-xs">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-border max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-2xl font-bold text-white uppercase">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h2>
              <button onClick={resetForm} className="text-neutral-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary" />
                </div>

                <div>
                  <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Price *</label>
                  <input type="number" required value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary" />
                </div>

                <div>
                  <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Gender *</label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary">
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Stock *</label>
                  <input type="number" required value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary" />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Description *</label>
                <textarea required value={formData.description} rows="3"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary resize-none" />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-3">Available Sizes</label>
                {Object.keys(sizes).map(system => (
                  <div key={system} className="mb-3">
                    <p className="text-brand-primary text-xs mb-2">{system} Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes[system].map(size => (
                        <button key={size} type="button" onClick={() => toggleSize(system, size)}
                          className={`px-3 py-1 text-sm transition-all ${
                            formData.availableSizes[system]?.includes(size)
                              ? 'bg-brand-primary text-black'
                              : 'bg-background border border-border text-white hover:border-brand-primary'
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Image */}
              <div>
                <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">Image</label>
                <div className="space-y-3">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-brand-primary file:text-black file:font-subheading file:text-xs file:tracking-wider file:uppercase" />
                  <p className="text-neutral-500 text-xs">OR</p>
                  <input type="url" placeholder="Paste image URL" value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-background border border-border text-white px-4 py-2 focus:outline-none focus:border-brand-primary" />
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover border border-border" />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading || uploading}
                  className="flex-1 bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-3 hover:bg-white transition-all disabled:opacity-50">
                  {loading ? 'SAVING...' : (editingProduct ? 'UPDATE' : 'ADD PRODUCT')}
                </button>
                <button type="button" onClick={resetForm}
                  className="flex-1 border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black transition-all">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
