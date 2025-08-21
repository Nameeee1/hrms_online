import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Pencil, Eye, Trash } from 'lucide-react';
import { Typography, Layout } from 'antd';
import { useSnackbar } from 'notistack';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { getStatusCategories } from '../js/statusCategoryService';
import { db } from '../js/firebase';
import { 
  Button, 
  Modal, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress
} from '@mui/material';

import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { 
  MainContent, 
  ContentArea, 
  DashboardHeader, 
  StyledTableCell, 
  StyledTableRow,
  SearchContainer,
  SearchInput,
  SearchIcon,
  TableToolbar,
  AddButton
} from '../styles/EmployeesStyle';
import { StyledSider } from '../styles/SiderStyle';

const { Title } = Typography;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: 'background.paper',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  p: 0,
  borderRadius: '12px',
  outline: 'none',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:focus': {
    outline: 'none',
  },
};

const headerStyle = {
  p: 3,
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const formStyle = {
  p: 3,
  maxHeight: '70vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
};

const footerStyle = {
  p: 2,
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2,
  backgroundColor: '#f8f9fa',
};

const columns = [
  { id: 'name', label: 'Name', minWidth: 200 },
  { id: 'hiredDate', label: 'Hired Date', minWidth: 120 },
  { id: 'employmentStatus', label: 'Employment Status', minWidth: 160 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'referredBy', label: 'Referred By', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' },
];

export default function Employees() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [collapsed, setCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [statusCategories, setStatusCategories] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    contactNumber: '',
    email: '',
    
    // Employment Details
    organization: '',
    department: [],
    referredBy: '',
    hiredDate: '',
    status: 'Active',
    employmentStatus: ''
  });

  const handleOpen = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      contactNumber: '',
      email: '',
      organization: '',
      department: [],
      referredBy: '',
      hiredDate: '',
      status: 'Active',
      employmentStatus: ''
    });
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setViewingEmployee(false);
  };
  const handleDeleteClose = () => setDeleteConfirmOpen(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        department: checked
          ? [...prev.department, value]
          : prev.department.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Format date for display in the table (M/D/YYYY)
  const formatDateForTable = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  // Format date to YYYY-MM-DD for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Fetch departments and status categories from Firestore on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentsRef = collection(db, 'departments');
        const departmentsQuery = query(departmentsRef);
        const departmentsSnapshot = await getDocs(departmentsQuery);
        const depts = [];
        departmentsSnapshot.forEach((doc) => {
          depts.push(doc.data().name);
        });
        setDepartments(depts);

        // Fetch status categories
        const statusCats = await getStatusCategories();
        setStatusCategories(statusCats);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Failed to load data', { variant: 'error' });
      }
    };

    fetchData();
  }, []);

  const handleView = (employee) => {
    setViewingEmployee(true);
    setEditingEmployee(null);
    setFormData({
      firstName: employee.firstName || employee.name?.split(' ')[0] || '',
      lastName: employee.lastName || employee.name?.split(' ').slice(1).join(' ') || '',
      dateOfBirth: formatDateForInput(employee.dateOfBirth || ''),
      address: employee.address || '',
      contactNumber: employee.contactNumber || '',
      email: employee.email || '',
      organization: employee.organization || '',
      department: Array.isArray(employee.department) ? employee.department : [],
      referredBy: employee.referredBy || '',
      hiredDate: formatDateForInput(employee.hiredDate || ''),
      status: employee.status || 'Active',
      employmentStatus: employee.employmentStatus || ''
    });
    setOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setViewingEmployee(false);
    setFormData({
      firstName: employee.firstName || employee.name?.split(' ')[0] || '',
      lastName: employee.lastName || employee.name?.split(' ').slice(1).join(' ') || '',
      dateOfBirth: formatDateForInput(employee.dateOfBirth || ''),
      address: employee.address || '',
      contactNumber: employee.contactNumber || '',
      email: employee.email || '',
      organization: employee.organization || '',
      department: Array.isArray(employee.department) ? employee.department : [],
      referredBy: employee.referredBy || '',
      hiredDate: formatDateForInput(employee.hiredDate || ''),
      status: employee.status || 'Active',
      employmentStatus: employee.employmentStatus || ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (employee, event) => {
    if (event) {
      event.stopPropagation();
    }
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'employees', employeeToDelete.id));
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Error deleting employee: ', error);
      enqueueSnackbar(`Failed to delete employee: ${error.message}`, { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.organization || !formData.hiredDate || !formData.employmentStatus) {
      console.log('Missing required fields');
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      // Create employee data object
      const employeeData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        updatedAt: serverTimestamp(),
        status: formData.status || 'Active'
      };

      if (editingEmployee) {
        // Update existing employee
        const employeeRef = doc(db, 'employees', editingEmployee);
        await updateDoc(employeeRef, employeeData);
        enqueueSnackbar('Employee updated successfully!', { variant: 'success' });
        console.log('Document updated with ID: ', editingEmployee, 'Data:', employeeData);
      } else {
        // Add new employee
        employeeData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'employees'), employeeData);
        enqueueSnackbar('Employee added successfully!', { variant: 'success' });
        console.log('Document written with ID: ', docRef.id, 'Data:', employeeData);
      }
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        contactNumber: '',
        email: '',
        organization: '',
        department: [],
        referredBy: '',
        hiredDate: '',
        status: 'Active',
        employmentStatus: ''
      });
      
      handleClose();
    } catch (error) {
      console.error('Error adding document: ', error);
      enqueueSnackbar('Failed to add employee: ' + error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

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

  // Cache for employees data
  const [cachedEmployees, setCachedEmployees] = useState([]);
  
  // Set up real-time listener for employees collection
  useEffect(() => {
    // Only set loading if we don't have cached data
    if (cachedEmployees.length === 0) {
      setLoading(true);
    }
    
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, orderBy('createdAt', 'desc'));
    
    // Create a real-time subscription
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const employeesData = [];
        
        querySnapshot.forEach((doc) => {
          const employeeData = {
            id: doc.id,
            ...doc.data(),
            // Format dates for display
            hiredDate: doc.data().hiredDate 
              ? new Date(doc.data().hiredDate).toLocaleDateString() 
              : 'N/A',
            dateOfBirth: doc.data().dateOfBirth 
              ? new Date(doc.data().dateOfBirth).toLocaleDateString() 
              : 'N/A'
          };
          employeesData.push(employeeData);
        });
        
        // Update cache with all employees
        setCachedEmployees(employeesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error in employees listener:', error);
        enqueueSnackbar('Error loading employees', { variant: 'error' });
        setLoading(false);
      }
    );
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Removed searchTerm from dependencies
  
  // Filter employees based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return cachedEmployees;
    
    const searchLower = searchTerm.toLowerCase();
    return cachedEmployees.filter(employee => 
      (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
      (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
      (employee.employmentStatus && employee.employmentStatus.toLowerCase().includes(searchLower)) ||
      (employee.department && employee.department.some(dept => 
        dept.toLowerCase().includes(searchLower)
      ))
    );
  }, [cachedEmployees, searchTerm]);



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
          <Title level={3} style={{ margin: 0 }}>Employees</Title>
        </DashboardHeader>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableToolbar>
            <SearchContainer>
              <SearchInput
                placeholder="Search employees..."
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" 
                />
              </SearchIcon>
            </SearchContainer>
            <AddButton onClick={handleOpen}>
              <Plus size={18} />
              Add Employee
            </AddButton>
            
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              closeAfterTransition
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Box sx={modalStyle}>
                {/* Header */}
                <Box sx={headerStyle}>
                  <Typography variant="h6" component="h2" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    m: 0,
                    fontSize: '1.25rem'
                  }}>
                    {viewingEmployee ? 'View Employee' : (editingEmployee ? 'Edit Employee' : 'Add New Employee')}
                  </Typography>
                  <Button 
                    onClick={handleClose} 
                    sx={{ 
                      minWidth: 'auto', 
                      p: 0.5,
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: 'text.primary',
                      },
                    }}
                  >
                    <X size={20} />
                  </Button>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={viewingEmployee ? (e) => { e.preventDefault(); } : handleSubmit} sx={formStyle}>
                  {/* Personal Details Section */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Personal Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      id="dateOfBirth"
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '0.875rem' },
                      }}
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      id="contactNumber"
                      label="Contact Number"
                      name="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                  </Box>

                  {/* Employment Details Section */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 3, color: 'text.primary' }}>
                    Employment Details
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth size="small" variant="outlined" required>
                      <InputLabel id="organization-label" sx={{ fontSize: '0.875rem' }}>Organization</InputLabel>
                      <Select
                        labelId="organization-label"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        label="Organization"
                        onChange={handleInputChange}
                        disabled={viewingEmployee}
                        sx={{
                          '& .MuiSelect-select': {
                            padding: '8.5px 14px',
                            borderRadius: '8px',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& .MuiSelect-select': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        }}
                      >
                        <MenuItem value="RAHYO">RAHYO</MenuItem>
                        <MenuItem value="HHI">HHI</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl component="fieldset" variant="outlined" fullWidth>
                      <InputLabel shrink sx={{ fontSize: '0.875rem', mb: 0.5, ml: -1.5 }}>Department</InputLabel>
                      <Box sx={{ 
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '8px',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        '&:hover': {
                          borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                        },
                        ...(viewingEmployee && {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          borderColor: 'rgba(0, 0, 0, 0.12)'
                        })

                      }}>
                        {departments.map((dept) => (
                          <Box 
                            key={dept} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              width: '100%',
                              px: 1,
                              py: 0.5,
                              borderRadius: '4px',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`dept-${dept}`}
                              name="department"
                              value={dept}
                              checked={formData.department.includes(dept)}
                              onChange={handleInputChange}
                              disabled={viewingEmployee}
                              style={{ 
                                marginRight: '8px',
                                cursor: viewingEmployee ? 'default' : 'pointer',
                                opacity: viewingEmployee ? 0.7 : 1
                              }}
                            />
                            <label 
                              htmlFor={`dept-${dept}`} 
                              style={{ 
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: '100%'
                              }}
                            >
                              {dept}
                            </label>
                          </Box>
                        ))}
                      </Box>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      id="referredBy"
                      label="Referred By"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: viewingEmployee ? true : undefined,
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      id="hiredDate"
                      label="Hired Date"
                      name="hiredDate"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '0.875rem' },
                      }}
                      value={formData.hiredDate}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      disabled={viewingEmployee}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: viewingEmployee ? 'rgba(0, 0, 0, 0.23)' : 'primary.main',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& input': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={formData.status}
                        label="Status"
                        onChange={handleInputChange}
                        disabled={viewingEmployee}
                        sx={{
                          '& .MuiSelect-select': {
                            padding: '8.5px 14px',
                            borderRadius: '8px',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& .MuiSelect-select': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        }}
                      >
                        {statusCategories.length > 0 ? (
                          statusCategories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: category.color || '#1890ff',
                                    marginRight: 1
                                  }}
                                />
                                {category.name}
                              </Box>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="Active">Active</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" variant="outlined" required>
                      <InputLabel id="employment-status-label" sx={{ fontSize: '0.875rem' }}>Employment Status</InputLabel>
                      <Select
                        labelId="employment-status-label"
                        id="employmentStatus"
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        label="Employment Status"
                        onChange={handleInputChange}
                        disabled={viewingEmployee}
                        sx={{
                          '& .MuiSelect-select': {
                            padding: '8.5px 14px',
                            borderRadius: '8px',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '& .MuiSelect-select': {
                              color: 'rgba(0, 0, 0, 0.87)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            }
                          },
                        }}
                      >
                        <MenuItem value="Intern">Intern</MenuItem>
                        <MenuItem value="Probationary">Probationary</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Footer */}
                <Box sx={footerStyle}>
                  <Button 
                    variant="outlined" 
                    onClick={handleClose}
                    type="button"
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      borderRadius: '6px',
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderColor: 'text.secondary',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  {!viewingEmployee && (
                    <Button 
                      type="submit" 
                      variant="contained"
                      disabled={loading}
                      onClick={handleSubmit}
                      sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderRadius: '6px',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)'
                        }
                      }}
                    >
                      {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Modal>
          </TableToolbar>
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  {searchTerm ? 'No matching employees found' : 'No employees added yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <StyledTableCell>{row.name || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{formatDateForTable(row.hiredDate)}</StyledTableCell>
                    <StyledTableCell>{row.employmentStatus || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{row.email || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{row.referredBy || 'N/A'}</StyledTableCell>
                    <StyledTableCell>
                      <Box 
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                          backgroundColor: row.status === 'Active' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                          color: row.status === 'Active' ? 'rgb(17, 141, 65)' : 'rgb(183, 29, 24)',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize'
                        }}
                      >
                        {row.status || 'Inactive'}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(row);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#880808',
                            fontSize: '16px',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0 4px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                          }}
                          title="View Employee"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(row)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#880808',
                            fontSize: '16px',
                            padding: '4px 4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            margin: 0,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                          }}
                          title="Edit Employee"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(row, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#880808',
                            fontSize: '16px',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0 4px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                          }}
                          title="Delete Employee"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
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
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            marginBottom: 0
          }
        }}
      />
    </Paper>
      </MainContent>

      {/* Delete Confirmation Dialog */}
      <Modal
        open={deleteConfirmOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-confirmation-dialog"
        closeAfterTransition
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          outline: 'none',
          maxWidth: '90%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <Trash size={24} color="#dc3545" />
            </Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Delete Employee
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{employeeToDelete?.name || 'this employee'}</strong>? This action cannot be undone and all associated data will be permanently removed.
          </Typography>
          
          <Box sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            p: 2,
            borderRadius: '6px',
            mb: 3
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              <strong>Name:</strong> {employeeToDelete?.name || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Email:</strong> {employeeToDelete?.email || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button 
              variant="outlined" 
              onClick={handleDeleteClose}
              disabled={deleteLoading}
              sx={{
                textTransform: 'none',
                borderRadius: '6px',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'text.secondary',
                },
                minWidth: 100
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                textTransform: 'none',
                borderRadius: '6px',
                minWidth: 100,
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)'
                }
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}
