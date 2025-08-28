import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Send, X, MessageSquare, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    address: '',
    phone: '',
    notes: '',
    location: ''
  });

  const sendWhatsAppOrder = () => {
    if (cart.items.length === 0) return;

    const orderText = cart.items.map(item => 
      `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ريال`
    ).join('\n');
    
    const totalText = `الإجمالي: ${cart.total.toLocaleString()} ريال`;
    const customerInfoText = `
العنوان: ${customerInfo.address || 'غير محدد'}
رقم التواصل: ${customerInfo.phone || 'غير محدد'}
${customerInfo.location ? `رابط الموقع: ${customerInfo.location}` : ''}
${customerInfo.notes ? `ملاحظات: ${customerInfo.notes}` : ''}`;
    
    const message = `مرحباً، أريد أن أطلب:\n\n${orderText}\n\n${totalText}\n${customerInfoText}\n\nشكراً لكم`;
    
    const whatsappUrl = `https://wa.me/967782977923?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendSMSOrder = () => {
    if (cart.items.length === 0) return;

    const orderText = cart.items.map(item => 
      `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ريال`
    ).join('\n');
    
    const totalText = `الإجمالي: ${cart.total.toLocaleString()} ريال`;
    const customerInfoText = `العنوان: ${customerInfo.address || 'غير محدد'} - رقم: ${customerInfo.phone || 'غير محدد'}`;
    
    const message = `طلب من Vamos Food:\n${orderText}\n${totalText}\n${customerInfoText}`;
    
    const smsUrl = `sms:+967782977923?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_self');
  };

  return (
    <>
      {/* Fixed Cart Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-black/80 text-white shadow-lg px-6 py-3 text-lg font-bold rounded-full">
              🛒 إرسال الطلب ({cart.items.length}) - {cart.total.toLocaleString()} ريال
            </Button>
          </SheetTrigger>
        
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="text-right">سلة الطلبات</SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">سلتك فارغة</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-secondary font-bold">{item.price.toLocaleString()} ريال</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 p-0 mr-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Information Form */}
                <div className="border-t border-border pt-4 mb-6 space-y-4">
                  <h3 className="font-bold text-foreground text-lg">معلومات التوصيل</h3>
                  
                  <div>
                    <Label htmlFor="address" className="text-foreground font-medium">العنوان *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="أدخل عنوانك التفصيلي"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground font-medium">رقم التواصل *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="77X XXX XXX"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-foreground font-medium">رابط الموقع من جوجل مابس (اختياري)</Label>
                    <Input
                      id="location"
                      value={customerInfo.location}
                      onChange={(e) => setCustomerInfo({...customerInfo, location: e.target.value})}
                      placeholder="https://maps.google.com/..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-foreground font-medium">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      placeholder="أي ملاحظات خاصة بالطلب..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-foreground">الإجمالي:</span>
                    <span className="text-xl font-bold text-secondary">
                      {cart.total.toLocaleString()} ريال
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={sendWhatsAppOrder}
                      className="w-full restaurant-button"
                      disabled={!customerInfo.address || !customerInfo.phone}
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الطلب عبر واتساب
                    </Button>

                    <Button
                      onClick={sendSMSOrder}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={!customerInfo.address || !customerInfo.phone}
                    >
                      <MessageSquare className="w-4 h-4 ml-2" />
                      إرسال الطلب عبر رسالة نصية
                    </Button>

                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full"
                    >
                      <X className="w-4 h-4 ml-2" />
                      مسح السلة
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    🚚 التوصيل مجاني داخل منطقة 3 كم
                  </p>
                </div>
              </>
            )}
          </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Cart;