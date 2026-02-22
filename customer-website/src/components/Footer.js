import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">
              <span className="text-brand-primary">BAD</span>
              <span className="text-white ml-1">MONKEY</span>
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Bengaluru's premier destination for imported sneakers and premium footwear since 2023.
            </p>
          </div>

          <div>
            <h4 className="font-subheading text-white text-sm tracking-widest mb-4">QUICK LINKS</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" className="text-neutral-500 hover:text-brand-primary text-sm transition-colors">Shop</Link>
              <Link to="/about" className="text-neutral-500 hover:text-brand-primary text-sm transition-colors">About Us</Link>
              <Link to="/contact" className="text-neutral-500 hover:text-brand-primary text-sm transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-subheading text-white text-sm tracking-widest mb-4">CONTACT</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+918105154740" className="flex items-center gap-2 text-neutral-500 hover:text-brand-primary text-sm transition-colors">
                <Phone className="w-4 h-4" />+91 81051 54740
              </a>
              <a href="mailto:info@badmonkey.com" className="flex items-center gap-2 text-neutral-500 hover:text-brand-primary text-sm transition-colors">
                <Mail className="w-4 h-4" />info@badmonkey.com
              </a>
              <div className="flex items-start gap-2 text-neutral-500 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>32, 22nd Main, PES College Rd, Bengaluru 560050</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-subheading text-white text-sm tracking-widest mb-4">FOLLOW US</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-neutral-500 text-sm">&copy; 2023 Bad Monkey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;