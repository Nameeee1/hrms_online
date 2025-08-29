import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../js/firebase';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    hhiCount: 0,
    rahyoCount: 0,
    departmentCounts: {},
    loading: true,
    lastUpdated: null
  });

  useEffect(() => {
    const employeesRef = collection(db, 'employees');
    const departmentsRef = collection(db, 'departments');
    
    // Set loading state
    setDashboardData(prev => ({ ...prev, loading: true }));
    
    // Subscribe to employees collection
    const unsubscribeEmployees = onSnapshot(employeesRef, (snapshot) => {
      const totalCount = snapshot.size;
      let activeCount = 0;
      let hhiCount = 0;
      let rahyoCount = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'Active') activeCount++;
        if (data.organization === 'HHI') hhiCount++;
        if (data.organization === 'RAHYO') rahyoCount++;
      });
      
      setDashboardData(prev => ({
        ...prev,
        totalEmployees: totalCount,
        activeEmployees: activeCount,
        hhiCount,
        rahyoCount,
        lastUpdated: new Date()
      }));
    });
    
    // Subscribe to departments collection
    const unsubscribeDepartments = onSnapshot(departmentsRef, async (snapshot) => {
      const departmentCounts = {};
      const employeesSnapshot = await getDocs(employeesRef);
      const employees = employeesSnapshot.docs.map(doc => doc.data());
      
      snapshot.forEach(deptDoc => {
        const deptName = deptDoc.data().name;
        const count = employees.filter(emp => 
          emp.department && Array.isArray(emp.department) && 
          emp.department.includes(deptName)
        ).length;
        departmentCounts[deptName] = count;
      });
      
      setDashboardData(prev => ({
        ...prev,
        departmentCounts,
        loading: false
      }));
    });
    
    // Cleanup function to unsubscribe from listeners
    return () => {
      unsubscribeEmployees();
      unsubscribeDepartments();
    };
  }, []);

  // Refresh data function that can be called from components
  const refreshDashboardData = async () => {
    await fetchDashboardData();
  };

  // Remove the old fetchDashboardData and interval since we're using real-time listeners

  return (
    <DashboardContext.Provider value={{ ...dashboardData, refreshDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
