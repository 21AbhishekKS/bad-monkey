import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Clock, User, Phone, Mail } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <span className="text-brand-primary">ORDERS</span>
      </h1>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center">
          <p className="text-neutral-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-brand-primary font-mono text-sm mb-1">#{order.id.slice(0, 8)}</p>
                  <p className="text-white font-bold text-xl">₹{order.total?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-xs font-subheading tracking-wider uppercase ${
                    order.status === 'pending' ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/20 text-brand-primary'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                  <p className="text-neutral-500 text-xs mt-2 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-background border border-border">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-brand-primary mt-1" />
                  <div>
                    <p className="text-white text-sm font-semibold">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-primary mt-1" />
                  <p className="text-neutral-500 text-sm">{order.customerEmail}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-primary mt-1" />
                  <a href={`tel:${order.customerPhone}`} className="text-neutral-500 hover:text-brand-primary text-sm transition-colors">
                    {order.customerPhone}
                  </a>
                </div>
              </div>

              {selectedOrder === order.id ? (
                <div className="border-t border-border pt-4">
                  <h4 className="text-white font-subheading text-sm tracking-wider uppercase mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-background p-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-neutral-500 text-xs">Size: {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <p className="text-brand-primary font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedOrder(null)}
                    className="mt-4 text-brand-primary text-sm hover:underline">
                    Hide Details
                  </button>
                </div>
              ) : (
                <button onClick={() => setSelectedOrder(order.id)}
                  className="text-brand-primary text-sm hover:underline">
                  View Items ({order.items?.length || 0})
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;