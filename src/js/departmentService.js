import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

const DEPARTMENTS_COLLECTION = 'departments';

export const addDepartment = async (departmentData) => {
  try {
    const { name, icon = 'Building2' } = departmentData;
    const docRef = doc(collection(db, DEPARTMENTS_COLLECTION));
    const newDepartment = {
      name: name.trim(),
      icon,
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, newDepartment);
    return { id: docRef.id, ...newDepartment };
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const getDepartments = async () => {
  try {
    const q = query(collection(db, DEPARTMENTS_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting departments:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    await deleteDoc(doc(db, DEPARTMENTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

export const updateDepartment = async (id, updates) => {
  try {
    const deptRef = doc(db, DEPARTMENTS_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(deptRef, updateData);
    
    // Return the updated department data
    const deptDoc = await getDoc(deptRef);
    if (!deptDoc.exists()) {
      throw new Error('Department not found');
    }
    return { id: deptDoc.id, ...deptDoc.data() };
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};
