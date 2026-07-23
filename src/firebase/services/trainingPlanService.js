import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase';

const COLLECTION_NAME = 'trainingPlans';

// Fetch training plans (optionally filtered by trainerId)
export const getTrainingPlans = async (trainerId = null) => {
  try {
    let q;
    if (trainerId) {
      q = query(collection(firestore, COLLECTION_NAME), where('trainerId', '==', trainerId));
    } else {
      q = collection(firestore, COLLECTION_NAME);
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching training plans:', error);
    throw error;
  }
};

// Add a new training plan (Daily or Weekly)
export const addTrainingPlan = async (planData) => {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTION_NAME), {
      trainerId: planData.trainerId || 'guest',
      trainerName: planData.trainerName || 'Eğitmen',
      type: planData.type || 'weekly', // 'weekly' | 'daily'
      periodTitle: planData.periodTitle || 'Genel Müfredat Programı',
      targetGrade: planData.targetGrade || '1. SG - 4. SG',
      focusTopics: planData.focusTopics || [],
      dailyDetails: planData.dailyDetails || [],
      notes: planData.notes || '',
      isCompleted: planData.isCompleted || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...planData };
  } catch (error) {
    console.error('Error creating training plan:', error);
    throw error;
  }
};

// Update existing training plan
export const updateTrainingPlan = async (planId, updateData) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, planId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating training plan:', error);
    throw error;
  }
};

// Delete a training plan
export const deleteTrainingPlan = async (planId) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, planId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting training plan:', error);
    throw error;
  }
};
