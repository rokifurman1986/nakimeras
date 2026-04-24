import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  products: any[];
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: any) => void;
}

export default function ProductPage({ products, wishlistIds, toggleWishlist, addToCart }: ProductPageProps) {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-brand-brown mb-4">Izdelek ni bil najden</h2>
        <Link to="/katalog" className="text-brand-olive hover:underline">Nazaj v katalog</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
      <Link to="/katalog" className="inline-flex items-center gap-2 text-brand-olive hover:text-brand-brown font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Nazaj na katalog
      </Link>

      <div className="bg-white rounded-3xl p-8 md:p-12 border border-brand-beige shadow-sm min-h-[60vh] flex flex-col md:flex-row gap-12">
        
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative group">
          <button 
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-4 right-4 z-20 text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
          >
            <Heart size={32} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(product.id) ? 'text-brand-orange' : ''} />
          </button>
          
          <img 
            src={product.image_url || "https://placehold.co/600x600"} 
            alt={product.name} 
            className="w-full max-w-[500px] h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-6">
            <span className="inline-block bg-brand-light text-brand-brown text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-beige mb-4">
              {product.brand || product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-brand-brown leading-tight mb-4">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">{product.description}</p>
            
            <div className="flex items-end gap-4 mb-10">
              <span className="text-5xl font-black text-brand-orange">{Number(product.price).toFixed(2)} €</span>
            </div>

            <button 
              onClick={() => addToCart(product)}
              className="w-full md:w-auto bg-brand-olive text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:bg-brand-brown transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              <ShoppingCart size={24} />
              Dodaj v košarico
            </button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8 space-y-4">
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="font-bold w-32">Kategorija:</span>
              <span>{product.category}</span>
            </div>
            {product.subcategory && (
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="font-bold w-32">Vrsta:</span>
                <span>{product.subcategory}</span>
              </div>
            )}
            {product.sifra && (
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="font-bold w-32">Šifra:</span>
                <span>{product.sifra}</span>
              </div>
            )}
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="font-bold w-32">Stanje ambalaže:</span>
              <span>{product.stanje_ambalaze || 'Novo'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
