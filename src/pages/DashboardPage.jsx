import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

// Layout & Dashboard Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StatCards from '../components/dashboard/StatCards';
import DailyTrainingPlan from '../components/dashboard/DailyTrainingPlan';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import StudentListTable from '../components/dashboard/StudentListTable';

// Firebase Services
import { seedInitialData } from '../firebase/services/seedService';
import { getTrainerByUid } from '../firebase/services/trainerService';
import { getStudents, addStudent } from '../firebase/services/studentService';
import { getPaymentPlans, payInstallment } from '../firebase/services/paymentService';
import { 
  getTrainingPlans, 
  addTrainingPlan, 
  updateTrainingPlan, 
  deleteTrainingPlan 
} from '../firebase/services/trainingPlanService';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  // Layout & Active Tab States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore Data States
  const [trainerProfile, setTrainerProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({
    type: 'weekly',
    periodTitle: '',
    targetGrade: '1. SG - 4. SG',
    focusTopicsText: '',
    notes: '',
  });

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    rankGrade: '1. SG (Öğrenci Derecesi)',
    unitGroup: 'İl Jandarma Komutanlığı A Takımı',
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
      toast.error('Veriler yüklenirken bir hata oluştu.');
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

  // Open Plan Modal
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

  // Save Training Plan
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
      toast.error('Plan kaydedilemedi.');
    }
  };

  // Save New Student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.fullName) {
      toast.error('Lütfen ad soyad giriniz.');
      return;
    }
    try {
      await addStudent({
        ...studentForm,
        trainerId: user.uid,
        status: 'Aktif',
      });
      toast.success('Yeni öğrenci kaydedildi!');
      setShowStudentModal(false);
      setStudentForm({
        fullName: '',
        phone: '',
        email: '',
        rankGrade: '1. SG (Öğrenci Derecesi)',
        unitGroup: 'İl Jandarma Komutanlığı A Takımı',
      });
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error('Öğrenci eklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 flex font-sans">
      <Toaster position="top-right" />

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddNewMember={() => setShowStudentModal(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Component */}
        <Header
          user={user}
          trainerProfile={trainerProfile}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSeedData={handleSeedData}
          seeding={seeding}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          {/* Active Tab: Dashboard (Görseldeki İki Sütunlu Bento Düzeti) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Metrik Kartları */}
              <StatCards
                studentsCount={students.length}
                paymentPlansCount={paymentPlans.length}
                trainerName={trainerProfile?.fullName?.split(' ')[0] || 'Sifu'}
              />

              {/* Görseldeki İki Sütunlu Düzen: Sol (Günlük Plan) & Sağ (Gelir Gelişimi & Özeti) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Sol Sütun (4/12): Günlük Ders Planı */}
                <div className="lg:col-span-5">
                  <DailyTrainingPlan
                    trainingPlans={trainingPlans}
                    onAddPlan={() => handleOpenPlanModal()}
                    onOpenAllPlans={() => setActiveTab('trainingPlans')}
                  />
                </div>

                {/* Sağ Sütun (7/12): Gelir Gelişimi & İşlemler Tablosu */}
                <div className="lg:col-span-7">
                  <FinancialSummary
                    paymentPlans={paymentPlans}
                    onPayInstallment={handlePayInstallment}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Active Tab: Students (Öğrenci Tablosu) */}
          {activeTab === 'students' && (
            <StudentListTable
              students={students}
              onAddStudent={() => setShowStudentModal(true)}
              searchQuery={searchQuery}
            />
          )}

          {/* Active Tab: Financials (Finans & Ödeme Grupları) */}
          {activeTab === 'financials' && (
            <FinancialSummary
              paymentPlans={paymentPlans}
              onPayInstallment={handlePayInstallment}
            />
          )}

          {/* Active Tab: Training Plans (Eğitim Planları Düzenleme) */}
          {activeTab === 'trainingPlans' && (
            <div className="space-y-6">
              <DailyTrainingPlan
                trainingPlans={trainingPlans}
                onAddPlan={() => handleOpenPlanModal()}
                onOpenAllPlans={() => {}}
              />
            </div>
          )}

          {/* Active Tab: Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4 max-w-2xl">
              <h3 className="text-xl font-extrabold text-gray-900">Eğitmen & Sistem Ayarları</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div><span className="font-bold text-gray-900">Eğitmen:</span> {trainerProfile?.fullName || 'Sifu Ali Yılmaz'}</div>
                <div><span className="font-bold text-gray-900">E-posta:</span> {user?.email}</div>
                <div><span className="font-bold text-gray-900">Auth UID:</span> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-red-600 font-mono">{user?.uid}</code></div>
                <div><span className="font-bold text-gray-900">Birlik / Şube:</span> TA Wing Tsun - İl Jandarma Komutanlığı</div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Plan Add/Edit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900">
              {editingPlanId ? 'Eğitim Planını Düzenle' : 'Yeni Antrenman Planı Ekle'}
            </h3>
            <form onSubmit={handleSavePlan} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">PROGRAM TÜRÜ</label>
                <select
                  value={planForm.type}
                  onChange={(e) => setPlanForm({ ...planForm, type: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                >
                  <option value="weekly">Haftalık Müfredat</option>
                  <option value="daily">Günlük Program</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">PROGRAM BAŞLIĞI</label>
                <input
                  type="text"
                  value={planForm.periodTitle}
                  onChange={(e) => setPlanForm({ ...planForm, periodTitle: e.target.value })}
                  placeholder="ör. 23-29 Temmuz Haftalık Programı"
                  required
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">HEDEF SEVİYE / DERECELER</label>
                <input
                  type="text"
                  value={planForm.targetGrade}
                  onChange={(e) => setPlanForm({ ...planForm, targetGrade: e.target.value })}
                  placeholder="ör. 1. SG - 4. SG Sporcuları"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ODAK TEKNİKLER (Virgülle Ayırın)</label>
                <input
                  type="text"
                  value={planForm.focusTopicsText}
                  onChange={(e) => setPlanForm({ ...planForm, focusTopicsText: e.target.value })}
                  placeholder="Siu Nim Tao, Pak Sao Drili, Lat Sao"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">NOTLAR</label>
                <textarea
                  value={planForm.notes}
                  onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D32F2F] text-white rounded-xl font-bold shadow-md"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Yeni Sporcu Kaydı</h3>
            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">AD SOYAD</label>
                <input
                  type="text"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                  required
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">TELEFON</label>
                <input
                  type="text"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="+90 555 123 45 67"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">E-POSTA</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="ahmet@gmail.com"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">SEVİYE / DERECE</label>
                <select
                  value={studentForm.rankGrade}
                  onChange={(e) => setStudentForm({ ...studentForm, rankGrade: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                >
                  <option value="1. SG (Öğrenci Derecesi)">1. SG (Öğrenci Derecesi)</option>
                  <option value="2. SG (Öğrenci Derecesi)">2. SG (Öğrenci Derecesi)</option>
                  <option value="3. SG (Öğrenci Derecesi)">3. SG (Öğrenci Derecesi)</option>
                  <option value="4. SG (Öğrenci Derecesi)">4. SG (Öğrenci Derecesi)</option>
                  <option value="1. TG (Eğitmen Derecesi)">1. TG (Eğitmen Derecesi)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D32F2F] text-white rounded-xl font-bold shadow-md"
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

export default DashboardPage;
