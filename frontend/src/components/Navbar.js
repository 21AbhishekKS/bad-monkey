import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav
        data-testid="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" data-testid="logo-link" className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-brand-primary">BAD</span>
              <span className="text-white ml-1">MONKEY</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className={`font-subheading text-sm tracking-widest hover:text-brand-primary transition-colors ${
                    location.pathname === link.path ? 'text-brand-primary' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/cart" data-testid="cart-button" className="relative">
                <ShoppingCart className="w-6 h-6 text-white hover:text-brand-primary transition-colors" />
                {getCartCount() > 0 && (
                  <span
                    data-testid="cart-count-badge"
                    className="absolute -top-2 -right-2 bg-brand-primary text-black text-xs font-bold w-5 h-5 flex items-center justify-center"
                  >
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <button
                data-testid="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            data-testid="mobile-menu"
            className="fixed top-20 left-0 right-0 bottom-0 bg-black z-40 md:hidden"
          >
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-subheading text-2xl tracking-widest hover:text-brand-primary transition-colors ${
                    location.pathname === link.path ? 'text-brand-primary' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;