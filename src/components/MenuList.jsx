import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import styled from 'styled-components';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../js/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, closeSnackbar } from 'notistack';
import { 
    DashboardOutlined, 
    SettingOutlined, 
    AppstoreOutlined, 
    UsergroupAddOutlined, 
    UserOutlined,
    LogoutOutlined  
} from "@ant-design/icons";

const StyledMenu = styled(Menu)`
  background-color: #1e1e1e !important;
  color: white !important;
  border-right: none !important;
  flex: 1;
  margin-top: 20px;
  
  .ant-menu-item {
    color: rgba(255, 255, 255, 0.65) !important;
    margin: 4px 0 !important;
    padding: 0 16px !important;
    height: 40px !important;
    line-height: 40px !important;
    border-radius: 4px !important;
    margin: 4px 8px !important;
    
    &:hover {
      color: white !important;
      background-color: #1890ff !important;
    }
    
    &.ant-menu-item-selected {
      background-color: #1890ff !important;
      color: white !important;
    }
    
    .anticon {
      font-size: 18px;
      margin-right: 10px;
    }
  }
  
  .ant-menu-item.logout {
    margin-top: auto !important;
    margin-bottom: 20px !important;
  }
`;

const MenuList = ({ collapsed }) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([window.location.pathname.split('/')[1] || 'dashboard']);
    const [userRole, setUserRole] = useState(() => {
        // Try to get role from localStorage on initial render
        return localStorage.getItem('userRole') || 'user';
    });

    const handleLogout = () => {
        if (isLoggingOut) return; // Prevent multiple dialogs
        setIsLoggingOut(true);
        const key = enqueueSnackbar('Are you sure you want to log out?', {
            variant: 'warning',
            persist: true,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            action: (key) => (
                <>
                    <button 
                        onClick={async () => {
                            closeSnackbar(key);
                            try {
                                await signOut(auth);
                                enqueueSnackbar('Successfully logged out', { 
                                    variant: 'success',
                                    anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    autoHideDuration: 3000,
                                    onClose: () => setIsLoggingOut(false)
                                });
                                // Replace the current entry in the history stack
                                navigate('/', { replace: true });
                                // Prevent going back to the previous page
                                window.history.pushState(null, '', window.location.href);
                                window.onpopstate = () => {
                                    window.history.go(1);
                                };
                            } catch (error) {
                                enqueueSnackbar(error.message, { variant: 'error' });
                            }
                        }}
                        style={{
                            background: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '4px 12px',
                            margin: '0 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Yes
                    </button>
                    <button 
                        onClick={() => {
                            closeSnackbar(key);
                            setIsLoggingOut(false);
                        }}
                        style={{
                            background: '#f5f5f5',
                            color: '#333',
                            border: '1px solid #d9d9d9',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '8px'
                        }}
                    >
                        No
                    </button>
                </>
            )
        });
    };

        // Get user role on component mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Get user document from Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        // Set the user role from Firestore, default to 'user' if not set
                        const role = userDoc.data().role || 'user';
                        setUserRole(role);
                        // Store role in localStorage to persist across page refreshes
                        localStorage.setItem('userRole', role);
                    } else {
                        console.error('User document not found in Firestore');
                        setUserRole('user');
                    }
                } catch (error) {
                    console.error('Error getting user role from Firestore:', error);
                    setUserRole('user');
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => {
                setSelectedKeys(['dashboard']);
                navigate('/dashboard');
            },
            roles: ['admin', 'user'] // Both roles can see dashboard
        },
        {
            key: 'employees',
            icon: <UserOutlined />,
            label: 'Employees',
            onClick: () => {
                setSelectedKeys(['employees']);
                navigate('/employees');
            },
            roles: ['admin', 'user'] // Both roles can see employees
        },
        {
            key: 'applicants',
            icon: <AppstoreOutlined />,
            label: 'Applicants',
            onClick: () => {
                setSelectedKeys(['applicants']);
                navigate('/applicants');
            },
            roles: ['admin', 'user'] // Both roles can see applicants
        },
        {
            key: 'users',
            icon: <UsergroupAddOutlined />,
            label: 'Users',
            onClick: () => {
                setSelectedKeys(['users']);
                navigate('/users');
            },
            roles: ['admin', 'SuperAdmin'] // Only admin and SuperAdmin can see users
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => {
                setSelectedKeys(['settings']);
                navigate('/settings');
            },
            roles: ['admin', 'SuperAdmin'] // Only admin and SuperAdmin can see settings
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            style: { marginTop: 'auto', marginBottom: '20px' },
            className: 'logout-menu-item',
            onClick: (e) => {
                e.domEvent?.stopPropagation();
                handleLogout();
            },
            roles: ['admin', 'user'] // Both roles can logout
        },
    ];

    // Filter menu items based on user role
    const filteredItems = menuItems.filter(item => {
        // If user is SuperAdmin, show all items except those explicitly hidden
        if (userRole === 'SuperAdmin') return true;
        // For other roles, filter based on the roles array
        return item.roles && item.roles.includes(userRole);
    });

    return (
        <Menu 
            theme=""
            mode="inline"
            className={`menubar ${collapsed ? 'collapsed' : ''}`}
            selectedKeys={selectedKeys}
            items={filteredItems}
        />
    );
};

export default MenuList;
