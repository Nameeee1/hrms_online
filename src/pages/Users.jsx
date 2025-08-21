import { useState, useEffect, useRef } from 'react';
import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { 
  MainContent, 
  DashboardHeader, 
  HeaderActions, 
  UserSelect, 
  SaveButton, 
  PermissionsContainer, 
  PermissionSection, 
  PermissionGroup, 
  PermissionTitle, 
  PermissionControls, 
  PermissionControl, 
  PermissionLabel,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  ModalButton,
  CloseButton
} from '../styles/UsersStyle';
import { StyledSider } from '../styles/SiderStyle';
import { Layout, Typography } from 'antd';
import { useSnackbar } from 'notistack';
const { Title } = Typography;
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { StyledTableCell, StyledTableRow, SearchContainer, SearchInput, SearchIcon, TableToolbar } from '../styles/EmployeesStyle';
import { auth, db, app } from '../js/firebase';
import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  collection
} from 'firebase/firestore';
import Switch from '../components/Switch';
import { Pencil, Eye, Trash } from 'lucide-react';

const columns = [
  { id: 'fullName', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'role', label: 'Role', minWidth: 120 },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 100,
    format: (value, row) => (
      <span style={{ 
        color: value?.login === false ? '#ff4d4f' : '#52c41a',
        fontWeight: 500
      }}>
        {value?.login === false ? 'Inactive' : 'Active'}
      </span>
    )
  },
  { id: 'lastLogin', label: 'Last Login', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' },
];

// Default permissions structure
const defaultPermissions = {
  employees: { read: false, write: false, update: false, delete: false },
  applicants: { read: false, write: false, update: false, delete: false },
  account: { login: true } // Add login access control
};

export default function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [collapsed, setCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [lastFetched, setLastFetched] = useState(null);
  const usersCache = useRef({ permissions: {} });
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  // Set up real-time listener for users collection
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    
    // Create a real-time subscription
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const usersList = [];
        
        querySnapshot.forEach((doc) => {
          usersList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setUsers(usersList);
        setLastFetched(new Date().toLocaleTimeString());
      },
      (error) => {
        console.error('Error in users listener:', error);
        enqueueSnackbar('Error loading users', { variant: 'error' });
      }
    );
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [enqueueSnackbar]);

  const filteredRows = users.map(user => ({
    ...user,
    status: {
      login: user.permissions?.account?.login !== false // Default to true if not set
    }
  })).filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.fullName?.toLowerCase().includes(searchLower) || '') ||
      (user.email?.toLowerCase().includes(searchLower) || '') ||
      (user.role?.toLowerCase().includes(searchLower) || '')
    );
  });

  const handlePermissionChange = (entity, permission, value) => {
    // Don't allow disabling login for admin users
    if (entity === 'account' && permission === 'login' && value === false) {
      const user = users.find(u => u.id === selectedUser);
      if (user?.role === 'admin') {
        enqueueSnackbar('Cannot disable login for admin users', { variant: 'warning' });
        return;
      }
    }
    
    // For account login, we want to store the exact value
    if (entity === 'account' && permission === 'login') {
      setPermissions(prev => ({
        ...prev,
        account: {
          ...prev.account,
          login: value
        }
      }));
    } else {
      setPermissions(prev => ({
        ...prev,
        [entity]: {
          ...prev[entity],
          [permission]: value
        }
      }));
    }
  };

  const renderPermissionSwitches = (entity) => (
    <PermissionSection>
      <PermissionGroup>
        <PermissionTitle>
          {entity === 'account' ? 'Account Settings' : `${entity.charAt(0).toUpperCase() + entity.slice(1)} Permissions`}
        </PermissionTitle>
        <PermissionControls>
          {Object.entries(permissions[entity]).map(([permission, value]) => {
            // For account settings, we want the switch to show the opposite of the stored value
            // When switch is ON (true), login is ENABLED (true)
            // When switch is OFF (false), login is DISABLED (false)
            const isAccountLogin = entity === 'account' && permission === 'login';
            const checked = isAccountLogin 
              ? value !== false // If value is not explicitly false, consider it true
              : value;
              
            return (
              <PermissionControl key={`${entity}-${permission}`}>
                <PermissionLabel>
                  {permission === 'login' ? 'Allow Login' : permission.charAt(0).toUpperCase() + permission.slice(1)}
                </PermissionLabel>
                <Switch 
                  checked={checked}
                  onChange={(e) => {
                    // For account login, we store the inverse of the switch value
                    // Switch ON (true) -> login ENABLED (true)
                    // Switch OFF (false) -> login DISABLED (false)
                    const newValue = isAccountLogin ? e.target.checked : e.target.checked;
                    handlePermissionChange(entity, permission, newValue);
                  }}
                  disabled={entity === 'account' && permission === 'login' && users.find(u => u.id === selectedUser)?.role === 'admin'}
                />
                {isAccountLogin && (
                  <span style={{ 
                    marginLeft: '8px', 
                    color: checked ? '#52c41a' : '#ff4d4f',
                    fontWeight: 500
                  }}>
                    {checked ? 'Login Enabled' : 'Login Disabled'}
                  </span>
                )}
              </PermissionControl>
            );
          })}
        </PermissionControls>
      </PermissionGroup>
    </PermissionSection>
  );

  const handleUserSelect = async (userId) => {
    if (!userId) {
      setPermissions(defaultPermissions);
      return;
    }
    
    setSelectedUser(userId);
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Ensure permissions has the account.login property
        const userPermissions = {
          ...defaultPermissions,
          ...userData.permissions,
          account: {
            ...defaultPermissions.account,
            ...(userData.permissions?.account || {})
          }
        };
        
        // Cache the permissions
        usersCache.current.permissions[userId] = userPermissions;
        setPermissions(userPermissions);
      } else {
        setPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      enqueueSnackbar('Error loading user permissions', { variant: 'error' });
      setPermissions(defaultPermissions);
    }
  };

  // State for view mode
  const [isViewMode, setIsViewMode] = useState(false);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle opening the edit modal
  const handleEditUser = (user) => {
    setIsViewMode(false);
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setIsEditModalOpen(true);
  };

  // Handle viewing user details
  const handleViewUser = (user) => {
    setIsViewMode(true);
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (user, e) => {
    e?.stopPropagation();
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Handle user deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to delete users');
      }
      
      // Get current user's document
      const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!currentUserDoc.exists()) {
        throw new Error('User not found');
      }
      
      const currentUserData = currentUserDoc.data();
      const isSuperAdmin = currentUserData.role === 'SuperAdmin';
      
      // If not SuperAdmin, check specific permissions
      if (!isSuperAdmin) {
        const entity = userToDelete.role === 'Employee' ? 'employees' : 'applicants';
        
        // Check if user has delete permission for the entity
        if (!hasPermission(currentUserData, 'delete', entity)) {
          throw new Error(`You don't have permission to delete ${entity}`);
        }
      }
      
      // Get the current user's ID token
      const idToken = await currentUser.getIdToken();
      
      // Call the HTTP function
      const response = await fetch('https://us-central1-hrms-3abba.cloudfunctions.net/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ userId: userToDelete.id })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      
      enqueueSnackbar('User and authentication deleted successfully', { variant: 'success' });
      handleDialogClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar(error.message || 'Failed to delete user', { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Check if current user can edit a specific user
  const canEditUser = (user) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // If current user is the same as the user being edited
    if (currentUser.uid === user.id) return true;
    
    const currentUserData = users.find(u => u.id === currentUser.uid);
    if (!currentUserData) return false;
    
    // SuperAdmin can edit anyone
    if (currentUserData.role === 'SuperAdmin') return true;
    
    // Check specific permissions based on user role
    const entity = user.role === 'Employee' ? 'employees' : 'applicants';
    return hasPermission(currentUserData, 'update', entity);
  };
  
  // Check if current user can delete a specific user
  const canDeleteUser = (user) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // Prevent users from deleting themselves
    if (currentUser.uid === user.id) return false;
    
    const currentUserData = users.find(u => u.id === currentUser.uid);
    if (!currentUserData) return false;
    
    // SuperAdmin can delete anyone (except themselves, handled above)
    if (currentUserData.role === 'SuperAdmin') return true;
    
    // Check specific permissions based on user role
    const entity = user.role === 'Employee' ? 'employees' : 'applicants';
    return hasPermission(currentUserData, 'delete', entity);
  };

  // Helper function to check user permissions
  const hasPermission = (user, action, entity) => {
    if (!user) return false;
    if (user.role === 'SuperAdmin') return true;
    
    const entityPermissions = user.permissions?.[entity];
    if (!entityPermissions) return false;
    
    return entityPermissions[action] === true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to update user data');
      }
      
      // Get current user's document
      const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!currentUserDoc.exists()) {
        throw new Error('User not found');
      }
      
      const currentUserData = currentUserDoc.data();
      const isSuperAdmin = currentUserData.role === 'SuperAdmin';
      
      // If not SuperAdmin, check specific permissions
      if (!isSuperAdmin) {
        const entity = editingUser.role === 'Employee' ? 'employees' : 'applicants';
        
        // Check if user has update permission for the entity
        if (!hasPermission(currentUserData, 'update', entity)) {
          throw new Error(`You don't have permission to update ${entity}`);
        }
      }
      
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData, updatedAt: new Date().toISOString() }
            : user
        )
      );
      
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      enqueueSnackbar(error.message || 'Failed to update user', { variant: 'error' });
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'users', selectedUser);
      
      // Get current user's role
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to update permissions');
      }
      
      const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!currentUserDoc.exists()) {
        throw new Error('User not found');
      }
      
      const currentUserData = currentUserDoc.data();
      const isSuperAdmin = currentUserData.role === 'SuperAdmin';
      
      // Only proceed if current user is a SuperAdmin
      if (!isSuperAdmin) {
        throw new Error('Only SuperAdmins can update user permissions');
      }
      
      // Create the permissions object to save
      const permissionsToSave = {
        ...permissions,
        account: {
          ...permissions.account,
          // Preserve the exact login value from the state
          login: permissions.account?.login
        }
      };
      
      // Update the document with the exact permissions
      await updateDoc(userRef, {
        permissions: permissionsToSave,
        // Add a timestamp for the update
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });
      
      // Update the local users state to reflect the changes
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser 
            ? { 
                ...user, 
                permissions: permissionsToSave,
                updatedAt: new Date().toISOString(),
                updatedBy: currentUser.uid
              } 
            : user
        )
      );
      
      // Update the cache
      usersCache.current.permissions[selectedUser] = permissionsToSave;
      
      enqueueSnackbar('Permissions updated successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error updating permissions:', error);
      enqueueSnackbar(error.message || 'Failed to update permissions', { variant: 'error' });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <StyledSider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        collapsedWidth={60}
        width={160}
        trigger={null}
      >
        <Logo />
        <MenuList />
      </StyledSider>
      <MainContent className={collapsed ? 'collapsed' : 'expanded'}>
        <DashboardHeader>
          <Title level={3} style={{ margin: 0 }}>Users</Title>
          <HeaderActions>
            <div>
              <label style={{ marginRight: '10px', fontWeight: '500', color: '#880808' }}>Select User:</label>
              <UserSelect 
                value={selectedUser} 
                onChange={(e) => handleUserSelect(e.target.value)}
              >
                <option value="">-- Select a user --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.role})
                  </option>
                ))}
              </UserSelect>
            </div>
            <SaveButton 
              onClick={handleSavePermissions}
              disabled={!selectedUser}
            >
              Save Permissions
            </SaveButton>
          </HeaderActions>
        </DashboardHeader>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px', position: 'relative' }}>
            <TableToolbar>
            <SearchContainer>
              <SearchInput
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                name="search"
                type="search"
              />
              <SearchIcon 
                stroke="currentColor" 
                strokeWidth="1.5" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" strokeLinecap="round" strokeLinejoin="round"/>
              </SearchIcon>
            </SearchContainer>
          </TableToolbar>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          
                          if (column.id === 'actions') {
                            return (
                              <StyledTableCell key="actions">
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '100%'
                                }}>
                                  <button 
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: canEditUser(row) ? 'pointer' : 'not-allowed',
                                      color: canEditUser(row) ? '#880808' : '#ccc',
                                      fontSize: '16px',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      opacity: canEditUser(row) ? 1 : 0.5
                                    }}
                                    title={canEditUser(row) ? 'Edit User' : 'No edit permission'}
                                    onClick={() => canEditUser(row) && handleEditUser(row)}
                                    disabled={!canEditUser(row)}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button 
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: '#880808',
                                      fontSize: '16px',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="View User"
                                    onClick={() => handleViewUser(row)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: canDeleteUser(row) ? 'pointer' : 'not-allowed',
                                      color: canDeleteUser(row) ? '#dc3545' : '#ffb3b3',
                                      fontSize: '16px',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      transition: 'all 0.2s',
                                      opacity: canDeleteUser(row) ? 1 : 0.5,
                                      ':hover': canDeleteUser(row) ? {
                                        color: '#a71d2a',
                                        transform: 'scale(1.1)'
                                      } : {}
                                    }}
                                    title={canDeleteUser(row) ? 'Delete User' : 'No delete permission'}
                                    onClick={(e) => canDeleteUser(row) && handleDeleteClick(row, e)}
                                    disabled={!canDeleteUser(row)}
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </StyledTableCell>
                            );
                          }
                          
                          return (
                            <StyledTableCell key={column.id} align={column.align}>
                              {column.format && (typeof value === 'number' || column.id === 'status')
                                ? column.format(value, row)
                                : value}
                            </StyledTableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        
        {selectedUser && (
          <PermissionsContainer>
            <Title level={4} style={{ marginBottom: '20px' }}>
              Permissions for {users.find(u => u.id === selectedUser)?.fullName || 'Selected User'}
            </Title>
            {renderPermissionSwitches('employees')}
            {renderPermissionSwitches('applicants')}
            {renderPermissionSwitches('account')}
          </PermissionsContainer>
        )}
      </MainContent>
      
      {/* User Details/Edit Modal */}
      {isEditModalOpen && (
        <ModalOverlay>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{isViewMode ? 'User Details' : 'Edit User'}</h3>
              <CloseButton onClick={() => setIsEditModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <FormLabel>Full Name</FormLabel>
                  {isViewMode ? (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: '#fafafa',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      color: '#333',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {formData.fullName || 'N/A'}
                    </div>
                  ) : (
                    <FormInput
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  )}
                </FormGroup>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: isViewMode ? '#fafafa' : '#f5f5f5',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    color: '#666',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {formData.email || 'N/A'}
                  </div>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Role</FormLabel>
                  {isViewMode ? (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: '#fafafa',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      color: '#333',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'N/A'}
                    </div>
                  ) : (
                    <FormSelect
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="SuperAdmin">Super Admin</option>
                    </FormSelect>
                  )}
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                {isViewMode ? (
                  <ModalButton 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    style={{ marginLeft: 'auto' }}
                  >
                    Close
                  </ModalButton>
                ) : (
                  <>
                    <ModalButton type="button" onClick={() => setIsEditModalOpen(false)}>
                      Cancel
                    </ModalButton>
                    <ModalButton type="submit" primary>
                      Save Changes
                    </ModalButton>
                  </>
                )}
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete <strong>{userToDelete?.fullName || 'this user'}</strong>? 
            This action cannot be undone and all associated data will be permanently removed.
          </DialogContentText>
          {userToDelete && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px' 
            }}>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Email:</strong> {userToDelete.email || 'N/A'}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Role:</strong> {userToDelete.role ? userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1) : 'N/A'}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDialogClose} 
            disabled={isDeleting}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            disabled={isDeleting}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              background: 'linear-gradient(135deg, #880808, #a82a2a)',
              '&:hover': {
                background: 'linear-gradient(135deg, #9a0a0a, #b83232)',
              },
              '&.Mui-disabled': {
                background: '#f5f5f5',
                color: '#bdbdbd'
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
