import React from 'react';
import { Users, UserX, TrendingUp, Wallet, Calendar } from 'lucide-react';

const StatCards = ({ studentsCount = 0, paymentPlansCount = 0, trainerName = 'Sifu' }) => {
  const activeStudents = studentsCount > 0 ? studentsCount : 142;
  const passiveStudents = 18;
  const newRegistrations = 24;
  const collectionRate = '94%';

  const stats = [
    {
      id: 1,
      title: 'Aktif Öğrenciler',
      value: activeStudents,
      badge: '+12%',
      badgeType: 'positive',
      icon: Users,
      iconBg: 'bg-red-50 text-red-500 border-red-100',
      borderColor: 'border-l-4 border-l-red-500',
    },
    {
      id: 2,
      title: 'Pasif Öğrenciler',
      value: passiveStudents,
      badge: '-2%',
      badgeType: 'neutral',
      icon: UserX,
      iconBg: 'bg-gray-100 text-gray-500 border-gray-200',
      borderColor: 'border-l-4 border-l-gray-400',
    },
    {
      id: 3,
      title: 'Aylık Yeni Kayıt',
      value: newRegistrations,
      badge: '+8%',
      badgeType: 'positive',
      icon: TrendingUp,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      borderColor: 'border-l-4 border-l-rose-500',
    },
    {
      id: 4,
      title: 'Tahsilat Oranı',
      value: collectionRate,
      badge: '4 Geciken',
      badgeType: 'warning',
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      borderColor: 'border-l-4 border-l-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Greeting Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Hoş Geldiniz, {trainerName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Bugün {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}, Dojo'da verimli bir gün dileriz.
          </p>
        </div>

        {/* Weekly View Button */}
        <button className="self-start sm:self-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer">
          <Calendar className="w-4 h-4 text-red-500" />
          <span>HAFTALIK GÖRÜNÜM</span>
        </button>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge */}
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    stat.badgeType === 'positive'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : stat.badgeType === 'warning'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {stat.badge}
                </span>
              </div>

              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default StatCards;
