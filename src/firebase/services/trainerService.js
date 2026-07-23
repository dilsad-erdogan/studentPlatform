import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase';

const COLLECTION_NAME = 'trainers';

// Get all trainers
export const getTrainers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

// Get trainer profile by Auth UID
export const getTrainerByUid = async (uid) => {
  if (!uid) return null;
  try {
    const docRef = doc(firestore, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    // Fallback search by uid field
    const q = query(collection(firestore, COLLECTION_NAME), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return { id: firstDoc.id, ...firstDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching trainer by UID:', error);
    throw error;
  }
};

// Create or update trainer profile linked to Auth UID
export const createOrUpdateTrainerProfile = async (uid, trainerData) => {
  if (!uid) throw new Error('UID is required to save trainer profile');
  try {
    const docRef = doc(firestore, COLLECTION_NAME, uid);
    const dataToSave = {
      uid,
      fullName: trainerData.fullName || 'Eğitmen',
      email: trainerData.email || '',
      phone: trainerData.phone || '',
      title: trainerData.title || 'Wing Tsun Eğitmeni',
      specialties: trainerData.specialties || ['Wing Tsun Temel'],
      role: trainerData.role || 'trainer',
      updatedAt: serverTimestamp(),
    };

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, dataToSave);
    } else {
      await setDoc(docRef, {
        ...dataToSave,
        createdAt: serverTimestamp(),
      });
    }
    return { id: uid, ...dataToSave };
  } catch (error) {
    console.error('Error saving trainer profile:', error);
    throw error;
  }
};
