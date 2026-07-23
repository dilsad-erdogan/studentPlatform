import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  CalendarDays, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut, 
  X 
} from 'lucide-react';
import { logoutUser } from '../../redux/authSlice';

const Sidebar = ({ activeTab, setActiveTab, onAddNewMember, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Öğrenciler', icon: Users },
    { id: 'financials', label: 'Finans & Ödemeler', icon: Wallet },
    { id: 'trainingPlans', label: 'Eğitim Planları', icon: CalendarDays },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar Main Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9L15 11L13.5 8.5C13.1 7.8 12.3 7.3 11.4 7.3C10.5 7.3 9.7 7.8 9.3 8.5L5 15.5L6.7 16.5L10 11.2V22H12V14.5L14.7 18H18.5V16H15.5L13.8 13.7L17.2 12.5L21 9Z" />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-[#D32F2F] text-base leading-tight tracking-tight">TA Wing Tsun</h1>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">İL JANDARMA PANELİ</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-[#D32F2F] shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#D32F2F]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Primary Action Button & Footer Links */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Add New Member Button */}
          <button
            onClick={onAddNewMember}
            className="w-full py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>+ Yeni Sporcu Ekle</span>
          </button>

          {/* Footer Items */}
          <div className="space-y-1 pt-1">
            <button
              onClick={() => alert('Destek hattı: destek@tawingtsun.com')}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Destek Al</span>
            </button>

            <button
              onClick={() => dispatch(logoutUser())}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
