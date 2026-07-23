import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Dumbbell, Timer, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { loginUser } from '../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Giriş başarılı!');
    } else {
      toast.error(resultAction.payload || 'Giriş başarısız.');
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <Toaster position="top-right" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          {/* Martial Arts High-Kick Icon Circle */}
          <div className="w-20 h-20 bg-[#E53935] rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center text-white mb-4 transition-transform hover:scale-105">
            <svg
              className="w-10 h-10 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* High Kick Silhouette */}
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9L15 11L13.5 8.5C13.1 7.8 12.3 7.3 11.4 7.3C10.5 7.3 9.7 7.8 9.3 8.5L5 15.5L6.7 16.5L10 11.2V22H12V14.5L14.7 18H18.5V16H15.5L13.8 13.7L17.2 12.5L21 9Z" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-[#D32F2F] tracking-tight">
            TA Wing Tsun - İl Jandarma
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Yönetici Kontrol Paneli
          </p>
        </div>

        {/* Card Form */}
        <div className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)]">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-[#8D6E63] tracking-wider uppercase mb-2">
                E-POSTA ADRESİ
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-red-200/70 rounded-2xl text-gray-800 placeholder-gray-300 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold text-[#8D6E63] tracking-wider uppercase mb-2">
                ŞİFRE
              </label>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-red-200/70 rounded-2xl text-gray-800 placeholder-gray-300 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label="Şifreyi Göster/Gizle"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D32F2F] hover:bg-[#B71C1C] active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-6 disabled:opacity-70"
            >
              <span>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Feature Icons Row */}
          <div className="flex justify-center items-center space-x-8 text-gray-400 pt-1">
            <Dumbbell className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
            <Timer className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
            <TrendingUp className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Footer Text Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-gray-600 font-medium">
            Henüz bir hesabınız yok mu?{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toast('Kayıt formu hazırlanıyor...'); }}
              className="text-[#D32F2F] font-bold hover:underline"
            >
              Kaydol
            </a>
          </p>
          <div className="flex justify-center space-x-6 text-[11px] text-gray-500 font-medium pt-1">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-700 transition-colors">
              Yardım Merkezi
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-700 transition-colors">
              Güvenlik
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
