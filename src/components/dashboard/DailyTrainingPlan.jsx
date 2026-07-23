import React from 'react';
import { MoreVertical, Plus, Calendar, Clock } from 'lucide-react';

const DailyTrainingPlan = ({ trainingPlans = [], onAddPlan, onOpenAllPlans }) => {
  // Demo items if Firestore training plans are empty
  const defaultSchedule = [
    {
      id: 'd1',
      time: '17:00',
      duration: '60 dk',
      title: 'Wing Tsun Temel Formlar (Siu Nim Tao)',
      instructor: 'Sifu Ali Yılmaz',
      studentsCount: 12,
      avatars: ['#10B981', '#3B82F6', '#F59E0B'],
      badge: null,
    },
    {
      id: 'd2',
      time: '18:30',
      duration: '90 dk',
      title: 'İl Jandarma İleri Refleks Drilleri (Pak/Lap Sao)',
      instructor: 'Sifu Ali Yılmaz',
      studentsCount: 18,
      avatars: [],
      badge: 'DOLU',
      location: 'A Salonu',
    },
    {
      id: 'd3',
      time: '20:00',
      duration: '60 dk',
      title: 'Yakın Dövüş & Tehdit Savunma Egzersizi',
      instructor: 'Sihing Mehmet',
      studentsCount: 8,
      avatars: [],
      badge: null,
    },
  ];

  const plansToDisplay = trainingPlans.length > 0
    ? trainingPlans.map((p, index) => ({
        id: p.id,
        time: index === 0 ? '17:00' : index === 1 ? '18:30' : '20:00',
        duration: '90 dk',
        title: p.periodTitle || 'Antrenman Programı',
        instructor: p.trainerName || 'Sifu Ali Yılmaz',
        studentsCount: 12 + index * 4,
        badge: p.type === 'weekly' ? 'HAFTALIK' : 'GÜNLÜK',
        notes: p.notes,
      }))
    : defaultSchedule;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Günlük Ders Planı</h3>
          <p className="text-xs text-gray-400">Bugünkü dersler ve antrenman saatleri</p>
        </div>
        <button
          onClick={onOpenAllPlans}
          className="text-xs font-bold text-[#D32F2F] hover:underline cursor-pointer"
        >
          Tümünü Gör
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {plansToDisplay.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:border-red-100 transition flex items-start justify-between gap-3 group"
          >
            <div className="flex gap-3.5">
              {/* Time Column */}
              <div className="text-center shrink-0 pt-0.5">
                <div className="text-sm font-extrabold text-[#D32F2F]">{item.time}</div>
                <div className="text-[10px] font-semibold text-gray-400">{item.duration}</div>
              </div>

              {/* Details Column */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#D32F2F] transition">
                  {item.title}
                </h4>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {item.instructor} • <span className="font-semibold text-gray-700">{item.studentsCount} Öğrenci</span>
                </div>

                {/* Badges / Avatars */}
                <div className="flex items-center gap-2 mt-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-100 text-[#D32F2F] text-[10px] font-extrabold rounded-md uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.location && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {item.location}
                    </span>
                  )}

                  {item.avatars && item.avatars.length > 0 && (
                    <div className="flex items-center -space-x-1.5 ml-1">
                      {item.avatars.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="w-5 h-5 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-[8px] font-bold text-gray-600">
                        +9
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Action Menu */}
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/50 transition cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Plan Quick Action */}
      <button
        onClick={onAddPlan}
        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <Plus className="w-4 h-4 text-[#D32F2F]" />
        <span>Yeni Antrenman Planı Ekle</span>
      </button>

      {/* Katılım Takibi (Attendance Tracker Dots) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="text-xs font-bold text-gray-800 mb-2.5">Katılım Takibi (Özet)</div>
        <div className="grid grid-cols-8 gap-2">
          {[
            'bg-emerald-500', 'bg-emerald-500', 'bg-red-500', 'bg-emerald-500', 'bg-gray-200', 'bg-emerald-500', 'bg-emerald-500', 'bg-red-500',
            'bg-[#CBD5E1]', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500', 'bg-red-500', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500'
          ].map((bgColor, idx) => (
            <div key={idx} className={`w-4 h-4 rounded-full ${bgColor} mx-auto transition-transform hover:scale-125`} />
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 mt-3 justify-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>KATILDI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>KATILMADI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]"></span>
            <span>AKSİYON</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DailyTrainingPlan;
