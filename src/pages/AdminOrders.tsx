import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Check, Mail } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const ords = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    // Sort by newest first
    ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(ords);
  };

  const handleStatusChange = async (order: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
      fetchOrders();
      
      if (newStatus === 'confirmed') {
        const orderSummary = order.items?.map((item: any) => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n') || '';
        
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: order.buyerEmail,
              subject: `Order Confirmed - RM Flowers (#${order.id})`,
              text: `Hello ${order.buyerName},\n\nGreat news! Your order from RM Flowers has been confirmed and is being prepared.\n\nOrder Summary:\n${orderSummary}\n\nTotal: ₹${order.total.toFixed(2)}\n\nThank you for choosing everlasting elegance.\n\nBest regards,\nRM Flowers Team`
            })
          });

          if (response.ok) {
            alert("Order confirmed and email sent to the buyer automatically.");
          } else {
            console.warn("Backend email failed. Falling back to mailto.");
            const subject = encodeURIComponent(`Order Confirmed - RM Flowers (#${order.id})`);
            const body = encodeURIComponent(`Hello ${order.buyerName},\n\nGreat news! Your order from RM Flowers has been confirmed and is being prepared.\n\nOrder Summary:\n${orderSummary}\n\nTotal: ₹${order.total.toFixed(2)}\n\nThank you for choosing everlasting elegance.\n\nBest regards,\nRM Flowers Team`);
            window.open(`mailto:${order.buyerEmail}?subject=${subject}&body=${body}`, '_blank');
          }
        } catch (emailError) {
          console.error("Failed to send automatic email:", emailError);
          alert("Order status updated, but failed to send automatic email.");
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-deep-leaf mb-8">Manage Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-clean-white border border-soft-rose/50 shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-soft-rose/20 pb-4 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-ink/60 block mb-1">Order ID: {order.id}</span>
                <h3 className="font-serif font-bold text-lg text-ink">{order.buyerName}</h3>
                <div className="text-sm text-ink/80 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{order.buyerEmail}</span>
                  <span>{order.buyerPhone}</span>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-sm font-bold text-deep-leaf">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest text-ink/60 mb-3">Items</h4>
              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-soft-rose/20 shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink/60">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className="text-sm font-bold text-deep-leaf">₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-soft-rose/20">
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order, e.target.value)}
                className="border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              
              <a 
                href={`mailto:${order.buyerEmail}?subject=Regarding your RM Flowers Order`}
                className="flex items-center bg-soft-rose/20 text-deep-leaf px-4 py-2 text-sm uppercase tracking-widest font-bold hover:bg-soft-rose/40 transition-colors"
              >
                <Mail size={16} className="mr-2" /> Email Buyer
              </a>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-12 text-ink/60 border border-soft-rose/30 bg-soft-rose/5">
            No orders found yet.
          </div>
        )}
      </div>
    </div>
  );
}
