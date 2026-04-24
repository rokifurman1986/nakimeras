/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, MapPin, Heart, Menu, Phone, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { FALLBACK_PRODUCTS } from './data/products';

const BRANDS = [
  { name: 'Royal Canin', logo: 'https://images.unsplash.com/photo-1516589178581-6cd72166946e?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Acana', logo: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Orijen', logo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'N&D', logo: 'https://images.unsplash.com/photo-1585845012574-e85df6def852?auto=format&fit=crop&q=80&w=150&h=80' },
  { name: 'Monge', logo: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=150&h=80' },
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [showCallForm, setShowCallForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter State
  const [filterAnimal, setFilterAnimal] = useState<'all' | 'dog' | 'cat'>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  
  // Products State
  const [products, setProducts] = useState<any[]>(FALLBACK_PRODUCTS);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (data && data.length > 0 && !error) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadWishlist = async (userId: string) => {
    const { data, error } = await supabase.from('wishlist').select('product_id').eq('user_id', userId);
    if (data && !error) {
      setWishlistIds(data.map(item => item.product_id));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadWishlist(currentUser.id);
      else setWishlistIds([]);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadWishlist(currentUser.id);
      else setWishlistIds([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      alert('Prosimo prijavite se za shranjevanje priljubljenih izdelkov');
      setShowAuthModal(true);
      return;
    }

    if (wishlistIds.includes(productId)) {
      // Remove from wishlist
      setWishlistIds(prev => prev.filter(id => id !== productId));
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
    } else {
      // Add to wishlist
      setWishlistIds(prev => [...prev, productId]);
      await supabase.from('wishlist').insert([{ user_id: user.id, product_id: productId }]);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        alert('Preverite svoj e-poštni predal za potrditveno povezavo!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        setShowAuthModal(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Prišlo je do napake.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Prišlo je do napake.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAuthModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sifra?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleCallRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify({
      access_key: "83434ec2-c44f-4b24-aa48-db94887c1932",
      subject: "Nova zahteva za klic - Nakimera's",
      ...object
    });

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const data = await res.json();
      if (data.success) {
        alert("Vaša zahteva je bila poslana! Pokličemo vas kmalu.");
        setShowCallForm(false);
      } else {
        alert("Prišlo je do napake. Poskusite znova.");
      }
    } catch (error) {
      alert("Prišlo je do napake. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-light">
      
      {/* Top Bar (White) */}
      <div className="bg-white py-2 px-4 text-[13px] text-gray-600 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-olive transition-colors">Dostava in plačilo</a>
            <a href="#" className="hover:text-brand-olive transition-colors">Kontakt</a>
            <a href="#" className="text-brand-orange font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">Nakimera's Club <Heart size={12} fill="currentColor" /></a>
          </div>
          <div className="flex items-center gap-6 font-medium text-brand-brown">
            <span className="text-lg tracking-wide">+386 (0)31 282 891</span>
            <button onClick={() => setShowCallForm(true)} className="flex items-center gap-1 hover:text-brand-orange text-sm font-normal cursor-pointer">
              <Phone size={14}/> Zahtevaj klic
            </button>
          </div>
        </div>
      </div>

      {/* Header (Beige) */}
      <header className="bg-brand-beige py-6 relative z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8">
          
          {/* Custom Logo Replacement matching the user's uploaded logo */}
          <a href="/" className="flex-shrink-0 flex flex-col items-center cursor-pointer group">
            <img src="/logo.png" alt="Nakimera's Logo" className="max-h-[80px] w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          </a>

          {/* Location & Free Shipping Info above search */}
          <div className="flex-1 flex flex-col gap-2 max-w-3xl ml-4">
            <div className="text-xs text-brand-brown/80 flex gap-4 ml-4 font-medium">
              <span>Brezplačna dostava od 49 €*</span>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full group" ref={searchRef}>
              <input 
                type="text" 
                placeholder="Iskanje izdelkov za vašega ljubljenčka..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-5 pr-12 py-3.5 rounded-full bg-white border border-transparent focus:border-brand-olive/30 focus:outline-none shadow-sm text-sm transition-all text-brand-brown"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-olive transition-colors cursor-pointer" size={20} />
              
              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 max-h-[400px] overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <a key={product.id} href="#" className="flex items-center gap-4 px-4 py-3 hover:bg-brand-beige transition-colors border-b border-gray-50 last:border-0" onClick={() => setIsSearchOpen(false)}>
                         <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                         <div className="flex-1">
                           <h4 className="text-sm font-medium text-brand-brown">{product.name}</h4>
                           <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                         </div>
                         <div className="flex items-center gap-4">
                           <span className="text-brand-orange font-bold text-sm whitespace-nowrap">{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} €</span>
                           <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }} 
                              className="text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
                           >
                              <Heart size={18} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(product.id) ? 'text-brand-orange' : ''} />
                           </button>
                         </div>
                      </a>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-gray-500 text-center">Ni rezultatov za vaše iskanje</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6 text-brand-brown shrink-0">
            <button onClick={() => setShowAuthModal(true)} className="hover:text-brand-orange transition-colors" aria-label="Profil"><User size={24} strokeWidth={1.5} /></button>
            <button className="hover:text-brand-orange transition-colors relative" aria-label="Priljubljene">
               <Heart size={24} strokeWidth={1.5} />
               {wishlistIds.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                   {wishlistIds.length}
                 </span>
               )}
            </button>
            
            <button className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm hover:shadow-md hover:text-brand-olive transition-all border border-brand-beige group">
              <span className="text-sm font-medium">Košarica je prazna</span>
              <ShoppingCart size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation (White) */}
      <nav className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
          
          {/* Catalog Button */}
          <button 
            className="flex items-center gap-3 bg-brand-olive text-white px-8 py-4 rounded-b-xl hover:bg-brand-olive-hover transition-colors font-medium relative -top-1 shadow-md"
            onMouseEnter={() => setActiveMenu(true)}
            onMouseLeave={() => setActiveMenu(false)}
          >
            <span className="text-lg">Katalog</span>
            <Menu size={20} />
          </button>

          {/* Mega Menu Dropdown */}
          {activeMenu && (
            <div 
              className="absolute top-[100%] left-4 w-64 bg-white shadow-xl rounded-b-xl border border-gray-100 py-4 z-50 text-brand-brown"
              onMouseEnter={() => setActiveMenu(true)}
              onMouseLeave={() => setActiveMenu(false)}
            >
              <div className="px-6 py-2 hover:bg-brand-beige hover:text-brand-olive cursor-pointer font-medium transition-colors">Psi</div>
              <div className="px-6 py-2 hover:bg-brand-beige hover:text-brand-olive cursor-pointer font-medium transition-colors">Mačke</div>
              <div className="px-6 py-2 hover:bg-brand-beige hover:text-brand-olive cursor-pointer font-medium transition-colors">Male živali</div>
              <div className="px-6 py-2 hover:bg-brand-beige hover:text-brand-olive cursor-pointer font-medium transition-colors">Ptice</div>
              <div className="px-6 py-2 hover:bg-brand-beige hover:text-brand-olive cursor-pointer font-medium transition-colors">Teraristika</div>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-8 text-brand-brown font-medium flex-1">
            <a href="#" className="hover:text-brand-olive transition-colors">Nove pošiljke</a>
            <a href="#" className="hover:text-brand-olive transition-colors">Znamke</a>
            <a href="#" className="hover:text-brand-olive transition-colors">Blog Nakimera's</a>
            <a href="#" className="text-brand-orange hover:opacity-80 transition-opacity">Akcije %</a>
          </div>

          <a href="#" className="text-gray-400 text-sm flex items-center gap-1 hover:text-brand-olive transition-colors">
            Sledite naročilu <MapPin size={16} />
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        
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
              
              <button className="bg-brand-orange text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-brand-orange/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Poglej več
              </button>
            </div>

            {/* Simulated animal heads for absolute positioning */}
            <div className="relative z-10 hidden md:block w-72 h-72">
                 <div className="absolute top-1/2 -left-12 bg-white px-4 py-2 rounded-full shadow-md transform -rotate-6 text-brand-brown font-medium italic animate-bounce-slow">
                    Mjav!
                 </div>
            </div>

            {/* Slider controls */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive font-bold z-20 transition-colors bg-white/40 hover:bg-white/80 rounded-full p-2">
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive font-bold z-20 transition-colors bg-white/40 hover:bg-white/80 rounded-full p-2">
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-6 right-10 z-20 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-orange shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-brand-olive/20 hover:bg-brand-olive/40 cursor-pointer transition-colors shadow-sm"></div>
            </div>
          </div>

          {/* Product of the Day */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-brand-beige shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative text-center">
            
            {/* Wishlist Button for Product of the Day */}
            {products.length > 0 && (
              <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(products[0].id); }}
                className="absolute top-6 right-6 z-20 text-gray-300 hover:text-brand-orange transition-colors cursor-pointer"
              >
                <Heart size={22} fill={wishlistIds.includes(products[0].id) ? 'currentColor' : 'none'} className={wishlistIds.includes(products[0].id) ? 'text-brand-orange' : ''} />
              </button>
            )}

            <div className="flex justify-between items-start mb-6">
              <span className="text-brand-brown font-bold uppercase tracking-wide text-sm">Izdelek dneva</span>
            </div>
            
            <div className="flex-1 flex justify-center items-center mb-6 group cursor-pointer relative">
               <div className="absolute inset-0 bg-brand-beige/40 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              <img src={products[0]?.image_url || "https://placehold.co/300x300"} alt="Izdelek" className="h-48 object-contain mix-blend-multiply relative z-10 group-hover:rotate-2 transition-transform" />
            </div>

            <div className="mt-auto">
              <p className="text-xs text-gray-600 mb-3 leading-relaxed hover:text-brand-olive cursor-pointer transition-colors line-clamp-2">
                {products[0]?.name || "Nalagam izdelek..."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-brand-orange">{products[0]?.price ? Number(products[0].price).toFixed(2) : '-.--'} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Carousel Area */}
        <div className="flex flex-col gap-4">
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

        {/* Interactive Catalog Section */}
        <div className="mt-12">
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
                    {['all', 'Wanpy', 'MIAMOR', 'Farmina', 'Farmina N&D', 'RINTI', 'Brit Premium', 'Brit Care', 'Brit Fresh', 'Brit', 'VetaPro', 'Alpha Spirit', 'Josera'].map(brand => (
                      <button 
                        key={brand}
                        onClick={() => { setFilterBrand(brand); setFilterSubcategory('all'); }}
                        className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterBrand === brand ? 'bg-brand-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {brand === 'all' ? 'Vse znamke' : brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Filter */}
                {availableSubcategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Kategorija</h4>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setFilterSubcategory('all')}
                        className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterSubcategory === 'all' ? 'bg-brand-brown text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        Vse kategorije
                      </button>
                      {availableSubcategories.map(subcat => (
                        <button 
                          key={subcat}
                          onClick={() => setFilterSubcategory(subcat)}
                          className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterSubcategory === subcat ? 'bg-brand-brown text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-brand-brown mb-8 relative inline-block">
                Katalog Izdelkov
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-orange rounded-full"></span>
              </h2>
              
              {gridProducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Ni rezultatov za izbrane filtre.</p>
                  <button onClick={resetFilters} className="mt-4 bg-brand-olive text-white px-6 py-2 rounded-full shadow-sm hover:bg-brand-brown transition-colors">
                    Prikaži vse izdelke
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gridProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center relative">
                      
                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                         <span className={`text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider shadow-sm ${product.category === 'dog' ? 'bg-[#eae1f5] text-[#8154a8]' : 'bg-[#f4eefa] text-[#a48abf]'}`}>
                           {product.category === 'dog' ? 'PES' : 'MAČKA'}
                         </span>
                         <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider border border-gray-200 shadow-sm">
                           {product.brand}
                         </span>
                      </div>
                      
                      {/* Wishlist Heart */}
                      <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }} className="absolute top-3 right-3 text-gray-300 hover:text-brand-orange transition-colors">
                        <Heart size={20} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} className={wishlistIds.includes(product.id) ? 'text-brand-orange' : ''} />
                      </button>

                      <img src={product.image_url} alt={product.name} className="w-32 h-32 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 my-4 mt-10" />
                      
                      <h3 className="text-sm font-medium text-brand-brown mb-1 line-clamp-2 min-h-[40px]">{product.name}</h3>
                      <p className="text-[10px] text-gray-400 mb-4">{product.description}</p>
                      
                      <div className="mt-auto w-full flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-orange">{Number(product.price).toFixed(2)} €</span>
                        <button className="bg-brand-olive text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:bg-brand-brown transition-colors">
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-brown/50 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-brand-olive transition-colors cursor-pointer"
              aria-label="Zapri"
            >
              <X size={24} />
            </button>
            
            {user ? (
               <div>
                  <h2 className="text-2xl font-bold text-brand-brown mb-2">Vaš profil</h2>
                  <p className="text-sm text-gray-600 mb-6">Prijavljeni ste kot: <strong className="text-brand-olive">{user.email}</strong></p>
                  
                  <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors shadow-sm cursor-pointer">
                    Odjava
                  </button>
               </div>
            ) : (
               <div>
                 <h2 className="text-2xl font-bold text-brand-brown mb-2">{authMode === 'login' ? 'Prijava' : 'Registracija'}</h2>
                 <p className="text-sm text-gray-600 mb-6">
                   {authMode === 'login' ? 'Vnesite svoje podatke za prijavo.' : 'Ustvarite nov račun za hitrejše nakupe.'}
                 </p>
                 
                 {authError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{authError}</div>}

                 <form className="flex flex-col gap-4" onSubmit={handleAuth}>
                    <div>
                      <label className="block text-sm font-medium text-brand-brown mb-1">E-pošta</label>
                      <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive transition-all" placeholder="vasa@eposta.si" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-brown mb-1">Geslo</label>
                      <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive transition-all" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={authLoading} className="mt-2 w-full bg-brand-olive text-white py-3 rounded-xl font-medium hover:bg-brand-olive-hover transition-colors shadow-md cursor-pointer disabled:opacity-70">
                      {authMode === 'login' ? (authLoading ? 'Prijavljanje...' : 'Prijavi se') : (authLoading ? 'Registracija...' : 'Registriraj se')}
                    </button>
                 </form>
                 
                 <div className="mt-6 flex items-center gap-4">
                   <div className="h-px bg-gray-200 flex-1"></div>
                   <span className="text-xs text-gray-400 uppercase font-medium">ali</span>
                   <div className="h-px bg-gray-200 flex-1"></div>
                 </div>

                 <button onClick={handleGoogleLogin} type="button" className="mt-6 w-full flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25C22.56 11.47 22.49 10.71 22.36 9.97H12V14.28H17.92C17.67 15.68 16.89 16.88 15.7 17.67V20.44H19.26C21.34 18.52 22.56 15.65 22.56 12.25Z" fill="#4285F4"/>
                      <path d="M12 23C14.97 23 17.46 22.02 19.26 20.44L15.7 17.67C14.73 18.32 13.48 18.72 12 18.72C9.13 18.72 6.7 16.78 5.83 14.18H2.17V17.02C4.01 20.67 7.74 23 12 23Z" fill="#34A853"/>
                      <path d="M5.83 14.18C5.61 13.53 5.48 12.78 5.48 12C5.48 11.22 5.61 10.47 5.83 9.82V6.98H2.17C1.4 8.52 0.96 10.22 0.96 12C0.96 13.78 1.4 15.48 2.17 17.02L5.83 14.18Z" fill="#FBBC05"/>
                      <path d="M12 5.28C13.62 5.28 15.06 5.84 16.21 6.93L19.34 3.8C17.45 2.05 14.97 1 12 1C7.74 1 4.01 3.33 2.17 6.98L5.83 9.82C6.7 7.22 9.13 5.28 12 5.28Z" fill="#EA4335"/>
                    </svg>
                    Nadaljuj z Google
                 </button>

                 <div className="mt-8 text-center text-sm text-gray-500">
                    {authMode === 'login' ? 'Še nimate računa?' : 'Že imate račun?'}
                    <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="ml-1 text-brand-olive font-medium hover:underline cursor-pointer">
                      {authMode === 'login' ? 'Registrirajte se' : 'Prijavite se'}
                    </button>
                 </div>
               </div>
            )}
            
          </div>
        </div>
      )}

      {/* Call Request Modal */}
      {showCallForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-brown/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowCallForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-brand-olive transition-colors cursor-pointer"
              aria-label="Zapri"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-brand-brown mb-2">Zahtevaj klic</h2>
            <p className="text-sm text-gray-600 mb-6">Pustite svoje podatke in poklicali vas bomo v najkrajšem možnem času.</p>
            
            <form 
              className="flex flex-col gap-4" 
              onSubmit={handleCallRequestSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1">Ime in priimek</label>
                <input type="text" name="name" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive transition-all" placeholder="Vaše ime" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1">Telefonska številka</label>
                <input type="tel" name="phone" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive transition-all" placeholder="+386 31 282 891" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1">Želen čas klica</label>
                <select name="time" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive transition-all text-gray-700 bg-white cursor-pointer">
                  <option value="Dopoldne (8:00 - 12:00)">Dopoldne (8:00 - 12:00)</option>
                  <option value="Popoldne (12:00 - 16:00)">Popoldne (12:00 - 16:00)</option>
                  <option value="Katerikoli čas">Katerikoli čas</option>
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-brand-olive text-white py-3 rounded-xl font-medium hover:bg-brand-olive-hover transition-colors shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? 'Pošiljam...' : 'Pošlji zahtevo'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
