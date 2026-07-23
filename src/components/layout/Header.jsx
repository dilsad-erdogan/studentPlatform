import React from 'react';
import { Search, Bell, HelpCircle, Menu, Sparkles } from 'lucide-react';

const Header = ({ 
  user, 
  trainerProfile, 
  onMenuToggle, 
  onSeedData, 
  seeding,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Container */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Öğrenci veya ders ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10 transition"
          />
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Seed Data Button */}
        <button
          onClick={onSeedData}
          disabled={seeding}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{seeding ? 'Yükleniyor...' : 'Test Verilerini Yükle'}</span>
        </button>

        {/* Notifications Icon with Red Badge */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition cursor-pointer rounded-xl hover:bg-gray-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Help Icon */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition cursor-pointer rounded-xl hover:bg-gray-50 hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Vertical Divider */}
        <div className="h-7 w-[1px] bg-gray-200 hidden sm:block"></div>

        {/* Trainer Profile Avatar & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D32F2F] to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-red-100">
            {trainerProfile?.fullName
              ? trainerProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)
              : 'S'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-gray-900 leading-tight">
              {trainerProfile?.fullName || 'Sifu Ali Yılmaz'}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Yönetici / Eğitmen</div>
          </div>
        </div>

      </div>

    </header>
  );
};

export default Header;
