import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface CatalogPageProps {
  products: any[];
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: any) => void;
}

export default function CatalogPage({ products, wishlistIds, toggleWishlist, addToCart }: CatalogPageProps) {
  const { category } = useParams<{ category: string }>();
  
  const [filterAnimal, setFilterAnimal] = useState<'all' | 'dog' | 'cat'>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

  useEffect(() => {
    if (category === 'psi') {
      setFilterAnimal('dog');
    } else if (category === 'macke') {
      setFilterAnimal('cat');
    } else {
      setFilterAnimal('all');
    }
  }, [category]);

  const gridProducts = products.filter(p => {
    if (filterAnimal !== 'all' && !p.category.includes(filterAnimal)) return false;
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (filterSubcategory !== 'all' && p.subcategory !== filterSubcategory) return false;
    return true;
  });

  const availableSubcategories = Array.from(new Set(products.filter(p => {
     if (filterAnimal !== 'all' && !p.category.includes(filterAnimal)) return false;
     if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
     return !!p.subcategory;
  }).map(p => p.subcategory))).sort();

  const resetFilters = () => {
    setFilterAnimal('all');
    setFilterBrand('all');
    setFilterSubcategory('all');
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-brand-brown">Filtri</h3>
              {(filterAnimal !== 'all' || filterBrand !== 'all' || filterSubcategory !== 'all') && (
                <button onClick={resetFilters} className="text-sm text-brand-orange hover:underline font-medium">
                  Počisti filtre
                </button>
              )}
            </div>
            
            {/* Animal Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Žival</h4>
              <div className="flex flex-col gap-2">
                {['all', 'dog', 'cat'].map(animal => (
                  <button 
                    key={animal}
                    onClick={() => { setFilterAnimal(animal as any); setFilterSubcategory('all'); }}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterAnimal === animal ? 'bg-brand-olive text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {animal === 'all' ? 'Vse živali' : animal === 'dog' ? 'Psi' : 'Mačke'}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Znamka</h4>
              <div className="flex flex-col gap-2">
                {['all', 'Wanpy', 'MIAMOR', 'Farmina', 'Farmina N&D', 'Farmina Vet Life', 'Farmina Ecopet', 'Farmina Cibau', 'Farmina Fun Cat', 'Farmina Fun Dog', 'RINTI', 'Brit Premium', 'Brit Care', 'Brit Fresh', 'Brit', 'VetaPro', 'Alpha Spirit', 'Josera'].map(brand => (
                  <button 
                    key={brand}
                    onClick={() => setFilterBrand(brand)}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterBrand === brand ? 'bg-brand-olive text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {brand === 'all' ? 'Vse znamke' : brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {availableSubcategories.length > 0 && (
            <div className="mb-8 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterSubcategory('all')}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${filterSubcategory === 'all' ? 'bg-brand-brown text-white shadow-sm' : 'bg-brand-light text-brand-brown hover:bg-brand-beige border border-brand-beige'}`}
                >
                  Vse ({gridProducts.length})
                </button>
                {availableSubcategories.map(sub => {
                  const count = products.filter(p => p.subcategory === sub && (filterAnimal === 'all' || p.category.includes(filterAnimal)) && (filterBrand === 'all' || p.brand === filterBrand)).length;
                  return (
                    <button 
                      key={sub}
                      onClick={() => setFilterSubcategory(sub as string)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${filterSubcategory === sub ? 'bg-brand-brown text-white shadow-sm' : 'bg-brand-light text-brand-brown hover:bg-brand-beige border border-brand-beige'}`}
                    >
                      {sub} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {gridProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">Za izbrane filtre ni izdelkov.</div>
            ) : (
              gridProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl p-5 border border-brand-beige shadow-sm hover:shadow-md hover:border-brand-olive/30 transition-all group flex flex-col relative h-[360px]">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-brand-light text-brand-brown text-[10px] uppercase font-bold px-2 py-1 rounded border border-brand-beige shadow-sm">
                    {product.category}
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-4 right-4 z-20 text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    <Heart size={20} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(product.id) ? 'text-brand-orange' : ''} />
                  </button>
                  
                  {/* Image */}
                  <Link to={`/izdelek/${product.id}`} className="block h-36 mb-4 mt-2 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img src={product.image_url || "https://placehold.co/300x300"} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">{product.brand || product.category}</div>
                    <Link to={`/izdelek/${product.id}`} className="text-sm font-medium text-brand-brown mb-1 line-clamp-2 min-h-[40px] hover:text-brand-olive transition-colors">{product.name}</Link>
                    <p className="text-[10px] text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="mt-auto w-full flex flex-col gap-3">
                      <span className="text-lg font-bold text-brand-orange text-center">{Number(product.price).toFixed(2)} €</span>
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="bg-brand-olive text-white w-full rounded-full py-2.5 flex items-center justify-center shadow-sm hover:bg-brand-brown transition-colors gap-2 text-sm font-medium">
                        <ShoppingCart size={16} /> Dodaj v košarico
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
