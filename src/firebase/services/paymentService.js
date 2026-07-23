import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase';

const COLLECTION_NAME = 'paymentPlans';

// Fetch all payment plans
export const getPaymentPlans = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    throw error;
  }
};

// Create a new installment payment plan
export const addPaymentPlan = async (planData) => {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTION_NAME), {
      studentId: planData.studentId,
      studentName: planData.studentName,
      title: planData.title || 'Aidat ve Eğitim Paketi',
      totalAmount: planData.totalAmount || 0,
      totalInstallments: planData.totalInstallments || 1,
      status: planData.status || 'Devam Ediyor',
      installments: planData.installments || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...planData };
  } catch (error) {
    console.error('Error creating payment plan:', error);
    throw error;
  }
};

// Mark a specific installment as paid
export const payInstallment = async (planId, installmentNo, paymentDetails = {}) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, planId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Payment plan not found');
    }

    const plan = docSnap.data();
    const updatedInstallments = (plan.installments || []).map((inst) => {
      if (inst.installmentNo === installmentNo) {
        return {
          ...inst,
          status: 'Ödendi',
          paidDate: paymentDetails.paidDate || new Date().toISOString().split('T')[0],
          paymentMethod: paymentDetails.paymentMethod || 'Kredi Kartı',
        };
      }
      return inst;
    });

    const allPaid = updatedInstallments.every((inst) => inst.status === 'Ödendi');

    await updateDoc(docRef, {
      installments: updatedInstallments,
      status: allPaid ? 'Tamamlandı' : 'Devam Ediyor',
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error recording installment payment:', error);
    throw error;
  }
};
