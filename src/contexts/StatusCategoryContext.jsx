import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  addStatusCategory as addCategoryService, 
  getStatusCategories as getCategoriesService, 
  deleteStatusCategory as deleteCategoryService,
  updateStatusCategory as updateCategoryService 
} from '../js/statusCategoryService';
import { useAuth } from './AuthContext';

const StatusCategoryContext = createContext();

export const StatusCategoryProvider = ({ children }) => {
  const [statusCategories, setStatusCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const loadStatusCategories = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const categories = await getCategoriesService();
      setStatusCategories(categories);
      setError(null);
    } catch (err) {
      console.error('Failed to load status categories:', err);
      setError('Failed to load status categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadStatusCategories();
  }, [loadStatusCategories]);

  const addStatusCategory = async (categoryData) => {
    try {
      if (!categoryData.name?.trim()) return;
      
      const newCategory = await addCategoryService({
        name: categoryData.name.trim(),
        color: categoryData.color || '#1890ff',
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
      });
      setStatusCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Failed to add status category:', err);
      throw err;
    }
  };

  const removeStatusCategory = async (id) => {
    try {
      await deleteCategoryService(id);
      setStatusCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Failed to delete status category:', err);
      throw err;
    }
  };

  const updateStatusCategory = async (id, updates) => {
    try {
      const updatedCategory = await updateCategoryService(id, updates);
      setStatusCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updatedCategory } : cat)
      );
      return updatedCategory;
    } catch (err) {
      console.error('Failed to update status category:', err);
      throw err;
    }
  };

  return (
    <StatusCategoryContext.Provider value={{ 
      statusCategories, 
      loading, 
      error,
      addStatusCategory, 
      removeStatusCategory,
      updateStatusCategory 
    }}>
      {children}
    </StatusCategoryContext.Provider>
  );
};

export const useStatusCategories = () => {
  const context = useContext(StatusCategoryContext);
  if (!context) {
    throw new Error('useStatusCategories must be used within a StatusCategoryProvider');
  }
  return context;
};
