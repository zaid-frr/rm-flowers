import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';

const UPSELLS = [
  {
    id: 'u1',
    name: 'Smoked Glass Cylinder Vase',
    price: 45,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'u2',
    name: 'Signature "Fresh Cut" Floral Scent Spray',
    price: 28,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b40?auto=format&fit=crop&q=80&w=400'
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          if (data.minOrderQuantity) {
            setQuantity(Math.max(6, data.minOrderQuantity));
          } else {
            setQuantity(6);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    const minQty = Math.max(6, product?.minOrderQuantity || 6);
    if (type === 'dec' && quantity > minQty) setQuantity(q => q - 1);
    if (type === 'inc' && quantity < 100) setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      minOrderQuantity: Math.max(6, product.minOrderQuantity || 6)
    });
    alert('Added to cart!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif font-bold text-deep-leaf mb-6">Product Not Found</h1>
        <Link to="/" className="px-8 py-4 bg-deep-leaf text-clean-white font-medium uppercase tracking-widest hover:bg-ink transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clean-white pt-8 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex text-sm text-ink/60 uppercase tracking-widest">
          <Link to="/" className="hover:text-deep-leaf transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/shop" className="hover:text-deep-leaf transition-colors">Shop</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-ink font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-soft-rose/10 overflow-hidden">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square bg-soft-rose/10 overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-deep-leaf' : 'border-transparent hover:border-soft-rose'}`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${idx + 1}`} 
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-soft-rose">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-ink/60 underline cursor-pointer">42 Reviews</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-leaf mb-4 leading-tight">{product.name}</h1>
              <p className="text-2xl font-medium text-ink mb-2">₹{product.price}</p>
              {product.stock <= 0 ? (
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded-full">Out of Stock</span>
                </div>
              ) : (
                <p className="text-sm text-soft-rose mb-6">Minimum order quantity: {Math.max(6, product.minOrderQuantity || 6)} units</p>
              )}
              <p className="text-lg text-ink/80 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Real-Touch Tech Highlight */}
            <div className="bg-soft-rose/20 p-6 border border-soft-rose/50 mb-8 flex items-start space-x-4">
              <div className="bg-clean-white p-2 rounded-full text-deep-leaf shrink-0">
                <Check size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-deep-leaf text-lg mb-1">Real-Touch Technology</h4>
                <p className="text-sm text-ink/80 leading-relaxed">
                  Crafted with our proprietary polymer blend, these petals feel cool and slightly damp to the touch, perfectly mimicking the cellular structure of a living rose.
                </p>
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="mb-10 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-deep-leaf/30 h-14 w-32">
                  <button 
                    onClick={() => handleQuantityChange('dec')}
                    className="flex-1 flex justify-center items-center text-ink hover:text-deep-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= Math.max(6, product?.minOrderQuantity || 6) || product.stock <= 0}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="flex-1 text-center font-medium text-lg">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('inc')}
                    className="flex-1 flex justify-center items-center text-ink hover:text-deep-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= 100 || product.stock <= 0}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-deep-leaf text-clean-white h-14 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock <= 0 ? 'Out of Stock' : `Add to Cart — ₹${(product.price * quantity).toFixed(2)}`}
                </button>
              </div>
              <Link 
                to={product.stock > 0 ? "/cart" : "#"} 
                className={`w-full flex items-center justify-center bg-soft-rose text-deep-leaf h-14 uppercase tracking-widest text-sm font-bold transition-colors ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-soft-rose/80'}`}
                onClick={(e) => {
                  if (product.stock <= 0) {
                    e.preventDefault();
                  }
                }}
              >
                {product.stock <= 0 ? 'Out of Stock' : 'Buy it Now'}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-soft-rose/50 mb-10">
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck size={24} className="text-deep-leaf" />
                <span className="text-xs uppercase tracking-wider text-ink/70">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck size={24} className="text-deep-leaf" />
                <span className="text-xs uppercase tracking-wider text-ink/70">Free Shipping over ₹2000</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw size={24} className="text-deep-leaf" />
                <span className="text-xs uppercase tracking-wider text-ink/70">30-Day Returns</span>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="space-y-4">
              {/* Dimensions & Styling */}
              <div className="border-b border-soft-rose/50 pb-4">
                <button 
                  onClick={() => setActiveTab(activeTab === 'styling' ? '' : 'styling')}
                  className="w-full flex justify-between items-center text-left py-2 group"
                >
                  <span className="font-serif font-bold text-lg text-deep-leaf uppercase tracking-wide">Dimensions & Styling</span>
                  <ChevronDown size={20} className={`text-deep-leaf transition-transform duration-300 ${activeTab === 'styling' ? 'rotate-180' : ''}`} />
                </button>
                {activeTab === 'styling' && (
                  <div className="pt-4 pb-2 text-ink/80 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <p><strong>Dimensions:</strong> {product.dimensions || 'Standard'}</p>
                    <p><strong>Styling Tip:</strong> {product.stylingTips || 'Place in a vase.'}</p>
                  </div>
                )}
              </div>

              {/* Technical Specs */}
              <div className="border-b border-soft-rose/50 pb-4">
                <button 
                  onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}
                  className="w-full flex justify-between items-center text-left py-2 group"
                >
                  <span className="font-serif font-bold text-lg text-deep-leaf uppercase tracking-wide">Technical Specifications</span>
                  <ChevronDown size={20} className={`text-deep-leaf transition-transform duration-300 ${activeTab === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                {activeTab === 'specs' && (
                  <div className="pt-4 pb-2 text-ink/80 animate-in fade-in slide-in-from-top-2">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-soft-rose/20">
                          <td className="py-3 font-medium text-deep-leaf w-1/3">Material</td>
                          <td className="py-3">{product.specs?.material || 'Premium Silk Blend'}</td>
                        </tr>
                        <tr className="border-b border-soft-rose/20">
                          <td className="py-3 font-medium text-deep-leaf">UV Resistance</td>
                          <td className="py-3">{product.specs?.uvResistance || 'Treated for indoor use'}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-deep-leaf">Care & Cleaning</td>
                          <td className="py-3">{product.specs?.cleaning || 'Lightly dust with a soft brush'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Frequently Bought Together (Upsell) */}
      <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-soft-rose/10 py-16">
        <h2 className="text-3xl font-serif font-bold text-deep-leaf mb-10 text-center">Frequently Bought Together</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          
          {/* Main Product Thumbnail */}
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="aspect-square w-full max-w-[200px] bg-clean-white p-2 border border-soft-rose/50 mb-4">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-sm font-medium text-center">{product.name}</span>
            <span className="text-deep-leaf font-bold mt-1">₹{product.price}</span>
          </div>

          <Plus size={24} className="text-soft-rose hidden md:block" />

          {/* Upsell 1 */}
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="aspect-square w-full max-w-[200px] bg-clean-white p-2 border border-soft-rose/50 mb-4 relative group">
              <img src={UPSELLS[0].image} alt={UPSELLS[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-ink/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => addToCart({ productId: UPSELLS[0].id, name: UPSELLS[0].name, price: UPSELLS[0].price, quantity: 6, image: UPSELLS[0].image, minOrderQuantity: 6 })}
                  className="bg-clean-white text-deep-leaf text-xs uppercase tracking-widest font-bold py-2 px-4 hover:bg-deep-leaf hover:text-clean-white transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <span className="text-sm font-medium text-center">{UPSELLS[0].name}</span>
            <span className="text-deep-leaf font-bold mt-1">+ ₹{UPSELLS[0].price}</span>
          </div>

          <Plus size={24} className="text-soft-rose hidden md:block" />

          {/* Upsell 2 */}
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="aspect-square w-full max-w-[200px] bg-clean-white p-2 border border-soft-rose/50 mb-4 relative group">
              <img src={UPSELLS[1].image} alt={UPSELLS[1].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-ink/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => addToCart({ productId: UPSELLS[1].id, name: UPSELLS[1].name, price: UPSELLS[1].price, quantity: 6, image: UPSELLS[1].image, minOrderQuantity: 6 })}
                  className="bg-clean-white text-deep-leaf text-xs uppercase tracking-widest font-bold py-2 px-4 hover:bg-deep-leaf hover:text-clean-white transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <span className="text-sm font-medium text-center">{UPSELLS[1].name}</span>
            <span className="text-deep-leaf font-bold mt-1">+ ₹{UPSELLS[1].price}</span>
          </div>

          <div className="w-full md:w-1/4 flex flex-col items-center md:items-start pl-0 md:pl-8 mt-8 md:mt-0 border-t md:border-t-0 md:border-l border-soft-rose/50 pt-8 md:pt-0">
            <span className="text-sm text-ink/60 uppercase tracking-widest mb-2">Total Price</span>
            <span className="text-3xl font-serif font-bold text-deep-leaf mb-6">₹{product.price + UPSELLS[0].price * 6 + UPSELLS[1].price * 6}</span>
            <button 
              onClick={() => {
                handleAddToCart();
                addToCart({ productId: UPSELLS[0].id, name: UPSELLS[0].name, price: UPSELLS[0].price, quantity: 6, image: UPSELLS[0].image, minOrderQuantity: 6 });
                addToCart({ productId: UPSELLS[1].id, name: UPSELLS[1].name, price: UPSELLS[1].price, quantity: 6, image: UPSELLS[1].image, minOrderQuantity: 6 });
              }}
              className="w-full bg-deep-leaf text-clean-white h-12 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors"
            >
              Add All 3 to Cart
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

