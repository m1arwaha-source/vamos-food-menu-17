import React from 'react';
import DeliveryMap from '@/components/DeliveryMap';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Delivery: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main>
        <DeliveryMap />
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;