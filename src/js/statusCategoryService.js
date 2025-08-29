import { db } from './firebase';
import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

const STATUS_CATEGORIES_COLLECTION = 'statusCategories';

export const addStatusCategory = async (categoryData) => {
  try {
    const { name, color = '#1890ff', isActive = true } = categoryData;
    const docRef = doc(collection(db, STATUS_CATEGORIES_COLLECTION));
    const newCategory = {
      name: name.trim(),
      color,
      isActive,
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, newCategory);
    return { id: docRef.id, ...newCategory };
  } catch (error) {
    console.error('Error adding status category:', error);
    throw error;
  }
};

export const getStatusCategories = async () => {
  try {
    const q = query(collection(db, STATUS_CATEGORIES_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting status categories:', error);
    throw error;
  }
};

export const deleteStatusCategory = async (id) => {
  try {
    await deleteDoc(doc(db, STATUS_CATEGORIES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting status category:', error);
    throw error;
  }
};

export const updateStatusCategory = async (id, updates) => {
  try {
    const categoryRef = doc(db, STATUS_CATEGORIES_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(categoryRef, updateData);
    
    // Return the updated category data
    const categoryDoc = await getDoc(categoryRef);
    if (!categoryDoc.exists()) {
      throw new Error('Status category not found');
    }
    return { id: categoryDoc.id, ...categoryDoc.data() };
  } catch (error) {
    console.error('Error updating status category:', error);
    throw error;
  }
};
