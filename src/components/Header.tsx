import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const Header: React.FC = () => {
  const openGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/hpLQVoSj5LdXjSoP7', '_blank');
  };

  return (
    <header className="bg-background border-b border-border py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          ڤاموس فود - Vamos Food
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-black font-medium mb-4">
          سعادتك تبدأ من هنا 🍔
        </p>
        
        {/* Address */}
        <div 
          className="inline-flex items-center gap-2 text-foreground hover:text-secondary cursor-pointer transition-colors duration-300 mb-4"
          onClick={openGoogleMaps}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-lg">
            صنعاء - شارع النصر - فتحة سوق آية - قبل محطة الهادي للمشتقات النفطية
          </span>
        </div>
        
        {/* Working Hours */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span>مواعيد العمل: من 11 صباحاً حتى 12 منتصف الليل</span>
        </div>
      </div>
    </header>
  );
};

export default Header;