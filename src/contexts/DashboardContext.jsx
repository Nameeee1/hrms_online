import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../js/firebase';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    hhiCount: 0,
    rahyoCount: 0,
    loading: true,
    lastUpdated: null
  });

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      const employeesRef = collection(db, 'employees');
      
      // Get total count
      const totalSnapshot = await getCountFromServer(employeesRef);
      
      // Get HHI count
      const hhiQuery = query(employeesRef, where('organization', '==', 'HHI'));
      const hhiSnapshot = await getCountFromServer(hhiQuery);
      
      // Get RAHYO count
      const rahyoQuery = query(employeesRef, where('organization', '==', 'RAHYO'));
      const rahyoSnapshot = await getCountFromServer(rahyoQuery);
      
      setDashboardData({
        totalEmployees: totalSnapshot.data().count,
        hhiCount: hhiSnapshot.data().count,
        rahyoCount: rahyoSnapshot.data().count,
        loading: false,
        lastUpdated: new Date()
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  // Refresh data function that can be called from components
  const refreshDashboardData = async () => {
    await fetchDashboardData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    
    // Set up refresh interval (e.g., every 5 minutes)
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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
