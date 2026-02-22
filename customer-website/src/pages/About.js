import React from 'react';

const About = () => {
  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-6">
        <span className="text-brand-primary">ABOUT</span>
        <span className="text-white ml-2">BAD MONKEY</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-6">
          <div>
            <h2 className="font-subheading text-brand-primary text-xl tracking-widest uppercase mb-4">OUR STORY</h2>
            <p className="text-neutral-500 leading-relaxed">
              Established in early 2023, Bad Monkey has quickly become Bengaluru's premier destination for imported sneakers and premium footwear. We specialize in bringing you the most sought-after international styles and limited-edition releases that you won't find in standard retail outlets.
            </p>
          </div>

          <div>
            <h2 className="font-subheading text-brand-primary text-xl tracking-widest uppercase mb-4">WHAT WE DO</h2>
            <p className="text-neutral-500 leading-relaxed">
              As specialized imported shoe dealers, we curate a unique collection of sneakers, casual footwear, sports shoes, and fashion footwear for both men and women. Our focus is on authenticity, quality, and bringing the global sneaker culture to Bengaluru's streets.
            </p>
          </div>

          <div>
            <h2 className="font-subheading text-brand-primary text-xl tracking-widest uppercase mb-4">OUR PROMISE</h2>
            <p className="text-neutral-500 leading-relaxed">
              Every pair in our collection is 100% authentic and carefully sourced from trusted international suppliers. We're committed to providing excellent customer service and helping you find the perfect footwear to express your unique style.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="aspect-[4/3] bg-surface border border-border overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Bad Monkey Store"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-surface border border-border p-8">
            <h3 className="font-subheading text-white text-lg tracking-widest uppercase mb-6">WHY CHOOSE US</h3>
            <ul className="space-y-3 text-neutral-500">
              <li className="flex items-start gap-3">
                <span className="text-brand-primary mt-1">•</span>
                <span>Exclusive imported sneakers and limited editions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary mt-1">•</span>
                <span>100% authentic products from trusted sources</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary mt-1">•</span>
                <span>Wide range of styles for every taste</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary mt-1">•</span>
                <span>Expert customer service and style advice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary mt-1">•</span>
                <span>Competitive pricing on premium footwear</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-surface border border-brand-primary p-8 md:p-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-center mb-6">
          <span className="text-brand-primary">THE STREET</span>
          <span className="text-white ml-2">NEVER SLEEPS</span>
        </h2>
        <p className="text-neutral-500 text-center max-w-3xl mx-auto leading-relaxed">
          At Bad Monkey, we're more than just a shoe store. We're a community of sneakerheads, fashion enthusiasts, and street culture lovers. Whether you're hunting for that perfect pair of kicks or looking to elevate your style game, we're here to help you make a statement.
        </p>
      </div>
    </div>
  );
};

export default About;
