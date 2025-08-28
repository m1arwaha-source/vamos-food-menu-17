import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Menu from '@/components/Menu';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main>
          <Menu />
        </main>
        <Cart />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
