import React from 'react';
import { Link } from 'react-router-dom';

const COLLECTIONS = [
  {
    id: 'wedding',
    name: 'Wedding Collection',
    description: 'Elegant arrangements for your special day.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    description: 'Bring everlasting beauty to your living space.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80',
  },
  {
    id: 'gifts',
    name: 'Gifts & Occasions',
    description: 'Perfect floral gifts that last forever.',
    image: 'https://images.unsplash.com/photo-1563241527-2004ab3ba185?auto=format&fit=crop&q=80',
  }
];

export default function Collections() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-leaf mb-4 text-center">Our Collections</h1>
      <p className="text-center text-ink/70 mb-16 max-w-2xl mx-auto">Explore our curated collections of premium artificial flowers, designed for every occasion and space.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map((collection) => (
          <Link key={collection.id} to={`/shop?category=${collection.id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden mb-6">
              <img 
                src={collection.image} 
                alt={collection.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-serif text-clean-white mb-3">{collection.name}</h2>
                <span className="text-clean-white/90 text-sm uppercase tracking-widest border-b border-clean-white/50 pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  Explore Collection
                </span>
              </div>
            </div>
            <p className="text-center text-ink/70">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
