import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import { Star, Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-leaf mb-8 text-center">Search Results</h1>
      
      <div className="max-w-2xl mx-auto mb-12 relative">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for elegant arrangements..."
          className="w-full border-b-2 border-deep-leaf/30 bg-transparent px-4 py-4 text-lg focus:outline-none focus:border-deep-leaf transition-colors pl-12"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-pulse text-deep-leaf font-serif text-xl">Searching...</div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[3/4] overflow-hidden bg-soft-rose/20 mb-4">
                {product.images?.[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.stock <= 0 ? 'opacity-70 grayscale' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-4 left-4 bg-red-100 text-red-800 px-3 py-1 text-xs font-bold uppercase tracking-widest z-10">
                    Out of Stock
                  </div>
                )}
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Link to={`/product/${product.id}`} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-clean-white text-deep-leaf px-6 py-3 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hover:bg-deep-leaf hover:text-clean-white">
                  View Details
                </Link>
              </div>
              <div className="flex flex-col flex-grow">
                <span className="text-xs uppercase tracking-widest text-ink/60 mb-2">{product.category}</span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-serif text-lg text-ink mb-2 group-hover:text-deep-leaf transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-deep-leaf font-medium">₹{product.price}</span>
                  <div className="flex text-soft-rose">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-ink/60 font-serif">No products found matching "{searchQuery}".</p>
          <Link to="/shop" className="inline-block mt-8 px-8 py-4 bg-deep-leaf text-clean-white font-medium uppercase tracking-widest hover:bg-ink transition-colors">
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
