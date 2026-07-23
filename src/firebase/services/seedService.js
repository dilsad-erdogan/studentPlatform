import { createOrUpdateTrainerProfile } from './trainerService';
import { addStudent, getStudents } from './studentService';
import { addPaymentPlan, getPaymentPlans } from './paymentService';
import { addTrainingPlan, getTrainingPlans } from './trainingPlanService';

export const seedInitialData = async (currentAuthUid = 'demo_trainer_uid', userEmail = 'admin@gmail.com') => {
  try {
    console.log('Seeding initial Firestore test data...');

    // 1. Create/Update Trainer linked to current Auth UID
    const trainer = await createOrUpdateTrainerProfile(currentAuthUid, {
      fullName: 'Sifu Ali Yılmaz',
      email: userEmail,
      phone: '+90 532 100 20 30',
      title: '3. TG Kıdemli Wing Tsun Eğitmeni',
      specialties: ['Wing Tsun Temel Formlar', 'Lat Sao & Chi Sao', 'Yakın Dövüş Savunma'],
      role: 'head_instructor',
    });

    // 2. Add Students if none exist
    const existingStudents = await getStudents();
    let studentIds = [];
    if (existingStudents.length === 0) {
      const s1 = await addStudent({
        fullName: 'Ahmet Yılmaz',
        phone: '+90 555 123 45 67',
        email: 'ahmet.yilmaz@jandarma.gov.tr',
        rankGrade: '2. SG (Öğrenci Derecesi)',
        unitGroup: 'İl Jandarma A Takımı',
        trainerId: currentAuthUid,
        status: 'Aktif',
      });
      const s2 = await addStudent({
        fullName: 'Mehmet Demir',
        phone: '+90 555 987 65 43',
        email: 'mehmet.demir@jandarma.gov.tr',
        rankGrade: '4. SG (Öğrenci Derecesi)',
        unitGroup: 'İl Jandarma A Takımı',
        trainerId: currentAuthUid,
        status: 'Aktif',
      });
      const s3 = await addStudent({
        fullName: 'Ayşe Kaya',
        phone: '+90 555 444 33 22',
        email: 'ayse.kaya@gmail.com',
        rankGrade: '1. SG (Öğrenci Derecesi)',
        unitGroup: 'İl Jandarma B Takımı',
        trainerId: currentAuthUid,
        status: 'Aktif',
      });
      studentIds = [s1.id, s2.id, s3.id];
    } else {
      studentIds = existingStudents.map(s => s.id);
    }

    // 3. Add Installment Payment Plans if none exist
    const existingPlans = await getPaymentPlans();
    if (existingPlans.length === 0 && studentIds.length > 0) {
      await addPaymentPlan({
        studentId: studentIds[0],
        studentName: 'Ahmet Yılmaz',
        title: '2026 Yıllık Aidat ve Üniforma Paketi',
        totalAmount: 12000,
        totalInstallments: 4,
        status: 'Devam Ediyor',
        installments: [
          { installmentNo: 1, dueDate: '2026-01-15', amount: 3000, status: 'Ödendi', paidDate: '2026-01-14', paymentMethod: 'Kredi Kartı' },
          { installmentNo: 2, dueDate: '2026-04-15', amount: 3000, status: 'Ödendi', paidDate: '2026-04-10', paymentMethod: 'EFT/Havale' },
          { installmentNo: 3, dueDate: '2026-07-15', amount: 3000, status: 'Bekliyor', paidDate: null, paymentMethod: null },
          { installmentNo: 4, dueDate: '2026-10-15', amount: 3000, status: 'Bekliyor', paidDate: null, paymentMethod: null },
        ],
      });

      await addPaymentPlan({
        studentId: studentIds[1],
        studentName: 'Mehmet Demir',
        title: 'Ekipman Paketi (Tahta Adam & Kelebek Bıçak Ekipmanı)',
        totalAmount: 4500,
        totalInstallments: 3,
        status: 'Devam Ediyor',
        installments: [
          { installmentNo: 1, dueDate: '2026-06-01', amount: 1500, status: 'Ödendi', paidDate: '2026-06-01', paymentMethod: 'Nakit' },
          { installmentNo: 2, dueDate: '2026-07-01', amount: 1500, status: 'Ödendi', paidDate: '2026-07-02', paymentMethod: 'Kredi Kartı' },
          { installmentNo: 3, dueDate: '2026-08-01', amount: 1500, status: 'Bekliyor', paidDate: null, paymentMethod: null },
        ],
      });
    }

    // 4. Add Training Plans (Weekly & Daily) if none exist
    const existingTrainingPlans = await getTrainingPlans(currentAuthUid);
    if (existingTrainingPlans.length === 0) {
      // Weekly Plan
      await addTrainingPlan({
        trainerId: currentAuthUid,
        trainerName: 'Sifu Ali Yılmaz',
        type: 'weekly',
        periodTitle: '20 - 26 Temmuz Haftalık Müfredatı',
        targetGrade: '1. SG - 4. SG Öğrencileri',
        focusTopics: ['Siu Nim Tao 1. ve 2. Bölüm', 'Pak Sao & Lap Sao Drilleri', 'Korkuluk ve Tehdit Savunması'],
        dailyDetails: [
          { day: 'Pazartesi', topic: 'Temel Duruş (Man Sao / Wu Sao) ve Siu Nim Tao Formu', duration: '90 dk' },
          { day: 'Çarşamba', topic: 'Adımlama ve Pak Sao Refleks Çalışmaları', duration: '90 dk' },
          { day: 'Cuma', topic: 'Poon Sao (Döner Eller) ve Lat Sao Egzersizleri', duration: '90 dk' },
        ],
        notes: 'Cuma antrenmanı sonunda 2. SG seviyesindeki sporcular için ara seviye değerlendirmesi yapılacaktır.',
        isCompleted: false,
      });

      // Daily Plan
      await addTrainingPlan({
        trainerId: currentAuthUid,
        trainerName: 'Sifu Ali Yılmaz',
        type: 'daily',
        periodTitle: 'Bugünün Antrenman Programı (Perşembe Özel Dersi)',
        targetGrade: 'Eğitmen Adayları & 4. SG Sporcular',
        focusTopics: ['Chum Kiu Formu', 'Biu Jee Giriş Teknikleri', 'Chi Sao Serbest Çıkış'],
        dailyDetails: [
          { time: '18:00 - 18:30', topic: 'Isınma, Eklem Mobilizasyonu ve Yumruk Serileri' },
          { time: '18:30 - 19:30', topic: 'Chum Kiu 1. Bölüm Adımlama ve Açı Değiştirme' },
          { time: '19:30 - 20:00', topic: 'Kapanış ve Eğitmen Geri Bildirimleri' },
        ],
        notes: 'Salonda tahta adam ekipmanları hazır bulundurulsun.',
        isCompleted: false,
      });
    }

    return {
      success: true,
      message: 'Firestore test verileri (Eğitmen, Öğrenciler, Taksitli Ödeme Grupları, Günlük/Haftalık Eğitim Planları) başarıyla yüklendi!',
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
