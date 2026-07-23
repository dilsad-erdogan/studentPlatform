import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dumbbell,
  CreditCard,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  UserCheck,
  LogOut,
  Database,
  Sparkles,
  User,
  Phone,
  Mail,
  Shield
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { logoutUser } from '../redux/authSlice';
import { seedInitialData } from '../firebase/services/seedService';
import { getTrainerByUid } from '../firebase/services/trainerService';
import { getStudents } from '../firebase/services/studentService';
import { getPaymentPlans, payInstallment } from '../firebase/services/paymentService';
import {
  getTrainingPlans,
  addTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan
} from '../firebase/services/trainingPlanService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // States
  const [activeTab, setActiveTab] = useState('trainingPlans'); // 'trainingPlans' | 'payments' | 'students'
  const [trainerProfile, setTrainerProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Training Plan Form State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({
    type: 'weekly',
    periodTitle: '',
    targetGrade: '1. SG - 4. SG',
    focusTopicsText: '',
    notes: '',
  });

  // Load Firestore Data
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const trainerData = await getTrainerByUid(user.uid);
      setTrainerProfile(trainerData);

      const studentData = await getStudents();
      setStudents(studentData);

      const paymentData = await getPaymentPlans();
      setPaymentPlans(paymentData);

      const plansData = await getTrainingPlans(user.uid);
      setTrainingPlans(plansData);
    } catch (error) {
      console.error('Error loading Firestore data:', error);
      toast.error('Veriler çekilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Seeding Test Data
  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const res = await seedInitialData(user?.uid || 'demo_uid', user?.email || 'admin@gmail.com');
      toast.success(res.message);
      await loadData();
    } catch (error) {
      console.error('Seed Error:', error);
      const errMsg = error?.message || '';
      if (errMsg.includes('permission-denied') || errMsg.includes('insufficient permissions')) {
        toast.error('Firestore Yetki Hatası: Firebase Console üzerinden Security Rules izinlerini kontrol edin.', { duration: 6000 });
      } else {
        toast.error(`Hata: ${errMsg || 'Test verileri yüklenirken bir sorun oluştu.'}`, { duration: 5000 });
      }
    } finally {
      setSeeding(false);
    }
  };

  // Handle Installment Payment
  const handlePayInstallment = async (planId, installmentNo) => {
    try {
      await payInstallment(planId, installmentNo, {
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Kredi Kartı / Havale',
      });
      toast.success(`${installmentNo}. Taksit ödemesi başarıyla alındı!`);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error('Taksit ödemesi işlenemedi.');
    }
  };

  // Open Add/Edit Plan Modal
  const handleOpenPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlanId(plan.id);
      setPlanForm({
        type: plan.type || 'weekly',
        periodTitle: plan.periodTitle || '',
        targetGrade: plan.targetGrade || '',
        focusTopicsText: Array.isArray(plan.focusTopics) ? plan.focusTopics.join(', ') : '',
        notes: plan.notes || '',
      });
    } else {
      setEditingPlanId(null);
      setPlanForm({
        type: 'weekly',
        periodTitle: '',
        targetGrade: '1. SG - 4. SG',
        focusTopicsText: '',
        notes: '',
      });
    }
    setShowPlanModal(true);
  };

  // Submit Training Plan
  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.periodTitle) {
      toast.error('Lütfen bir program başlığı giriniz.');
      return;
    }

    const focusTopics = planForm.focusTopicsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingPlanId) {
        await updateTrainingPlan(editingPlanId, {
          type: planForm.type,
          periodTitle: planForm.periodTitle,
          targetGrade: planForm.targetGrade,
          focusTopics,
          notes: planForm.notes,
        });
        toast.success('Eğitim planı güncellendi.');
      } else {
        await addTrainingPlan({
          trainerId: user.uid,
          trainerName: trainerProfile?.fullName || user.email,
          type: planForm.type,
          periodTitle: planForm.periodTitle,
          targetGrade: planForm.targetGrade,
          focusTopics,
          notes: planForm.notes,
        });
        toast.success('Yeni eğitim planı eklendi.');
      }
      setShowPlanModal(false);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error('Plan kaydedilirken hata oluştu.');
    }
  };

  // Delete Training Plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Bu eğitim planını silmek istediğinize emin misiniz?')) return;
    try {
      await deleteTrainingPlan(planId);
      toast.success('Eğitim planı silindi.');
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error('Plan silinemedi.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans pb-12">
      <Toaster position="top-right" />

      {/* Top Navbar - Fully Responsive Header */}
      <header className="bg-[#111827]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">TA Wing Tsun - İl Jandarma</h1>
              <p className="text-[11px] sm:text-xs text-gray-400">Eğitmen & Yönetici Kontrol Paneli</p>
            </div>
          </div>

          {/* Seed Button & User Badge */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{seeding ? 'Yükleniyor...' : 'Test Verilerini Yükle'}</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-xs font-medium text-gray-300 max-w-[130px] sm:max-w-[160px] truncate">
                {user?.email}
              </span>
              <button
                onClick={() => dispatch(logoutUser())}
                className="p-1 hover:text-red-400 text-gray-400 transition cursor-pointer ml-1"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8">

        {/* Responsive Auth UID & Trainer Status Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-[#161f33] to-gray-900 border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] sm:text-xs font-semibold rounded-full mb-2">
                <UserCheck className="w-3.5 h-3.5" />
                Giriş Yapmış Eğitmen (Auth Linked)
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {trainerProfile?.fullName || 'Sifu Ali Yılmaz'}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {trainerProfile?.title || 'Kıdemli Wing Tsun Eğitmeni'} • {trainerProfile?.phone || '+90 532 100 20 30'}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-xl sm:rounded-2xl p-3 text-xs font-mono text-gray-300 w-full md:w-auto">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">FIREBASE AUTH UID</div>
              <div className="text-emerald-400 font-semibold truncate max-w-full md:max-w-[280px]">{user?.uid}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Horizontally Scrollable on Mobile */}
        <div className="flex border-b border-gray-800 space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar whitespace-nowrap pb-0.5">
          <button
            onClick={() => setActiveTab('trainingPlans')}
            className={`pb-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${activeTab === 'trainingPlans'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Günlük & Haftalık Planlar</span>
            <span className="bg-red-500/20 text-red-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {trainingPlans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${activeTab === 'payments'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Ödeme Grupları</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {paymentPlans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${activeTab === 'students'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            <Database className="w-4 h-4" />
            <span>Öğrenci Listesi</span>
            <span className="bg-blue-500/20 text-blue-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {students.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Training Plans */}
        {activeTab === 'trainingPlans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Eğitmen Müfredatı & Antrenman Planları</h3>
                <p className="text-xs text-gray-400 mt-0.5">Haftalık ve günlük antrenman programlarını düzenleyin.</p>
              </div>
              <button
                onClick={() => handleOpenPlanModal()}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yeni Eğitim Planı Ekle
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Yükleniyor...</div>
            ) : trainingPlans.length === 0 ? (
              <div className="bg-[#111827] border border-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-gray-400 text-sm">
                Henüz kayıtlı eğitim planı yok. "Test Verilerini Yükle" butonuna basarak örnek planları ekleyebilirsiniz.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {trainingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-lg transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-full uppercase tracking-wider ${plan.type === 'weekly'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                        >
                          {plan.type === 'weekly' ? 'Haftalık Program' : 'Günlük Program'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenPlanModal(plan)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">{plan.periodTitle}</h4>
                      <p className="text-xs text-red-400 font-semibold mb-4">Hedef Seviye: {plan.targetGrade}</p>

                      {/* Focus Topics */}
                      {plan.focusTopics && plan.focusTopics.length > 0 && (
                        <div className="mb-4 space-y-1">
                          <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            ODAK TEKNİKLER & KONULAR
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {plan.focusTopics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-lg"
                              >
                                • {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {plan.notes && (
                        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-xs text-gray-300">
                          <span className="font-bold text-gray-400">Not: </span> {plan.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Payment Plans (Installments) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Taksitli Ödeme Grupları</h3>
              <p className="text-xs text-gray-400 mt-0.5">Öğrenci aidat ve ekipman taksit takipleri.</p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Yükleniyor...</div>
            ) : paymentPlans.length === 0 ? (
              <div className="bg-[#111827] border border-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-gray-400 text-sm">
                Henüz kayıtlı taksitli ödeme grubu yok. Test verilerini yükleyerek görebilirsiniz.
              </div>
            ) : (
              <div className="space-y-6">
                {paymentPlans.map((plan) => (
                  <div key={plan.id} className="bg-[#111827] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                      <div>
                        <div className="text-xs text-red-400 font-bold uppercase tracking-wider">{plan.studentName}</div>
                        <h4 className="text-base sm:text-lg font-bold text-white">{plan.title}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5">
                          <span className="text-gray-400">Toplam Tutar: </span>
                          <span className="font-bold text-emerald-400">{plan.totalAmount?.toLocaleString()} TL</span>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5">
                          <span className="text-gray-400">Durum: </span>
                          <span className="font-bold text-gray-200">{plan.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Installments Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {plan.installments?.map((inst) => (
                        <div
                          key={inst.installmentNo}
                          className={`p-3.5 rounded-xl sm:rounded-2xl border flex flex-col justify-between transition ${inst.status === 'Ödendi'
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                              : 'bg-gray-900 border-gray-800 text-gray-300'
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{inst.installmentNo}. Taksit</span>
                              {inst.status === 'Ödendi' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-base font-extrabold text-white">{inst.amount?.toLocaleString()} TL</div>
                            <div className="text-[11px] text-gray-400 mt-1">Vade: {inst.dueDate}</div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-gray-800/60">
                            {inst.status === 'Ödendi' ? (
                              <div className="text-[11px] text-emerald-400 font-semibold">
                                ✓ Ödendi ({inst.paidDate})
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePayInstallment(plan.id, inst.installmentNo)}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                              >
                                Taksidi Öde
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Students List - Responsive Table + Mobile Card Layout */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Sporcu / Öğrenci Kayıtları</h3>
              <p className="text-xs text-gray-400 mt-0.5">Kayıtlı sporcuların derece ve birim bilgileri.</p>
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden sm:block bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-900 text-gray-400 text-xs uppercase font-bold tracking-wider border-b border-gray-800">
                      <th className="py-4 px-6">Ad Soyad</th>
                      <th className="py-4 px-6">Derece / Seviye</th>
                      <th className="py-4 px-6">Birim / Şube</th>
                      <th className="py-4 px-6">İletişim</th>
                      <th className="py-4 px-6">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-900/50 transition">
                        <td className="py-4 px-6 font-bold text-white">{st.fullName}</td>
                        <td className="py-4 px-6 text-red-400 font-semibold">{st.rankGrade}</td>
                        <td className="py-4 px-6 text-gray-300">{st.unitGroup}</td>
                        <td className="py-4 px-6 text-gray-400 text-xs">
                          <div>{st.phone}</div>
                          <div>{st.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
                            {st.status || 'Aktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Layout (Shown on Mobile Only) */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
              {students.map((st) => (
                <div key={st.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 space-y-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{st.fullName}</h4>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full">
                      {st.status || 'Aktif'}
                    </span>
                  </div>
                  <div className="text-xs text-red-400 font-semibold">{st.rankGrade}</div>
                  <div className="text-xs text-gray-400">{st.unitGroup}</div>
                  <div className="pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span>{st.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-500" />
                      <span>{st.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Plan Add/Edit Modal - Fully Responsive */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {editingPlanId ? 'Eğitim Planını Düzenle' : 'Yeni Eğitim Planı Oluştur'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">PROGRAM TÜRÜ</label>
                <select
                  value={planForm.type}
                  onChange={(e) => setPlanForm({ ...planForm, type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="weekly">Haftalık Müfredat</option>
                  <option value="daily">Günlük Program</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">PROGRAM BAŞLIĞI</label>
                <input
                  type="text"
                  value={planForm.periodTitle}
                  onChange={(e) => setPlanForm({ ...planForm, periodTitle: e.target.value })}
                  placeholder="ör. 23-29 Temmuz Haftalık Programı"
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">HEDEF SEVİYE / DERECELER</label>
                <input
                  type="text"
                  value={planForm.targetGrade}
                  onChange={(e) => setPlanForm({ ...planForm, targetGrade: e.target.value })}
                  placeholder="ör. 1. SG - 4. SG Sporcuları"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">ODAK TEKNİKLER (Virgülle Ayırın)</label>
                <input
                  type="text"
                  value={planForm.focusTopicsText}
                  onChange={(e) => setPlanForm({ ...planForm, focusTopicsText: e.target.value })}
                  placeholder="Siu Nim Tao, Pak Sao Drili, Lat Sao"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">EĞİTMEN NOTLARI</label>
                <textarea
                  value={planForm.notes}
                  onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Antrenman detayları veya özel talimatlar..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
