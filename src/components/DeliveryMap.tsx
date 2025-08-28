import React, { useEffect, useRef } from 'react';
import { MapPin, Clock } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const DeliveryMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
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

    // Use public Mapbox token for demo purposes
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [restaurantLng, restaurantLat],
      zoom: 14,
      maxZoom: 17,
      minZoom: 13,
      language: 'ar', // Set Arabic language for map labels
      dragPan: false, // Disable panning
      scrollZoom: true, // Allow zoom but with restrictions
      boxZoom: false,
      dragRotate: false,
      keyboard: false,
      doubleClickZoom: false,
      touchZoomRotate: {
        around: 'center'
      }
    });

    // Add large restaurant marker (pin)
    new mapboxgl.Marker({
      color: '#FFD700',
      scale: 1.5 // Make the pin larger
    })
    .setLngLat([restaurantLng, restaurantLat])
    .addTo(map.current);

    // Add delivery radius circle
    map.current.on('load', () => {
      if (!map.current) return;

      // Set Arabic language for the map
      map.current.setLayoutProperty('country-label', 'text-field', [
        'coalesce',
        ['get', 'name_ar'],
        ['get', 'name_en'],
        ['get', 'name']
      ]);
      
      map.current.setLayoutProperty('state-label', 'text-field', [
        'coalesce',
        ['get', 'name_ar'],
        ['get', 'name_en'],
        ['get', 'name']
      ]);
      
      map.current.setLayoutProperty('settlement-label', 'text-field', [
        'coalesce',
        ['get', 'name_ar'],
        ['get', 'name_en'],
        ['get', 'name']
      ]);

      // Create circle coordinates
      const createCircle = (center: [number, number], radiusKm: number, points = 64) => {
        const coords = [];
        const distanceX = radiusKm / (111.320 * Math.cos(center[1] * Math.PI / 180));
        const distanceY = radiusKm / 110.540;

        for (let i = 0; i < points; i++) {
          const theta = (i / points) * (2 * Math.PI);
          const x = distanceX * Math.cos(theta);
          const y = distanceY * Math.sin(theta);
          coords.push([center[0] + x, center[1] + y]);
        }
        coords.push(coords[0]); // Close the circle
        return coords;
      };

      const circleCoords = createCircle([restaurantLng, restaurantLat], deliveryRadius);

      // Add circle source and layer
      map.current.addSource('delivery-radius', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoords]
          },
          properties: {}
        }
      });

      map.current.addLayer({
        id: 'delivery-radius-fill',
        type: 'fill',
        source: 'delivery-radius',
        paint: {
          'fill-color': '#FFD700',
          'fill-opacity': 0.1
        }
      });

      map.current.addLayer({
        id: 'delivery-radius-border',
        type: 'line',
        source: 'delivery-radius',
        paint: {
          'line-color': '#FFD700',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    });

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
        map.current.setCenter([restaurantLng, restaurantLat]);
      }
    });

    // Add navigation controls (zoom only)
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true
    }), 'top-right');

    return () => {
      map.current?.remove();
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

      {/* Interactive Mapbox with delivery zone */}
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