import React, { useEffect, useState } from 'react';
import Background from '../components/Background';
import Hero from '../components/Hero';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import NewLetter from '../components/NewLetter';
import Footer from '../components/Footer';

function Home() {
  const heroData = [
    { text1: '30% OFF Limited Offer', text2: 'Style that' },
    { text1: 'Discover the Best of Bold Fashion', text2: 'Limited Time Only' },
    { text1: 'Explore Our Best Collection', text2: 'Shop Now!' },
    { text1: 'Choose your Perfect Fashion Fit', text2: 'Now on Sale!' },
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setHeroCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(time);
  }, []);

  return (
    <div className="overflow-x-hidden relative top-[70px]">
      {/* Hero Section */}
      <div className="w-full flex flex-col-reverse md:flex-row h-auto md:h-[60vh] lg:h-[90vh] bg-gradient-to-l from-[#141414] to-[#0c2025]">
        {/* Hero Text */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <Hero
            heroCount={heroCount}
            setHeroCount={setHeroCount}
            heroData={heroData[heroCount]}
          />
        </div>

        {/* Hero Image/Background */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <Background heroCount={heroCount} />
        </div>
      </div>

      {/* Other Sections */}
      <Product />
      <OurPolicy />
      <NewLetter />
      <Footer />
    </div>
  );
}

export default Home;
