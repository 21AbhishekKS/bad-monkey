import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Mail, Phone, ShoppingCart } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const customerMap = {};
      orders.forEach(order => {
        const email = order.customerEmail;
        if (!customerMap[email]) {
          customerMap[email] = {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            orders: [],
            totalSpent: 0
          };
        }
        customerMap[email].orders.push(order);
        customerMap[email].totalSpent += order.total || 0;
      });

      setCustomers(Object.values(customerMap));
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
        <span className="text-brand-primary">CUSTOMERS</span>
      </h1>

      {customers.length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center">
          <p className="text-neutral-500">No customers yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, idx) => (
            <div key={idx} className="bg-surface border border-border p-6">
              <div className="mb-4">
                <h3 className="text-white font-subheading text-lg tracking-wider uppercase mb-2">
                  {customer.name}
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-primary mt-1" />
                  <p className="text-neutral-500 text-sm break-all">{customer.email}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-primary mt-1" />
                  <a href={`tel:${customer.phone}`} className="text-neutral-500 hover:text-brand-primary text-sm transition-colors">
                    {customer.phone}
                  </a>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Orders
                  </span>
                  <span className="text-white font-bold">{customer.orders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm">Total Spent</span>
                  <span className="text-brand-primary font-bold">₹{customer.totalSpent.toLocaleString()}</span>
                </div>
              </div>

              <a href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="mt-4 block w-full bg-[#25D366] text-white text-center font-subheading text-xs tracking-widest uppercase px-4 py-2 hover:bg-[#20BA5A] transition-all">
                CONTACT ON WHATSAPP
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;