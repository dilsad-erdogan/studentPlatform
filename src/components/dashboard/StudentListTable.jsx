import React from 'react';
import { Plus, Phone, Mail, UserCheck } from 'lucide-react';

const StudentListTable = ({ students = [], onAddStudent, searchQuery = '' }) => {
  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.rankGrade?.toLowerCase().includes(q) ||
      s.unitGroup?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sporcu & Öğrenci Listesi</h3>
          <p className="text-xs text-gray-400">Kayıtlı tüm Wing Tsun sporcularının seviye ve birlik detayları</p>
        </div>
        <button
          onClick={onAddStudent}
          className="px-4 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs rounded-2xl shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yeni Sporcu Kaydet</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 text-[11px] uppercase font-bold tracking-wider border-b border-gray-100">
              <th className="py-3.5 px-4 rounded-l-xl">SPORCU ADI</th>
              <th className="py-3.5 px-4">DERECE / SEVİYE</th>
              <th className="py-3.5 px-4">BİRLİK / ŞUBE</th>
              <th className="py-3.5 px-4">İLETİŞİM</th>
              <th className="py-3.5 px-4 rounded-r-xl text-right">DURUM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-medium">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-[#D32F2F] font-bold text-xs flex items-center justify-center border border-red-100">
                        {student.fullName?.slice(0, 2).toUpperCase() || 'SP'}
                      </div>
                      <span>{student.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#D32F2F] font-bold">{student.rankGrade}</td>
                  <td className="py-4 px-4 text-gray-600">{student.unitGroup}</td>
                  <td className="py-4 px-4 text-gray-400 text-xs">
                    <div>{student.phone}</div>
                    <div className="text-[11px]">{student.email}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full">
                      {student.status || 'AKTİF'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                  Kayıtlı sporcu bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {filteredStudents.map((st) => (
          <div key={st.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">{st.fullName}</h4>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full">
                {st.status || 'AKTİF'}
              </span>
            </div>
            <div className="text-xs text-[#D32F2F] font-bold">{st.rankGrade}</div>
            <div className="text-xs text-gray-500">{st.unitGroup}</div>
            <div className="pt-2 border-t border-gray-200/60 text-[11px] text-gray-500 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{st.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>{st.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StudentListTable;
