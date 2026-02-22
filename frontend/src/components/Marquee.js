import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
  const text = "BAD MONKEY • EST 2023 • BENGALURU • IMPORTED SNEAKERS • LIMITED DROPS • ";
  const repeatedText = text.repeat(3);

  return (
    <div data-testid="marquee-banner" className="bg-white text-black py-3 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["-33.33%", "0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="font-subheading text-sm tracking-[0.3em] font-bold">{repeatedText}</span>
      </motion.div>
    </div>
  );
};

export default Marquee;