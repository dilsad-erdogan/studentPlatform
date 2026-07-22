import React, { useState } from 'react';
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto border border-emerald-500/30">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white">Giriş Başarılı!</h2>
          <p className="text-gray-400 text-sm">Yönetici Paneline Hoş Geldiniz.</p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer mt-4"
          >
            Çıkış Yap / Giriş Ekranına Dön
          </button>
        </div>
      </div>
    );
  }

  return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
}

export default App;
