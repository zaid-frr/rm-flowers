import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();
  const { isAdmin, user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-clean-white/90 backdrop-blur-md border-b border-soft-rose/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-deep-leaf hover:text-deep-leaf/80 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
            <Link to="/" className="text-3xl font-serif font-bold text-deep-leaf tracking-tight">
              RM Flowers
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link to="/" className="text-sm font-medium text-ink/80 hover:text-deep-leaf transition-colors uppercase tracking-widest">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-ink/80 hover:text-deep-leaf transition-colors uppercase tracking-widest">Shop All</Link>
            <Link to="/collections" className="text-sm font-medium text-ink/80 hover:text-deep-leaf transition-colors uppercase tracking-widest flex items-center">
              Collections
            </Link>
            <Link to="/contact" className="text-sm font-medium text-ink/80 hover:text-deep-leaf transition-colors uppercase tracking-widest">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-deep-leaf hover:text-deep-leaf/80 transition-colors uppercase tracking-widest">Admin</Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {user ? (
              <button onClick={logout} className="text-xs uppercase tracking-widest text-ink/60 hover:text-deep-leaf hidden md:block">Logout</button>
            ) : (
              <button onClick={login} className="text-ink/80 hover:text-deep-leaf transition-colors">
                <UserIcon size={20} />
              </button>
            )}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-ink/80 hover:text-deep-leaf transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="text-ink/80 hover:text-deep-leaf transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-soft-rose text-deep-leaf text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-20 left-0 w-full bg-clean-white border-b border-soft-rose/30 p-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border-b-2 border-deep-leaf/30 bg-transparent px-4 py-3 text-lg focus:outline-none focus:border-deep-leaf transition-colors pr-12"
              autoFocus
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/60 hover:text-deep-leaf">
              <Search size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-clean-white border-b border-soft-rose/30">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            <Link to="/" className="block px-3 py-3 text-base font-medium text-ink hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Home</Link>
            <Link to="/shop" className="block px-3 py-3 text-base font-medium text-ink hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Shop All</Link>
            <Link to="/collections" className="block px-3 py-3 text-base font-medium text-ink hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Collections</Link>
            <Link to="/contact" className="block px-3 py-3 text-base font-medium text-ink hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-3 text-base font-bold text-deep-leaf hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Admin Panel</Link>
            )}
            {user ? (
              <button onClick={logout} className="block w-full text-left px-3 py-3 text-base font-medium text-ink/60 hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Logout</button>
            ) : (
              <button onClick={login} className="block w-full text-left px-3 py-3 text-base font-medium text-ink/60 hover:bg-soft-rose/20 rounded-md uppercase tracking-wider">Login</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
