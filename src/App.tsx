/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, User, Search, MapPin, Heart, Menu, Phone, ChevronRight, ChevronLeft, X } from 'lucide-react';

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
              <span>Vaše mesto: <strong className="underline cursor-pointer hover:text-brand-olive transition-colors">Ljubljana</strong></span>
              <span>Brezplačna dostava od 49 €*</span>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full group">
              <input 
                type="text" 
                placeholder="Iskanje izdelkov za vašega ljubljenčka..." 
                className="w-full pl-5 pr-12 py-3.5 rounded-full bg-white border border-transparent focus:border-brand-olive/30 focus:outline-none shadow-sm text-sm transition-all text-brand-brown"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-olive transition-colors cursor-pointer" size={20} />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6 text-brand-brown shrink-0">
            <button className="hover:text-brand-orange transition-colors" aria-label="Profil"><User size={24} strokeWidth={1.5} /></button>
            <button className="hover:text-brand-orange transition-colors" aria-label="Priljubljene"><Heart size={24} strokeWidth={1.5} /></button>
            
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
            <div className="flex justify-between items-start mb-6">
              <span className="text-brand-brown font-bold uppercase tracking-wide text-sm">Izdelek dneva</span>
              <span className="bg-brand-orange text-white font-bold px-2 py-1 rounded text-xs">-10%</span>
            </div>
            
            <div className="flex-1 flex justify-center items-center mb-6 group cursor-pointer relative">
               <div className="absolute inset-0 bg-brand-beige/40 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              <img src="https://images.unsplash.com/photo-1589924691995-400dc9cecb58?auto=format&fit=crop&q=80&w=300" alt="Dog Food Bag" className="h-48 object-contain mix-blend-multiply relative z-10 group-hover:rotate-2 transition-transform" />
            </div>

            <div className="mt-auto">
              <p className="text-xs text-gray-600 mb-3 leading-relaxed hover:text-brand-olive cursor-pointer transition-colors">
                N&D suha hrana za srednje in velike pasme, z jagnjetino in borovnico, 2.5kg
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-brand-orange">22.40 €</span>
                <span className="text-sm text-gray-400 line-through">24.90 €</span>
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

      </main>

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
