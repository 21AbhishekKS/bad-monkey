import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        setStats({
          totalProducts: productsSnap.size,
          totalOrders: ordersSnap.size,
          totalRevenue,
          pendingOrders
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'brand-primary' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'brand-accent' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'brand-primary' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'brand-secondary' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold uppercase mb-8">
        <span className="text-brand-primary">DASHBOARD</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-surface border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${stat.color}/10`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <p className="text-neutral-500 text-sm font-subheading tracking-wider uppercase mb-1">
                {stat.title}
              </p>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-surface border border-border p-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-white mb-4">
          Welcome to Bad Monkey Admin
        </h2>
        <p className="text-neutral-500 mb-6">
          Manage your products, orders, and customers from here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/products" className="bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-3 hover:bg-white transition-all">
            MANAGE PRODUCTS
          </a>
          <a href="/orders" className="border border-white/20 text-white font-subheading text-sm tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black transition-all">
            VIEW ORDERS
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;