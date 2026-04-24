import React from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const BRANDS = [
  { name: 'Royal Canin', logo: 'https://images.unsplash.com/photo-1516589178581-6cd72166946e?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Acana', logo: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Orijen', logo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'N&D', logo: 'https://images.unsplash.com/photo-1585845012574-e85df6def852?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Monge', logo: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=150&h=80' },
];

interface HomePageProps {
  products: any[];
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: any) => void;
}

export default function HomePage({ products, wishlistIds, toggleWishlist, addToCart }: HomePageProps) {
  const featuredProducts = products.slice(0, 8);
  const productOfTheDay = products[0];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
      {/* Top Grid: Hero + Product of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Hero Banner */}
        <div className="lg:col-span-3 bg-[#EAE1F5] rounded-3xl p-10 flex items-center justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" alt="Dogs and Cats" className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
          </div>
          
          <div className="relative z-10 max-w-sm">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-olive leading-tight mb-3">
              OKUSNE NOVOSTI
            </h1>
            <p className="text-xl text-brand-brown mb-8 font-medium">za vaše najboljše prijatelje!</p>
            
            <Link to="/katalog" className="inline-block bg-brand-orange text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-brand-orange/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Poglej več
            </Link>
          </div>

          <div className="relative z-10 hidden md:block w-72 h-72">
               <div className="absolute top-1/2 -left-12 bg-white px-4 py-2 rounded-full shadow-md transform -rotate-6 text-brand-brown font-medium italic animate-bounce-slow">
                  Mjav!
               </div>
          </div>

          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive font-bold z-20 transition-colors bg-white/40 hover:bg-white/80 rounded-full p-2">
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive font-bold z-20 transition-colors bg-white/40 hover:bg-white/80 rounded-full p-2">
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>
          
          <div className="absolute bottom-6 right-10 z-20 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-orange shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
          </div>
        </div>

        {/* Product of the Day */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-brand-beige shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative text-center">
          {productOfTheDay && (
            <button 
              onClick={(e) => { e.preventDefault(); toggleWishlist(productOfTheDay.id); }}
              className="absolute top-6 right-6 z-20 text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Heart size={22} fill={wishlistIds.includes(productOfTheDay.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(productOfTheDay.id) ? 'text-brand-orange' : ''} />
            </button>
          )}

          <div className="flex justify-between items-start mb-6">
            <span className="text-brand-brown font-bold uppercase tracking-wide text-sm">Izdelek dneva</span>
          </div>
          
          {productOfTheDay ? (
            <Link to={`/izdelek/${productOfTheDay.id}`} className="flex-1 flex justify-center items-center mb-6 group cursor-pointer relative">
               <div className="absolute inset-0 bg-brand-beige/40 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              <img src={productOfTheDay.image_url || "https://placehold.co/300x300"} alt="Izdelek" className="h-48 object-contain mix-blend-multiply relative z-10 group-hover:rotate-2 transition-transform" />
            </Link>
          ) : (
            <div className="flex-1 flex justify-center items-center mb-6" />
          )}

          <div className="mt-auto">
            <Link to={productOfTheDay ? `/izdelek/${productOfTheDay.id}` : '#'} className="text-xs text-gray-600 mb-3 leading-relaxed hover:text-brand-olive cursor-pointer transition-colors line-clamp-2 block">
              {productOfTheDay?.name || "Nalagam izdelek..."}
            </Link>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-brand-orange">{productOfTheDay?.price ? Number(productOfTheDay.price).toFixed(2) : '-.--'} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Carousel Area */}
      <div className="flex flex-col gap-4 mb-16">
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {BRANDS.map((brand, idx) => (
            <div key={idx} className="bg-white min-w-[200px] h-24 rounded-2xl border border-brand-beige shadow-sm flex items-center justify-center p-4 hover:shadow-md hover:border-brand-olive/30 transition-all cursor-pointer flex-shrink-0 group">
                <div className="text-xl font-bold text-brand-brown group-hover:text-brand-olive transition-colors">{brand.name}</div>
            </div>
          ))}
        </div>
        <div className="text-right">
           <a href="#" className="text-sm text-gray-500 hover:text-brand-olive font-medium flex items-center justify-end gap-1 transition-colors">
             Vse znamke <ChevronRight size={14}/>
           </a>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-brand-brown mb-6">Izpostavljeni izdelki</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">Nalagam izdelke...</div>
          ) : (
            featuredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl p-5 border border-brand-beige shadow-sm hover:shadow-md hover:border-brand-olive/30 transition-all group flex flex-col relative h-[360px]">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                  className="absolute top-4 right-4 z-20 text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
                >
                  <Heart size={20} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(product.id) ? 'text-brand-orange' : ''} />
                </button>
                
                <Link to={`/izdelek/${product.id}`} className="block h-36 mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img src={product.image_url || "https://placehold.co/300x300"} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </Link>

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
  );
}
