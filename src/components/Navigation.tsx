import React from 'react';
import { Home, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-background border-b border-border py-4 px-4">
      <div className="max-w-4xl mx-auto flex justify-center gap-4">
        <Link to="/">
          <Button 
            variant={location.pathname === '/' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </Button>
        </Link>
        
        <Link to="/delivery">
          <Button 
            variant={location.pathname === '/delivery' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            التوصيل المجاني
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;