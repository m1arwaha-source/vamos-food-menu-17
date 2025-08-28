import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: 'broast',
    name: 'بروست',
    items: [
      { id: 'broast-1', name: 'بروست', price: 1200 }
    ]
  },
  {
    id: 'beef-burger',
    name: 'برجر لحم',
    items: [
      { id: 'beef-cheese', name: 'برجر لحم مع الجبن', price: 700 },
      { id: 'beef-cheese-egg', name: 'برجر لحم مع الجبن والبيض', price: 900 },
      { id: 'beef-double', name: 'برجر دبل لحم وجبن', price: 1400 }
    ]
  },
  {
    id: 'chicken-burger',
    name: 'برجر دجاج',
    items: [
      { id: 'chicken-cheese', name: 'برجر دجاج مع الجبن', price: 700 },
      { id: 'chicken-cheese-egg', name: 'برجر دجاج مع الجبن والبيض', price: 900 },
      { id: 'chicken-double', name: 'برجر دبل دجاج وجبن', price: 1400 }
    ]
  },
  {
    id: 'shawarma',
    name: 'شاورما',
    items: [
      { id: 'shawarma-small', name: 'سندوتش شاورما صغير', price: 400 },
      { id: 'shawarma-medium', name: 'سندوتش شاورما وسط', price: 700 },
      { id: 'shawarma-vamos', name: 'سندوتش شاورما ڤاموس', price: 1000 },
      { id: 'shawarma-plate', name: 'صحن شاورما', price: 2000 }
    ]
  },
  {
    id: 'falafel',
    name: 'فلافل',
    items: [
      { id: 'falafel-4', name: '4 حبات فلافل', price: 100 },
      { id: 'falafel-small', name: 'سندوتش فلافل صغير', price: 150 },
      { id: 'falafel-arabic', name: 'سندوتش فلافل خبز عربي', price: 250 },
      { id: 'falafel-vamos', name: 'سندوتش فلافل ڤاموس', price: 350 }
    ]
  },
  {
    id: 'fajita',
    name: 'فاهيتا',
    items: [
      { id: 'fajita-small', name: 'فاهيتا صغير عادي', price: 600 },
      { id: 'fajita-small-cheese', name: 'فاهيتا صغير مع الجبن', price: 700 },
      { id: 'fajita-large', name: 'فاهيتا كبير عادي', price: 1000 },
      { id: 'fajita-large-cheese', name: 'فاهيتا كبير مع الجبن', price: 1100 }
    ]
  },
  {
    id: 'zinger',
    name: 'زنجر',
    items: [
      { id: 'zinger-small', name: 'زنجر صغير عادي', price: 600 },
      { id: 'zinger-small-cheese', name: 'زنجر صغير مع الجبن', price: 700 },
      { id: 'zinger-large', name: 'زنجر كبير عادي', price: 1000 },
      { id: 'zinger-large-cheese', name: 'زنجر كبير مع الجبن', price: 1100 }
    ]
  },
  {
    id: 'fries',
    name: 'فرايز',
    items: [
      { id: 'fries', name: 'فرايز', price: 1000 }
    ]
  },
  {
    id: 'chicken-fries',
    name: 'تشيكن فرايز',
    items: [
      { id: 'chicken-fries', name: 'تشيكن فرايز', price: 1500 }
    ]
  },
  {
    id: 'chips',
    name: 'شبس',
    items: [
      { id: 'chips-plate', name: 'طبق شبس', price: 300 },
      { id: 'chips-sandwich', name: 'سندويتش شبس مع الجبن', price: 150 }
    ]
  }
];

const Menu: React.FC = () => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(menuData[0].id);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price
    });
  };

  const selectedCategoryData = menuData.find(cat => cat.id === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">منيو الأطعمة</h2>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {menuData.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="min-w-[120px]"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategoryData?.items.map((item) => (
          <div key={item.id} className="menu-card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
              <span className="text-xl font-bold text-black">
                {item.price.toLocaleString()} ريال
              </span>
            </div>
            
            <Button
              onClick={() => handleAddToCart(item)}
              className="restaurant-button w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة للسلة
            </Button>
          </div>
        ))}
      </div>

      {/* Delivery Note */}
      <div className="mt-12 text-center">
        <p className="text-lg font-medium text-muted-foreground bg-yellowLight p-4 rounded-lg inline-block">
          📍 التوصيل خلال 30 - 45 دقيقة
        </p>
      </div>
    </div>
  );
};

export default Menu;