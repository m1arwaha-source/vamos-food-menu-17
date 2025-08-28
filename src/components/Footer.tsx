import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:+967782977923';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/967782977923', '_blank');
  };

  const openGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/hpLQVoSj5LdXjSoP7', '_blank');
  };

  const openInstagram = () => {
    window.open('https://www.instagram.com/vamosfood1?igsh=anFnMHhwanlqM2cz', '_blank');
  };

  const openFacebook = () => {
    window.open('https://www.facebook.com/share/1BAZWKeUFa/', '_blank');
  };

  const sendEmail = () => {
    window.location.href = 'mailto:vamosfood1@gmail.com';
  };

  return (
    <footer className="bg-muted mt-16 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Location */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              العنوان
            </h4>
            <button
              onClick={openGoogleMaps}
              className="text-muted-foreground hover:text-secondary transition-colors duration-300 text-sm leading-relaxed"
            >
              صنعاء - شارع النصر - فتحة سوق آية<br />
              قبل محطة الهادي للمشتقات النفطية
            </button>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4">التواصل</h4>
            <div className="space-y-3">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-black/80 transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                اتصال مباشر
              </button>
              
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-black/80 transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  واتساب
                </button>
                
                <button
                  onClick={sendEmail}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-black/80 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4">تابعونا</h4>
            <div className="flex justify-center gap-4">
              <button
                onClick={openInstagram}
                className="p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 hover:shadow-lg transition-all duration-300"
              >
                <Instagram className="w-6 h-6" />
              </button>
              
              <button
                onClick={openFacebook}
                className="p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 hover:shadow-lg transition-all duration-300"
              >
                <Facebook className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            مواعيد العمل: من 11 صباحاً حتى 12 منتصف الليل
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            جميع الحقوق محفوظة لـ Vamos Food © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;