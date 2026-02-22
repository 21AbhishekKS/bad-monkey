import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
          <Toaster position="bottom-right" theme="dark" />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;