import { useState, useEffect } from 'react';
import { Typography, Layout } from 'antd';
import { useSnackbar } from 'notistack';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../js/firebase';
import { Search, Plus, Eye, Pencil, Trash, X } from 'lucide-react';
import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { 
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  MainContent, 
  DashboardHeader, 
  SearchContainer, 
  SearchInput, 
  SearchIcon,
  StyledTableCell,
  StyledTableRow,
  TableToolbar,
  AddButton
} from '../styles/ApplicantsStyle';
import { StyledSider } from '../styles/SiderStyle';

const columns = [
  { id: 'fullName', label: 'Applicant Name', minWidth: 200 },
  { id: 'degree', label: 'Degree/Course', minWidth: 200 },
  { id: 'applicationSource', label: 'Source', minWidth: 150 },
  { id: 'initialInterviewDate', label: 'Initial Interview', minWidth: 150 },
  { id: 'finalInterviewDate', label: 'Final Interview', minWidth: 150 },
  { id: 'applicationStatus', label: 'Status', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' },
];

// Sample data - replace with actual data from your API
const createData = (id, name, position, appliedDate, status, email, phone) => {
  return { id, name, position, appliedDate, status, email, phone };
};

// Modal styles
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

export default function Applicants() {
  const [collapsed, setCollapsed] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    email: '',
    degree: '',
    school: '',
    applicationSource: '',
    applicationStatus: '',
    initialInterviewDate: '',
    finalInterviewDate: ''
  });

  const handleOpen = () => {
    // Reset form data when opening the Add modal
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      email: '',
      degree: '',
      school: '',
      applicationSource: '',
      applicationStatus: '',
      initialInterviewDate: '',
      finalInterviewDate: ''
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleViewOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setViewOpen(true);
  };
  const handleViewClose = () => setViewOpen(false);
  const handleEditOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setFormData({
      id: applicant.id,
      firstName: applicant.firstName || '',
      lastName: applicant.lastName || '',
      address: applicant.address || '',
      contactNumber: applicant.contactNumber || '',
      email: applicant.email || '',
      degree: applicant.degree || '',
      school: applicant.school || '',
      applicationSource: applicant.applicationSource || '',
      applicationStatus: applicant.applicationStatus || '',
      initialInterviewDate: applicant.initialInterviewDate || '',
      finalInterviewDate: applicant.finalInterviewDate || ''
    });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    // Reset form data when closing the Edit modal
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      email: '',
      degree: '',
      school: '',
      applicationSource: '',
      applicationStatus: '',
      initialInterviewDate: '',
      finalInterviewDate: ''
    });
    setEditOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch applicants data from Firestore
  useEffect(() => {
    const q = query(collection(db, 'applicants'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applicants = [];
      querySnapshot.forEach((doc) => {
        applicants.push({ id: doc.id, ...doc.data() });
      });
      setRows(applicants);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const applicantData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        updatedAt: serverTimestamp()
      };

      if (formData.id) {
        const docRef = doc(db, 'applicants', formData.id);
        await updateDoc(docRef, applicantData);
        enqueueSnackbar('Applicant updated successfully!', { 
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        handleEditClose();
      } else {
        // Add new document
        const docRef = await addDoc(collection(db, 'applicants'), {
          ...applicantData,
          createdAt: serverTimestamp()
        });
        enqueueSnackbar('Applicant added successfully!', { 
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        console.log('Document written with ID: ', docRef.id);
        handleClose();
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        contactNumber: '',
        email: '',
        degree: '',
        school: '',
        applicationSource: '',
        applicationStatus: '',
        initialInterviewDate: '',
        finalInterviewDate: ''
      });
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      enqueueSnackbar('Failed to save applicant. Please try again.', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
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
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (id, e) => {
    e?.stopPropagation();
    setApplicantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicantToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'applicants', applicantToDelete));
      enqueueSnackbar('Applicant deleted successfully', { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting applicant:', error);
      enqueueSnackbar('Error deleting applicant', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } finally {
      setIsDeleting(false);
      setApplicantToDelete(null);
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setApplicantToDelete(null);
  };

  const filteredRows = rows.filter((row) => {
    if (!row) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.fullName?.toLowerCase().includes(searchLower)) ||
      (row.position?.toLowerCase().includes(searchLower)) ||
      (row.email?.toLowerCase().includes(searchLower)) ||
      (row.applicationStatus?.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Typography.Title level={4} style={{ margin: 0, color: '#333' }}>Applicants</Typography.Title>
        </DashboardHeader>
        <Card sx={{ boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ pt: '12px', px: '24px', pb: '-30px', borderBottom: '1px solid rgba(145, 158, 171, 0.24)' }}>
            <TableToolbar>
              <SearchContainer>
                <SearchInput 
                  placeholder="Search applicants..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  name="search"
                  type="search"
                />
                <SearchIcon>
                  <Search size={18} />
                </SearchIcon>
              </SearchContainer>
              <AddButton onClick={handleOpen}>
                <Plus size={18} style={{ marginRight: 8 }} />
                Add Applicant
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
                      {formData.id ? 'Edit Applicant' : 'Add New Applicant'}
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
                  <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
                    {/* Personal Details Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Personal Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="address"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="contactNumber"
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Educational Background Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Educational Background
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="degree"
                        label="Degree/Course"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="school"
                        label="School/University"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Application Details Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Application Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <FormControl fullWidth size="small" required>
                        <InputLabel id="application-source-label">Application Source</InputLabel>
                        <Select
                          labelId="application-source-label"
                          id="applicationSource"
                          name="applicationSource"
                          value={formData.applicationSource}
                          label="Application Source"
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: '8px',
                            },
                          }}
                        >
                          <MenuItem value="Online Post">Online Post</MenuItem>
                          <MenuItem value="Referral">Referral</MenuItem>
                          <MenuItem value="Walk In">Walk In</MenuItem>
                          <MenuItem value="Job Fairs">Job Fairs</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small" required>
                        <InputLabel id="application-status-label">Status</InputLabel>
                        <Select
                          labelId="application-status-label"
                          id="applicationStatus"
                          name="applicationStatus"
                          value={formData.applicationStatus}
                          label="Status"
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: '8px',
                            },
                          }}
                        >
                          <MenuItem value="Passed">Passed</MenuItem>
                          <MenuItem value="In-Progress">In-Progress</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                          <MenuItem value="Callback">Callback</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        id="initialInterviewDate"
                        label="Initial Interview Date"
                        name="initialInterviewDate"
                        type="date"
                        value={formData.initialInterviewDate}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        id="finalInterviewDate"
                        label="Final Interview Date"
                        name="finalInterviewDate"
                        type="date"
                        value={formData.finalInterviewDate}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Form Footer */}
                    <Box sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2
                    }}>
                      <Button 
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                          textTransform: 'none',
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.5)',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          px: 2,
                          py: 1,
                          borderRadius: '6px',
                          background: 'linear-gradient(to bottom, #000000, #880808)',
                          color: 'white',
                          fontWeight: 500,
                          height: '45px',
                          minWidth: '120px',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                            background: 'linear-gradient(to bottom, #000000, #880808)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                          },
                          '&:active': {
                            transform: 'translateY(1px)',
                            boxShadow: 'none'
                          }
                        }}
                        startIcon={formData.id ? <Pencil size={16} /> : <Plus size={16} />}
                      >
                        {formData.id ? 'Update' : 'Add'} Applicant
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>

              {/* View Applicant Modal */}
              <Modal
                open={viewOpen}
                onClose={handleViewClose}
                aria-labelledby="view-applicant-modal"
                aria-describedby="view-applicant-modal-description"
              >
                <Box sx={modalStyle}>
                  <Box sx={headerStyle}>
                    <Typography variant="h6" component="h2" sx={{ m: 0, fontSize: '1.25rem' }}>
                      Applicant Details
                    </Typography>
                    <Button 
                      onClick={handleViewClose} 
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

                  <Box sx={formStyle}>
                    {/* Personal Details Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Personal Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={selectedApplicant?.firstName || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={selectedApplicant?.lastName || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={selectedApplicant?.email || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.87)' }
                          },
                          mb: 2
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Contact Number"
                        value={selectedApplicant?.contactNumber || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={selectedApplicant?.address || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& textarea': { 
                              color: 'rgba(0, 0, 0, 0.6)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Educational Background */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Educational Background
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Degree/Course"
                        value={selectedApplicant?.degree || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="School/University"
                        value={selectedApplicant?.school || ''}
                        disabled
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Application Details */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Application Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <FormControl fullWidth size="small" disabled>
                        <InputLabel sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Application Source</InputLabel>
                        <Select
                          value={selectedApplicant?.applicationSource || ''}
                          label="Application Source"
                          sx={{
                            '& .MuiSelect-select': {
                              color: 'rgba(0, 0, 0, 0.6)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          }}
                        >
                          <MenuItem value={selectedApplicant?.applicationSource || ''}>
                            {selectedApplicant?.applicationSource || 'N/A'}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small" disabled>
                        <InputLabel sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Status</InputLabel>
                        <Select
                          value={selectedApplicant?.applicationStatus || ''}
                          label="Status"
                          sx={{
                            '& .MuiSelect-select': {
                              color: 'rgba(0, 0, 0, 0.6)',
                              WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          }}
                        >
                          <MenuItem value={selectedApplicant?.applicationStatus || ''}>
                            {selectedApplicant?.applicationStatus || 'N/A'}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Initial Interview Date"
                        value={selectedApplicant?.initialInterviewDate ? formatDate(selectedApplicant.initialInterviewDate) : ''}
                        disabled
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Final Interview Date"
                        value={selectedApplicant?.finalInterviewDate ? formatDate(selectedApplicant.finalInterviewDate) : ''}
                        disabled
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-disabled': {
                            '& > fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '& input': { color: 'rgba(0, 0, 0, 0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Modal>

              {/* Edit Applicant Modal */}
              <Modal
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-applicant-modal"
                aria-describedby="edit-applicant-modal-description"
              >
                <Box sx={modalStyle}>
                  <Box sx={headerStyle}>
                    <Typography variant="h6" component="h2" sx={{ m: 0, fontSize: '1.25rem' }}>
                      Edit Applicant
                    </Typography>
                    <Button 
                      onClick={handleEditClose} 
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

                  <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
                    {/* Personal Details Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Personal Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="edit-firstName"
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="edit-lastName"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="edit-email"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                          mb: 2
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="edit-contactNumber"
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="edit-address"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Educational Background */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Educational Background
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        required
                        id="edit-degree"
                        label="Degree/Course"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        id="edit-school"
                        label="School/University"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Application Details */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Application Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <FormControl fullWidth size="small" required>
                        <InputLabel id="edit-application-source-label">Application Source</InputLabel>
                        <Select
                          labelId="edit-application-source-label"
                          id="edit-applicationSource"
                          name="applicationSource"
                          value={formData.applicationSource}
                          label="Application Source"
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: '8px',
                            },
                          }}
                        >
                          <MenuItem value="Online Post">Online Post</MenuItem>
                          <MenuItem value="Referral">Referral</MenuItem>
                          <MenuItem value="Walk In">Walk In</MenuItem>
                          <MenuItem value="Job Fairs">Job Fairs</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small" required>
                        <InputLabel id="edit-application-status-label">Status</InputLabel>
                        <Select
                          labelId="edit-application-status-label"
                          id="edit-applicationStatus"
                          name="applicationStatus"
                          value={formData.applicationStatus}
                          label="Status"
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: '8px',
                            },
                          }}
                        >
                          <MenuItem value="Passed">Passed</MenuItem>
                          <MenuItem value="In-Progress">In-Progress</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                          <MenuItem value="Callback">Callback</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        id="edit-initialInterviewDate"
                        label="Initial Interview Date"
                        name="initialInterviewDate"
                        type="date"
                        value={formData.initialInterviewDate}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        id="edit-finalInterviewDate"
                        label="Final Interview Date"
                        name="finalInterviewDate"
                        type="date"
                        value={formData.finalInterviewDate}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Form Footer */}
                    <Box sx={{
                      mt: 3,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                      pt: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                    }}>
                      <Button 
                        onClick={handleEditClose}
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.87)',
                            backgroundColor: 'transparent'
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          textTransform: 'none',
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          background: 'linear-gradient(to bottom, #000000, #880808)',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                            background: 'linear-gradient(to bottom, #000000, #880808)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                          },
                          '&:active': {
                            transform: 'translateY(1px)',
                            boxShadow: 'none'
                          },
                          '&.Mui-disabled': {
                            background: '#e0e0e0',
                            color: '#9e9e9e'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Applicant'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </TableToolbar>
          </Box>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)' }}>
            <Table stickyHeader aria-label="applicants table">
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
                      <CircularProgress size={24} />
                      <div>Loading applicants...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                      {searchTerm ? 'No matching applicants found' : 'No applicants found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <StyledTableCell>{row.fullName || 'N/A'}</StyledTableCell>
                        <StyledTableCell>{row.degree || 'N/A'}</StyledTableCell>
                        <StyledTableCell>{row.applicationSource || 'N/A'}</StyledTableCell>
                        <StyledTableCell>{row.initialInterviewDate ? formatDate(row.initialInterviewDate) : 'N/A'}</StyledTableCell>
                        <StyledTableCell>{row.finalInterviewDate ? formatDate(row.finalInterviewDate) : 'N/A'}</StyledTableCell>
                        <StyledTableCell>
                          <Box 
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: '12px',
                              backgroundColor: 
                                row.applicationStatus === 'Passed' ? 'rgba(34, 197, 94, 0.16)' : 
                                row.applicationStatus === 'Rejected' ? 'rgba(255, 86, 48, 0.16)' :
                                row.applicationStatus === 'In-Progress' ? 'rgba(255, 171, 0, 0.16)' : 'rgba(145, 158, 171, 0.16)',
                              color: 
                                row.applicationStatus === 'Passed' ? '#118d57' :
                                row.applicationStatus === 'Rejected' ? '#b71d18' :
                                row.applicationStatus === 'In-Progress' ? '#b76e00' : '#637381',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                            }}
                          >
                            {row.applicationStatus || 'N/A'}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button 
                              size="small" 
                              color="primary"
                              sx={{ minWidth: '32px', height: '32px', p: 0, borderRadius: 0, '&:first-of-type': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' } }}
                            >
                              <Eye size={16} onClick={() => handleViewOpen(row)} style={{ cursor: 'pointer' }} />
                            </Button>
                            <Button 
                              size="small" 
                              color="primary"
                              sx={{ minWidth: '32px', height: '32px', p: 0, borderRadius: 0 }}
                            >
                              <Pencil size={16} onClick={() => handleEditOpen(row)} style={{ cursor: 'pointer' }} />
                            </Button>
                            <Button 
                              size="small" 
                              color="error"
                              onClick={(e) => handleDeleteClick(row.id, e)}
                              sx={{ 
                                minWidth: '32px', 
                                height: '32px', 
                                p: 0, 
                                borderRadius: 0, 
                                '&:last-of-type': { 
                                  borderTopRightRadius: '4px', 
                                  borderBottomRightRadius: '4px' 
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 86, 48, 0.08)'
                                }
                              }}
                            >
                              <Trash size={16} style={{ cursor: 'pointer' }} />
                            </Button>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid rgba(145, 158, 171, 0.24)' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  marginBottom: 0,
                },
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
              }}
            />
          </Box>
        </Card>
      </MainContent>
      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteDialogOpen}
        onClose={!isDeleting ? handleDeleteClose : null}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
      >
        <Box sx={{
          ...modalStyle,
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '8px',
          p: 3,
          outline: 'none',
          maxWidth: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
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
              Delete Applicant
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Are you sure you want to delete this applicant? This action cannot be undone and all associated data will be permanently removed.
          </Typography>
          
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
              disabled={isDeleting}
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
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                textTransform: 'none',
                borderRadius: '6px',
                minWidth: 100,
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)'
                },
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c82333, #bd2130)',
                  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}
