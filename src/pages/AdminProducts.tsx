import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, Plus, X, Edit2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '',
    price: '',
    description: '',
    images: '',
    dimensions: '',
    stylingTips: '',
    category: '',
    stock: '10',
    minOrderQuantity: '6'
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(prods);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      images: product.images?.join(', ') || '',
      dimensions: product.dimensions || '',
      stylingTips: product.stylingTips || '',
      category: product.category || '',
      stock: product.stock?.toString() || '0',
      minOrderQuantity: product.minOrderQuantity?.toString() || '6'
    });
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        images: formData.images.split(',').map(s => s.trim()),
        dimensions: formData.dimensions,
        stylingTips: formData.stylingTips,
        category: formData.category,
        stock: parseInt(formData.stock),
        minOrderQuantity: parseInt(formData.minOrderQuantity),
        specs: {
          material: 'Premium Silk Blend, Real-Touch Polymer',
          uvResistance: 'Treated for indoor use',
          cleaning: 'Lightly dust with a soft brush'
        }
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }
      
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-deep-leaf">Manage Products</h1>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="flex items-center bg-deep-leaf text-clean-white px-4 py-2 text-sm uppercase tracking-widest font-bold hover:bg-ink transition-colors"
        >
          {isFormOpen ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {isFormOpen ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-soft-rose/10 p-6 border border-soft-rose/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-serif font-bold text-deep-leaf mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Price (₹)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Image URLs (comma separated)</label>
                <input required type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" placeholder="https://image1.jpg, https://image2.jpg" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Stock</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Min Order Qty</label>
                <input required type="number" min="1" value={formData.minOrderQuantity} onChange={e => setFormData({...formData, minOrderQuantity: e.target.value})} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
            </div>
            <button type="submit" className="bg-deep-leaf text-clean-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors mt-4">
              {editingId ? 'Update Product' : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-soft-rose/50 text-xs uppercase tracking-widest text-ink/60">
              <th className="pb-4 font-medium">Product</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">Category</th>
              <th className="pb-4 font-medium">Stock Status</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map(product => (
              <tr key={product.id} className="border-b border-soft-rose/20 hover:bg-soft-rose/5 transition-colors">
                <td className="py-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-soft-rose/20 shrink-0">
                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                  </div>
                  <span className="font-serif font-medium text-ink">{product.name}</span>
                </td>
                <td className="py-4">₹{product.price}</td>
                <td className="py-4">{product.category}</td>
                <td className="py-4">
                  {product.stock > 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">In Stock ({product.stock})</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded-full">Out of Stock</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 transition-colors p-2 mr-2">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink/60">No products found. Add some to your store!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
