import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  addDepartment as addDeptService, 
  getDepartments as getDeptsService, 
  deleteDepartment as deleteDeptService,
  updateDepartment as updateDeptService 
} from '../js/departmentService';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const loadDepartments = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const depts = await getDeptsService();
      setDepartments(depts);
      setError(null);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError('Failed to load departments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const addDepartment = async (departmentData) => {
    try {
      if (!departmentData.name?.trim()) return;
      
      const newDept = await addDeptService({
        name: departmentData.name.trim(),
        icon: departmentData.icon || 'Building2'
      });
      setDepartments(prev => [...prev, newDept]);
      return newDept;
    } catch (err) {
      console.error('Failed to add department:', err);
      throw err;
    }
  };

  const removeDepartment = async (id) => {
    try {
      await deleteDeptService(id);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
    } catch (err) {
      console.error('Failed to delete department:', err);
      throw err;
    }
  };

  const updateDepartment = async (id, updates) => {
    try {
      const updatedDept = await updateDeptService(id, updates);
      setDepartments(prev => 
        prev.map(dept => dept.id === id ? { ...dept, ...updatedDept } : dept)
      );
      return updatedDept;
    } catch (err) {
      console.error('Failed to update department:', err);
      throw err;
    }
  };

  return (
    <DepartmentContext.Provider value={{ 
      departments, 
      loading, 
      error,
      addDepartment, 
      removeDepartment,
      updateDepartment 
    }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
};
