import React from 'react';
import { Filter, CheckCircle, Clock, CreditCard, ChevronDown } from 'lucide-react';

const FinancialSummary = ({ paymentPlans = [], onPayInstallment }) => {
  // Format transactions from paymentPlans or use default demo data
  const defaultTransactions = [
    {
      id: 'p1',
      studentName: 'Ahmet Erdem',
      avatar: 'AE',
      planName: '2026 Yıllık Aidat Paketi',
      date: '24.03.2024',
      amount: '₺12.400',
      status: 'ÖDENDİ',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'p2',
      studentName: 'Selin Demir',
      avatar: 'SD',
      planName: 'Aylık Wing Tsun Aidatı',
      date: '23.03.2024',
      amount: '₺1.850',
      status: 'ÖDENDİ',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'p3',
      studentName: 'Mert Yılmaz',
      avatar: 'MY',
      planName: 'Özel Ders (10x Paket)',
      date: '22.03.2024',
      amount: '₺8.000',
      status: 'BEKLİYOR',
      statusColor: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Box: Gelir Gelişimi (Revenue Growth Performance Chart Placeholder/Visual) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Gelir Gelişimi</h3>
            <p className="text-xs text-gray-400">Son 6 aylık performans analizi</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span>Ocak - Haziran 2026</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CSS Performance Bar Chart Simulation */}
        <div className="pt-6 pb-2 px-2">
          <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-gray-100 pb-2">
            {[
              { month: 'Oca', height: '45%', val: '₺45K' },
              { month: 'Şub', height: '60%', val: '₺60K' },
              { month: 'Mar', height: '55%', val: '₺55K' },
              { month: 'Nis', height: '85%', val: '₺85K', active: true },
              { month: 'May', height: '70%', val: '₺70K' },
              { month: 'Haz', height: '90%', val: '₺90K' },
            ].map((col, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  {col.val}
                </div>
                <div
                  className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 ${
                    col.active
                      ? 'bg-gradient-to-t from-[#D32F2F] to-rose-500 shadow-md shadow-red-500/20'
                      : 'bg-gray-100 group-hover:bg-red-200'
                  }`}
                  style={{ height: col.height }}
                />
                <span className={`text-xs font-bold ${col.active ? 'text-[#D32F2F]' : 'text-gray-400'}`}>
                  {col.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Box: Gelir Özeti (Son İşlemler Tablosu) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Gelir Özeti (Son İşlemler)</h3>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100">
                <th className="py-3 px-4 rounded-l-xl">ÖĞRENCİ</th>
                <th className="py-3 px-4">DERS/PLAN</th>
                <th className="py-3 px-4">TARİH</th>
                <th className="py-3 px-4">TUTAR</th>
                <th className="py-3 px-4 rounded-r-xl text-right">DURUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-medium">
              {paymentPlans.length > 0
                ? paymentPlans.map((plan) => {
                    const firstInst = plan.installments?.[0] || {};
                    const isPaid = firstInst.status === 'Ödendi';
                    return (
                      <tr key={plan.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-[#D32F2F] font-bold text-xs flex items-center justify-center shrink-0">
                              {plan.studentName?.slice(0, 2).toUpperCase() || 'SP'}
                            </div>
                            <span className="font-bold text-gray-900">{plan.studentName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{plan.title}</td>
                        <td className="py-3.5 px-4 text-gray-400 text-xs">
                          {firstInst.dueDate || new Date().toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-gray-900">
                          ₺{plan.totalAmount?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${
                              isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {isPaid ? 'ÖDENDİ' : 'BEKLİYOR'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                : defaultTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {tx.avatar}
                          </div>
                          <span className="font-bold text-gray-900">{tx.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{tx.planName}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs">{tx.date}</td>
                      <td className="py-3.5 px-4 font-extrabold text-gray-900">{tx.amount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${tx.statusColor}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FinancialSummary;
