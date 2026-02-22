import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-6">
        <span className="text-brand-primary">GET IN</span>
        <span className="text-white ml-2">TOUCH</span>
      </h1>
      <p className="text-neutral-500 text-lg mb-12">Visit our store or reach out to us online</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-brand-primary text-black p-4 font-subheading text-sm tracking-wider">
                Thank you! We'll get back to you soon.
              </div>
            )}

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">NAME</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" />
            </div>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">EMAIL</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" />
            </div>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">PHONE</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" />
            </div>

            <div>
              <label className="font-subheading text-white text-sm tracking-widest uppercase mb-2 block">MESSAGE</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="6"
                className="w-full bg-surface border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all disabled:opacity-50">
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border p-8">
            <h3 className="font-subheading text-white text-lg tracking-widest uppercase mb-6">STORE INFORMATION</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-subheading text-sm tracking-wider uppercase mb-1">ADDRESS</h4>
                  <p className="text-neutral-500">
                    32, 22nd Main, PES College Rd<br />
                    Mysore Bank Colony, Nagendra Block<br />
                    Banashankari 1st Stage<br />
                    Bengaluru, Karnataka 560050
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-subheading text-sm tracking-wider uppercase mb-1">PHONE</h4>
                  <p className="text-neutral-500">
                    <a href="tel:+918105154740" className="hover:text-brand-primary transition-colors">+91 81051 54740</a><br />
                    <a href="tel:+916366339222" className="hover:text-brand-primary transition-colors">+91 63663 39222</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-subheading text-sm tracking-wider uppercase mb-1">EMAIL</h4>
                  <p className="text-neutral-500">
                    <a href="mailto:info@badmonkey.com" className="hover:text-brand-primary transition-colors">info@badmonkey.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-subheading text-sm tracking-wider uppercase mb-1">HOURS</h4>
                  <p className="text-neutral-500">
                    Monday: 10:30 AM - 10:00 PM<br />
                    Tuesday: 11:00 AM - 10:00 PM<br />
                    Wednesday - Sunday: 10:30 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-surface border border-border overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5979899999997!2d77.5565!3d12.9399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzIzLjYiTiA3N8KwMzMnMjMuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen=""
              loading="lazy"
              title="Bad Monkey Store Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
