import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase';

const COLLECTION_NAME = 'students';

// Get all students
export const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Add a new student
export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTION_NAME), {
      fullName: studentData.fullName,
      phone: studentData.phone || '',
      email: studentData.email || '',
      rankGrade: studentData.rankGrade || '1. SG',
      unitGroup: studentData.unitGroup || 'İl Jandarma A Takımı',
      trainerId: studentData.trainerId || null,
      status: studentData.status || 'Aktif',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...studentData };
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

// Update an existing student
export const updateStudent = async (studentId, updateData) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, studentId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (studentId) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, studentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
