import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      const orderData = {
        buyerName: formData.name,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        buyerAddress: formData.address,
        items: items,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?.uid || null
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Format order summary for email
      const orderSummary = items.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');

      // Send automatic email to the user via backend
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: `Order Received - RM Flowers (#${docRef.id})`,
            text: `Hello ${formData.name},\n\nThank you for placing an order with RM Flowers! Your order has been received and is currently pending confirmation.\n\nOrder ID: ${docRef.id}\n\nOrder Summary:\n${orderSummary}\n\nTotal: ₹${total.toFixed(2)}\n\nWe will notify you once your order is confirmed.\n\nBest regards,\nRM Flowers Team`
          })
        });

        if (!response.ok) {
          console.warn("Backend email failed. Falling back to mailto.");
          // Fallback: Open Email client to notify seller
          const sellerEmail = "rmflowers42@gmail.com";
          const emailSubject = encodeURIComponent(`New Order Received - RM Flowers (#${docRef.id})`);
          const emailBody = encodeURIComponent(`Hello RM Flowers,\n\nA new order has been placed.\n\nOrder ID: ${docRef.id}\nBuyer Name: ${formData.name}\nBuyer Email: ${formData.email}\nBuyer Phone: ${formData.phone}\nTotal: ₹${total.toFixed(2)}\n\nPlease check the admin panel for more details.`);
          const mailtoUrl = `mailto:${sellerEmail}?subject=${emailSubject}&body=${emailBody}`;
          
          setTimeout(() => {
            window.location.href = mailtoUrl;
          }, 500);
        }
      } catch (emailError) {
        console.error("Failed to send automatic email:", emailError);
      }

      // Clear cart
      clearCart();
      setIsCheckingOut(false);
      
      // WhatsApp Redirect for Seller
      const sellerPhone = "918793326295";
      const message = `Hello RM Flowers! I just placed an order (ID: ${docRef.id}).\n\nName: ${formData.name}\nTotal: ₹${total.toFixed(2)}\n\nPlease confirm my order.`;
      const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      alert("Order placed successfully! You will receive an email confirmation shortly with your order summary.");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif font-bold text-deep-leaf mb-6">Your Cart is Empty</h1>
        <p className="text-ink/70 mb-8">Looks like you haven't added any elegant arrangements yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-deep-leaf text-clean-white font-medium uppercase tracking-widest hover:bg-ink transition-colors">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold text-deep-leaf mb-12">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row items-center border-b border-soft-rose/50 pb-8 gap-6">
              <div className="w-32 h-40 bg-soft-rose/20 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-lg text-ink">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.productId)} className="text-ink/40 hover:text-deep-leaf transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center border border-deep-leaf/30 h-10 w-28">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex-1 flex justify-center items-center text-ink hover:text-deep-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= Math.max(6, item.minOrderQuantity || 6)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex-1 flex justify-center items-center text-ink hover:text-deep-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity >= 100}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-medium text-deep-leaf">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary / Checkout Form */}
        <div className="lg:col-span-1">
          <div className="bg-soft-rose/10 p-8 border border-soft-rose/30 sticky top-28">
            <h2 className="text-xl font-serif font-bold text-deep-leaf mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-sm text-ink/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-soft-rose/50 pt-4 flex justify-between font-bold text-lg text-deep-leaf">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-deep-leaf text-clean-white h-14 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors flex items-center justify-center"
              >
                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-deep-leaf mb-4 border-t border-soft-rose/50 pt-6">Shipping Details</h3>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Full Name</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Email</label>
                  <input 
                    type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Phone (WhatsApp)</label>
                  <input 
                    type="tel" required
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Delivery Address</label>
                  <textarea 
                    required rows={3}
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-deep-leaf text-clean-white h-14 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors mt-4"
                >
                  Confirm Order
                </button>
                <button 
                  type="button" onClick={() => setIsCheckingOut(false)}
                  className="w-full text-ink/60 text-xs uppercase tracking-widest hover:text-deep-leaf transition-colors mt-2"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
