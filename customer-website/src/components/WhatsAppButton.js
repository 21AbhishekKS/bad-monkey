import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '916366339222';
  const message = 'Hi! I am interested in your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Chat on WhatsApp">
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;