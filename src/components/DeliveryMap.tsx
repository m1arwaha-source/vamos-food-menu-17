import React, { useEffect, useRef } from 'react';
import { MapPin, Clock } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DeliveryMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  
  // Restaurant location coordinates
  const restaurantLat = 15.4083286;
  const restaurantLng = 44.2226482;
  const deliveryRadius = 3; // 3km radius

  const openRestaurantLocation = () => {
    window.open('https://maps.app.goo.gl/hpLQVoSj5LdXjSoP7', '_blank');
  };

  // Calculate if a point is within the delivery radius
  const isWithinDeliveryRadius = (lat: number, lng: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat - restaurantLat) * Math.PI / 180;
    const dLng = (lng - restaurantLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(restaurantLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance <= deliveryRadius;
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map with OpenStreetMap tiles (completely free)
    map.current = L.map(mapContainer.current, {
      center: [restaurantLat, restaurantLng],
      zoom: 14,
      maxZoom: 17,
      minZoom: 13,
      dragging: false, // Disable panning
      scrollWheelZoom: true, // Allow zoom but with restrictions
      boxZoom: false,
      keyboard: false,
      doubleClickZoom: false,
      touchZoom: true,
      zoomControl: true
    });

    // Add OpenStreetMap tile layer (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Create custom restaurant icon (golden pin)
    const restaurantIcon = L.divIcon({
      className: 'custom-restaurant-marker',
      html: `
        <div style="
          background-color: #FFD700;
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #FFA500;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            color: #8B4513;
            font-size: 14px;
            font-weight: bold;
            transform: rotate(45deg);
          ">🍔</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    // Add restaurant marker
    const restaurantMarker = L.marker([restaurantLat, restaurantLng], {
      icon: restaurantIcon
    }).addTo(map.current);

    restaurantMarker.bindPopup(`
      <div style="text-align: center; direction: rtl;">
        <strong>🍔 Vamos Food</strong><br/>
        <span style="color: #666;">المطعم الرئيسي</span>
      </div>
    `);

    // Add delivery radius circle
    const deliveryCircle = L.circle([restaurantLat, restaurantLng], {
      color: '#FFD700',
      fillColor: '#FFD700',
      fillOpacity: 0.1,
      radius: deliveryRadius * 1000, // Convert km to meters
      weight: 3
    }).addTo(map.current);

    deliveryCircle.bindPopup(`
      <div style="text-align: center; direction: rtl;">
        <strong>منطقة التوصيل المجاني</strong><br/>
        <span style="color: #666;">نصف قطر 3 كم</span>
      </div>
    `);

    // Restrict zoom based on location relative to delivery area
    map.current.on('zoom', () => {
      if (!map.current) return;
      
      const center = map.current.getCenter();
      const zoom = map.current.getZoom();
      
      // If trying to zoom on area outside delivery radius, limit zoom level
      if (!isWithinDeliveryRadius(center.lat, center.lng) && zoom > 14) {
        map.current.setZoom(14);
      }
    });

    // Ensure map always stays centered on restaurant area
    map.current.on('moveend', () => {
      if (!map.current) return;
      
      const center = map.current.getCenter();
      const distance = Math.sqrt(
        Math.pow((center.lat - restaurantLat) * 111.320, 2) +
        Math.pow((center.lng - restaurantLng) * 111.320 * Math.cos(center.lat * Math.PI / 180), 2)
      );
      
      // Keep map centered within a reasonable area around the restaurant
      if (distance > 2) { // 2km from restaurant
        map.current.setView([restaurantLat, restaurantLng], map.current.getZoom());
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">منطقة التوصيل المجاني</h2>
      
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-yellowLight px-6 py-3 rounded-lg mb-4">
          <MapPin className="w-6 h-6 text-secondary" />
          <span className="font-bold text-lg text-foreground">هل أنت في نطاق دائرة التوصيل المجاني؟</span>
        </div>
        <p className="text-foreground font-medium">التوصيل مجاني داخل دائرة 3 كم من المطعم</p>
      </div>

      {/* Interactive OpenStreetMap with delivery zone */}
      <div className="relative rounded-lg overflow-hidden shadow-lg border-4 border-secondary">
        <div ref={mapContainer} className="w-full h-[500px]" />
        
        {/* Overlay with restaurant info */}
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">🍔 Vamos Food</p>
              <p className="text-sm text-foreground">منطقة التوصيل - 3 كم</p>
            </div>
          </div>
        </div>
        
        {/* Restaurant location button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={openRestaurantLocation}
            className="restaurant-button inline-flex items-center gap-2 shadow-lg"
          >
            <MapPin className="w-4 h-4" />
            موقع المطعم
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-card rounded-lg p-6 text-center">
          <MapPin className="w-8 h-8 text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-foreground mb-2">منطقة التوصيل</h3>
          <p className="text-muted-foreground text-sm">
            نقدم خدمة التوصيل المجاني لجميع المناطق ضمن نصف قطر 3 كيلومتر من المطعم
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-foreground mb-2">مدة التوصيل</h3>
          <p className="text-muted-foreground text-sm">
            التوصيل خلال 30-45 دقيقة من وقت تأكيد الطلب
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          📍 للطلبات خارج منطقة التوصيل المجاني، يُرجى التواصل معنا
        </p>
      </div>
    </div>
  );
};

export default DeliveryMap;
