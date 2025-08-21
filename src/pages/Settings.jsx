import React, { useState } from 'react';
import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { 
  MainContent,
  SettingsContainer,
  StyledCard,
  StyledTable,
  DepartmentName,
  LayoutContainer,
  TitleContainer,
  FlexContainer,
  TableContainer,
  StyledEditIcon
} from '../styles/SettingsStyle';
import { DashboardHeader } from '../styles/EmployeesStyle';
import { Typography, Card, Input, Button, List, Space, Table, Tag, Input as AntdInput } from 'antd';
import { useSnackbar } from 'notistack';
import { PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useDepartments } from '../contexts/DepartmentContext';
import { useStatusCategories } from '../contexts/StatusCategoryContext';
import { ChromePicker } from 'react-color';
import { 
  Building2, 
  Edit2, 
  Save, 
  X, 
  Trash2, 
  Users,
  Briefcase,
  Home,
  School,
  HeartPulse,
  Wrench,
  Monitor,
  Utensils,
  ShoppingCart,
  Car,
  Banknote,
  Phone,
  Mail,
  MessageSquare,
  Settings as SettingsIcon,
  GraduationCap as UserGraduated,
  DraftingCompass,
  Cpu as Microchip,
  Truck,
  Megaphone as Bullhorn,
  Scissors,
  Network
} from 'lucide-react';

const { Title } = Typography;
import { StyledSider } from '../styles/SiderStyle';
import { Layout } from 'antd';

export default function Settings() {
  const [collapsed, setCollapsed] = useState(true);
  const [newDept, setNewDept] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingIcon, setEditingIcon] = useState('Building2');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const iconComponents = {
    Building2: Building2,
    Users: Users,
    Briefcase: Briefcase,
    Home: Home,
    School: School,
    HeartPulse: HeartPulse,
    Wrench: Wrench,
    Monitor: Monitor,
    Utensils: Utensils,
    ShoppingCart: ShoppingCart,
    Car: Car,
    Banknote: Banknote,
    Phone: Phone,
    Mail: Mail,
    MessageSquare: MessageSquare,
    SettingsIcon: SettingsIcon,
    UserGraduated: UserGraduated,
    DraftingCompass: DraftingCompass,
    Microchip: Microchip,
    Truck: Truck,
    Bullhorn: Bullhorn,
    Scissors: Scissors,
    Network: Network
  };
  const { departments, loading: deptLoading, error: deptError, addDepartment, removeDepartment, updateDepartment } = useDepartments();
  const { 
    statusCategories, 
    loading: statusLoading, 
    error: statusError, 
    addStatusCategory, 
    removeStatusCategory, 
    updateStatusCategory 
  } = useStatusCategories();
  const { enqueueSnackbar } = useSnackbar();
  
  // Status Category States
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#1890ff');
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusName, setEditingStatusName] = useState('');
  const [editingStatusColor, setEditingStatusColor] = useState('#1890ff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleAddDepartment = async () => {
    const trimmedName = newDept.trim();
    
    if (!trimmedName) {
      enqueueSnackbar('Please enter a department name', { 
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }

    try {
      setIsAdding(true);
      await addDepartment({
        name: trimmedName,
        icon: 'Building2' // Default icon for new departments
      });
      setNewDept('');
      enqueueSnackbar('Department added successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to add department', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditDepartment = (record) => {
    setEditingId(record.id);
    setEditingName(record.name);
    setEditingIcon(record.icon || 'Building2');
  };

  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) {
      enqueueSnackbar('Department name cannot be empty', { 
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }

    try {
      await updateDepartment(id, { 
        name: editingName.trim(),
        icon: editingIcon
      });
      setEditingId(null);
      setEditingName('');
      setShowIconPicker(false);
      enqueueSnackbar('Department updated successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar('Failed to update department', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setShowIconPicker(false);
  };

  const handleRemoveDepartment = async (dept) => {
    try {
      await removeDepartment(dept.id);
      enqueueSnackbar('Department removed successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar('Failed to remove department', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  // Status Category Handlers
  const handleAddStatusCategory = async () => {
    const trimmedName = newStatusName.trim();
    
    if (!trimmedName) {
      enqueueSnackbar('Please enter a status name', { 
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }

    try {
      setIsAddingStatus(true);
      await addStatusCategory({
        name: trimmedName,
        color: newStatusColor
      });
      setNewStatusName('');
      setNewStatusColor('#1890ff');
      enqueueSnackbar('Status category added successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to add status category', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsAddingStatus(false);
    }
  };

  const handleEditStatusCategory = (category) => {
    setEditingStatusId(category.id);
    setEditingStatusName(category.name);
    setEditingStatusColor(category.color || '#1890ff');
  };

  const handleSaveStatusEdit = async (id) => {
    if (!editingStatusName.trim()) {
      enqueueSnackbar('Status name cannot be empty', { 
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }

    try {
      await updateStatusCategory(id, { 
        name: editingStatusName.trim(),
        color: editingStatusColor
      });
      setEditingStatusId(null);
      setEditingStatusName('');
      setShowColorPicker(false);
      enqueueSnackbar('Status category updated successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar('Failed to update status category', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  const handleCancelStatusEdit = () => {
    setEditingStatusId(null);
    setEditingStatusName('');
    setShowColorPicker(false);
  };

  const handleRemoveStatusCategory = async (category) => {
    try {
      await removeStatusCategory(category.id);
      enqueueSnackbar('Status category removed successfully', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      enqueueSnackbar('Failed to remove status category', { 
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <LayoutContainer>
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
          <TitleContainer level={3}>Settings</TitleContainer>
        </DashboardHeader>
        
        <SettingsContainer>
          <div style={{ flex: '1', minWidth: '400px', marginRight: '-20px' }}>
            <StyledCard 
              title={
                <FlexContainer>
                  <span>Departments</span>
                </FlexContainer>
              }
          >
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <Input
                placeholder="Enter department name..."
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                onPressEnter={handleAddDepartment}
                style={{ width: '300px' }}
              />
              <Button 
                type="primary" 
                onClick={handleAddDepartment}
                icon={<PlusOutlined />}
                loading={isAdding}
                disabled={isAdding || !newDept.trim()}
              >
                Add Department
              </Button>
            </div>
            
            <TableContainer>
              <StyledTable
                columns={[
                {
                  title: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} style={{ marginRight: '4px' }} />
                      <span>Department Name</span>
                    </div>
                  ),
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => 
                    editingId === record.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative' }}>
                          <div 
                            style={{
                              padding: '4px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5',
                              width: '32px',
                              height: '32px'
                            }}
                            onClick={() => setShowIconPicker(!showIconPicker)}
                          >
                            {React.createElement(iconComponents[editingIcon], { 
                              size: 16, 
                              style: { color: '#555' } 
                            })}
                          </div>
                          {showIconPicker && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              backgroundColor: 'white',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              padding: '8px',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(5, 1fr)',
                              gap: '8px',
                              zIndex: 1000,
                              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
                            }}>
                              {Object.keys(iconComponents).map((iconName) => {
                                const Icon = iconComponents[iconName];
                                return (
                                  <div
                                    key={iconName}
                                    onClick={() => {
                                      setEditingIcon(iconName);
                                      setShowIconPicker(false);
                                    }}
                                    style={{
                                      padding: '8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: editingIcon === iconName ? '#e6f7ff' : 'transparent',
                                      ':hover': {
                                        backgroundColor: '#f5f5f5'
                                      }
                                    }}
                                  >
                                    <Icon size={16} color={editingIcon === iconName ? '#1890ff' : '#555'} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          style={{ width: '200px' }}
                          onPressEnter={() => handleSaveEdit(record.id)}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {React.createElement(iconComponents[record.icon || 'Building2'], { 
                          size: 16, 
                          style: { color: '#555' } 
                        })}
                        <DepartmentName>{text}</DepartmentName>
                      </div>
                    ),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: () => <Tag color="success">Active</Tag>,
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <div style={{ display: 'flex', gap: '0' }}>
                      {editingId === record.id ? (
                        <>
                          <Button 
                            type="text"
                            icon={
                              <Save 
                                size={16} 
                                color={!editingName.trim() ? '#ccc' : hoveredButton === 'save' ? '#1890ff' : '#555'}
                              />
                            }
                            onClick={() => handleSaveEdit(record.id)}
                            disabled={!editingName.trim()}
                            style={{ 
                              padding: '4px 8px',
                              opacity: !editingName.trim() ? 0.5 : 1
                            }}
                            onMouseEnter={() => setHoveredButton('save')}
                            onMouseLeave={() => setHoveredButton(null)}
                          />
                          <Button 
                            type="text"
                            icon={
                              <X 
                                size={16} 
                                color={hoveredButton === 'cancel' ? '#ff4d4f' : '#555'}
                              />
                            }
                            onClick={handleCancelEdit}
                            style={{ padding: '4px 8px' }}
                            onMouseEnter={() => setHoveredButton('cancel')}
                            onMouseLeave={() => setHoveredButton(null)}
                          />
                        </>
                      ) : (
                        <Button 
                          type="text"
                          icon={
                            <Edit2 
                              size={16} 
                              color={editingId !== null ? '#ccc' : hoveredButton === 'edit' ? '#1890ff' : '#555'}
                            />
                          }
                          onClick={() => handleEditDepartment(record)}
                          disabled={editingId !== null}
                          style={{ 
                            padding: '4px 8px',
                            opacity: editingId !== null ? 0.5 : 1
                          }}
                          onMouseEnter={() => setHoveredButton('edit')}
                          onMouseLeave={() => setHoveredButton(null)}
                        />
                      )}
                      <Button 
                        type="text"
                        danger={hoveredButton === 'delete'}
                        icon={
                          <Trash2 
                            size={16} 
                            color={editingId !== null ? '#ccc' : hoveredButton === 'delete' ? '#ff4d4f' : '#555'}
                          />
                        }
                        onClick={() => handleRemoveDepartment(record)}
                        loading={deptLoading}
                        disabled={editingId !== null}
                        style={{ 
                          padding: '4px 8px',
                          opacity: editingId !== null ? 0.5 : 1
                        }}
                        onMouseEnter={() => setHoveredButton('delete')}
                        onMouseLeave={() => setHoveredButton(null)}
                      />
                    </div>
                  ),
                },
              ]}
              dataSource={departments}
              loading={deptLoading}
              rowKey="id"
              locale={{ emptyText: deptError || 'No departments found' }}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} departments`,
                showQuickJumper: true,
                size: 'small',
                simple: true
              }}
            />
            </TableContainer>
          </StyledCard>
          </div>

          <div style={{ flex: '1', minWidth: '400px' }}>
            <StyledCard 
              title={
                <FlexContainer>
                  <span>Employee Status Categories</span>
                </FlexContainer>
              }
          >
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    backgroundColor: newStatusColor,
                    cursor: 'pointer',
                    border: '1px solid #d9d9d9'
                  }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && editingStatusId === null && (
                  <div style={{ position: 'absolute', zIndex: 10, top: '40px', left: 0 }}>
                    <ChromePicker
                      color={newStatusColor}
                      onChangeComplete={(color) => setNewStatusColor(color.hex)}
                    />
                  </div>
                )}
              </div>
              <Input
                placeholder="Enter status name..."
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                onPressEnter={handleAddStatusCategory}
                style={{ width: '200px' }}
              />
              <Button 
                type="primary" 
                onClick={handleAddStatusCategory}
                icon={<PlusOutlined />}
                loading={isAddingStatus}
                disabled={isAddingStatus || !newStatusName.trim()}
              >
                Add Status
              </Button>
            </div>
            
            <TableContainer>
              <StyledTable
                columns={[
                  {
                    title: 'Status Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) =>
                      editingStatusId === record.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ position: 'relative' }}>
                            <div 
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                backgroundColor: editingStatusColor,
                                cursor: 'pointer',
                                border: '1px solid #d9d9d9'
                              }}
                              onClick={() => setShowColorPicker(!showColorPicker)}
                            />
                            {showColorPicker && editingStatusId === record.id && (
                              <div style={{ position: 'absolute', zIndex: 10, top: '30px', left: 0 }}>
                                <ChromePicker
                                  color={editingStatusColor}
                                  onChangeComplete={(color) => setEditingStatusColor(color.hex)}
                                />
                              </div>
                            )}
                          </div>
                          <Input
                            value={editingStatusName}
                            onChange={(e) => setEditingStatusName(e.target.value)}
                            style={{ width: '200px' }}
                            onPressEnter={() => handleSaveStatusEdit(record.id)}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div 
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '3px',
                              backgroundColor: record.color || '#1890ff',
                              flexShrink: 0
                            }}
                          />
                          <span>{text}</span>
                        </div>
                      ),
                  },
                  {
                    title: 'Color',
                    dataIndex: 'color',
                    key: 'color',
                    render: (_, record) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            backgroundColor: record.color || '#1890ff'
                          }}
                        />
                        <span>{record.color || '#1890ff'}</span>
                      </div>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    align: 'right',
                    render: (_, record) => (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {editingStatusId === record.id ? (
                          <>
                            <Button 
                              type="text"
                              icon={
                                <CheckOutlined style={{ 
                                  color: !editingStatusName.trim() ? '#ccc' : hoveredButton === 'save-status' ? '#52c41a' : '#555'
                                }} />
                              }
                              onClick={() => handleSaveStatusEdit(record.id)}
                              disabled={!editingStatusName.trim()}
                              style={{ 
                                padding: '4px 8px',
                                opacity: !editingStatusName.trim() ? 0.5 : 1
                              }}
                              onMouseEnter={() => setHoveredButton('save-status')}
                              onMouseLeave={() => setHoveredButton(null)}
                            />
                            <Button 
                              type="text"
                              icon={
                                <CloseOutlined style={{ 
                                  color: hoveredButton === 'cancel-status' ? '#ff4d4f' : '#555'
                                }} />
                              }
                              onClick={handleCancelStatusEdit}
                              style={{ padding: '4px 8px' }}
                              onMouseEnter={() => setHoveredButton('cancel-status')}
                              onMouseLeave={() => setHoveredButton(null)}
                            />
                          </>
                        ) : (
                          <Button 
                            type="text"
                            icon={
                              <Edit2 
                                size={16} 
                                color={editingStatusId !== null ? '#ccc' : hoveredButton === 'edit-status' ? '#1890ff' : '#555'}
                              />
                            }
                            onClick={() => handleEditStatusCategory(record)}
                            disabled={editingStatusId !== null}
                            style={{ 
                              padding: '4px 8px',
                              opacity: editingStatusId !== null ? 0.5 : 1
                            }}
                            onMouseEnter={() => setHoveredButton('edit-status')}
                            onMouseLeave={() => setHoveredButton(null)}
                          />
                        )}
                        <Button 
                          type="text"
                          danger={hoveredButton === 'delete-status'}
                          icon={
                            <DeleteOutlined style={{ 
                              color: editingStatusId !== null ? '#ccc' : hoveredButton === 'delete-status' ? '#ff4d4f' : '#555'
                            }} />
                          }
                          onClick={() => handleRemoveStatusCategory(record)}
                          disabled={editingStatusId !== null}
                          style={{ 
                            padding: '4px 8px',
                            opacity: editingStatusId !== null ? 0.5 : 1
                          }}
                          onMouseEnter={() => setHoveredButton('delete-status')}
                          onMouseLeave={() => setHoveredButton(null)}
                        />
                      </div>
                    ),
                  },
                ]}
                dataSource={statusCategories}
                rowKey="id"
                pagination={false}
                loading={statusLoading}
                locale={{
                  emptyText: 'No status categories found. Add one to get started.'
                }}
              />
            </TableContainer>
          </StyledCard>
          </div>
        </SettingsContainer>
      </MainContent>
    </LayoutContainer>
  );
}
