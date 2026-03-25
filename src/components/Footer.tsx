import { Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep-leaf text-clean-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-serif font-bold mb-6 text-soft-rose">RM Flowers</h2>
            <p className="text-clean-white/80 text-sm leading-relaxed mb-6 max-w-xs">
              Everlasting Elegance. Maintenance-Free Beauty. High-end artificial flowers crafted for the discerning eye.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-soft-rose hover:text-clean-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-soft-rose hover:text-clean-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-soft-rose hover:text-clean-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-soft-rose">Shop</h3>
            <ul className="space-y-4 text-sm text-clean-white/80">
              <li><Link to="/shop" className="hover:text-soft-rose transition-colors">All Products</Link></li>
              <li><Link to="/collections/wedding" className="hover:text-soft-rose transition-colors">Wedding Collection</Link></li>
              <li><Link to="/collections/home" className="hover:text-soft-rose transition-colors">Home Decor</Link></li>
              <li><Link to="/collections/office" className="hover:text-soft-rose transition-colors">Office Arrangements</Link></li>
              <li><Link to="/collections/seasonal" className="hover:text-soft-rose transition-colors">Seasonal</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-soft-rose">Support</h3>
            <ul className="space-y-4 text-sm text-clean-white/80">
              <li><Link to="/faq" className="hover:text-soft-rose transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-soft-rose transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/track" className="hover:text-soft-rose transition-colors">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-soft-rose transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-soft-rose">Stay Inspired</h3>
            <p className="text-clean-white/80 text-sm mb-4">
              Subscribe to receive styling tips and exclusive access to new collections.
            </p>
            <form className="flex group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent border-b border-soft-rose/50 py-2 px-0 w-full text-sm text-clean-white placeholder-clean-white/50 focus:outline-none focus:border-soft-rose transition-colors"
                required
              />
              <button type="submit" className="border-b border-soft-rose/50 py-2 px-2 text-soft-rose group-hover:text-clean-white group-hover:border-clean-white transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-soft-rose/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-clean-white/60">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <p>&copy; {new Date().getFullYear()} RM Flowers. All rights reserved.</p>
            <p className="text-soft-rose/80">
              Developed by Zaid | <a href="https://instagram.com/zaid___fr" target="_blank" rel="noopener noreferrer" className="hover:text-clean-white transition-colors">@zaid___fr</a>
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-soft-rose transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-soft-rose transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
