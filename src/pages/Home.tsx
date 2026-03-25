import { ArrowRight, Star, ShieldCheck, Leaf, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const FAQS = [
  {
    question: "Do they look like real flowers?",
    answer: "Yes. We use proprietary 'Real-Touch' technology and premium silk to mimic the exact texture, color gradients, and petal structure of fresh blooms. Even up close, they are virtually indistinguishable from nature."
  },
  {
    question: "How long do they last?",
    answer: "With proper care, our arrangements last for years. They are crafted with UV-resistant materials to prevent fading, ensuring everlasting elegance without the weekly replacement costs."
  },
  {
    question: "Are they difficult to clean?",
    answer: "Not at all. Maintenance-free beauty is our promise. A simple light dusting or a gentle wipe with a damp cloth every few months is all it takes to keep them looking pristine."
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(prods.slice(0, 4)); // Get up to 4 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxurious artificial floral arrangement" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-ink/30 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="block text-soft-rose uppercase tracking-[0.3em] text-sm font-semibold mb-6"
          >
            Everlasting Elegance
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-clean-white leading-tight mb-8"
          >
            Nature's Beauty, <br className="hidden md:block" /> Perfected for Eternity.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-8 py-4 bg-soft-rose text-deep-leaf font-medium uppercase tracking-widest hover:bg-clean-white transition-colors duration-300"
            >
              Shop the Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals Bar */}
      <section className="bg-soft-rose/30 py-8 border-b border-soft-rose/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-deep-leaf/20">
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <Leaf className="text-deep-leaf mb-3" size={28} strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-deep-leaf text-lg mb-1">Real-Touch Technology</h3>
              <p className="text-sm text-ink/70">As realistic as nature itself.</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <Clock className="text-deep-leaf mb-3" size={28} strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-deep-leaf text-lg mb-1">Maintenance-Free</h3>
              <p className="text-sm text-ink/70">No watering, no wilting, ever.</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <ShieldCheck className="text-deep-leaf mb-3" size={28} strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-deep-leaf text-lg mb-1">Secure Checkout</h3>
              <p className="text-sm text-ink/70">100% safe & encrypted payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-clean-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-deep-leaf mb-4">Curated Collections</h2>
              <p className="text-ink/70 max-w-2xl">Discover our most sought-after arrangements, meticulously crafted for the discerning eye.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-deep-leaf font-medium uppercase tracking-widest text-sm hover:text-deep-leaf/70 transition-colors group">
              View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-soft-rose/20 mb-4">
                    {product.tag && (
                      <span className="absolute top-4 left-4 z-10 bg-clean-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-deep-leaf">
                        {product.tag}
                      </span>
                    )}
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800'} 
                        alt={product.name} 
                        className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${product.stock <= 0 ? 'opacity-70 grayscale' : ''}`}
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    {product.stock <= 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-red-100 text-red-800 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                        Out of Stock
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <Link to={`/product/${product.id}`} className="block text-center w-full bg-deep-leaf text-clean-white py-3 uppercase tracking-widest text-sm font-medium hover:bg-ink transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <Link to={`/product/${product.id}`} className="flex-grow">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-soft-rose/30 bg-soft-rose/5">
              <p className="text-ink/60">No products available yet. Check back soon!</p>
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center text-deep-leaf font-medium uppercase tracking-widest text-sm border-b border-deep-leaf pb-1">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Us / Brand Story */}
      <section className="py-24 bg-deep-leaf text-clean-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=1000" 
                alt="Artisan arranging artificial flowers" 
                className="w-full h-auto aspect-[3/4] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-soft-rose uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Redefining the Art of Floral Design.</h2>
              <div className="space-y-6 text-clean-white/80 text-lg leading-relaxed font-light">
                <p>
                  At RM Flowers, we believe that beauty shouldn't be fleeting. Founded by interior designers who were frustrated by the constant upkeep and expense of fresh blooms, we set out to create an alternative that compromises on nothing.
                </p>
                <p>
                  Our arrangements are not merely artificial; they are botanical replicas. Each petal is hand-painted, each stem meticulously shaped, utilizing our signature 'Real-Touch' technology to ensure they feel as exquisite as they look.
                </p>
                <p>
                  Designed for busy professionals, elegant homes, and unforgettable events, RM Flowers offers the luxury of perfect blooms, every single day.
                </p>
              </div>
              <Link to="/about" className="inline-flex items-center mt-10 text-soft-rose font-medium uppercase tracking-widest text-sm hover:text-clean-white transition-colors group">
                Read Our Full Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Why Choose Artificial */}
      <section className="py-24 bg-soft-rose/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-deep-leaf uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">The RM Difference</span>
          <h2 className="text-4xl font-serif font-bold text-deep-leaf mb-16">Why Choose Artificial?</h2>
          
          <div className="space-y-12 text-left">
            {FAQS.map((faq, index) => (
              <div key={index} className="bg-clean-white p-8 md:p-10 shadow-sm border border-soft-rose/30">
                <h3 className="text-2xl font-serif font-bold text-deep-leaf mb-4">{faq.question}</h3>
                <p className="text-ink/80 leading-relaxed text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
