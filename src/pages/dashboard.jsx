import React, { useState, useEffect } from 'react';
import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { MainContent, DashboardHeader, StyledWrapper, StyledCard, DepartmentCard, CardContent, CardIcon, CardTitle, DepartmentCardTitle, DepartmentCardValue } from '../styles/DashboardStyle';
import { Typography, Card, Row, Col, Spin, Modal, List, Avatar, Layout } from 'antd';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../js/firebase';
import { StyledSider } from '../styles/SiderStyle';
import { 
  Users, 
  Building2,
  GraduationCap as UserGraduated,
  DraftingCompass,
  Cpu as Microchip,
  Truck,
  Megaphone as Bullhorn,
  Scissors,
  Network,
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
  Settings as SettingsIcon
} from 'lucide-react';
import { useDepartments } from '../contexts/DepartmentContext';
import { useDashboard } from '../contexts/DashboardContext';

const { Title } = Typography;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);
  const { departments, loading } = useDepartments();
  const { 
    totalEmployees = 0, 
    hhiCount = 0, 
    rahyoCount = 0, 
    departmentCounts = {},
    loading: loadingEmployees,
    refreshDashboardData 
  } = useDashboard();

  // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loadingEmployeesList, setLoadingEmployeesList] = useState(false);

  // Fetch employees in a department
  const fetchEmployeesByDepartment = async (departmentName) => {
    try {
      setLoadingEmployeesList(true);
      const employeesRef = collection(db, 'employees');
      const q = query(
        employeesRef, 
        where('department', 'array-contains', departmentName),
        where('status', '==', 'Active')
      );
      const querySnapshot = await getDocs(q);
      
      const employeesList = [];
      querySnapshot.forEach((doc) => {
        employeesList.push({ id: doc.id, ...doc.data() });
      });
      
      setEmployees(employeesList);
      setModalTitle(`Active Employees in ${departmentName}`);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployeesList(false);
    }
  };

  // Handle department card click
  const handleDepartmentClick = (department) => {
    fetchEmployeesByDepartment(department.name);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEmployees([]);
  };

  // Colors for department cards
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

  const colors = [
    '#4e79a7', // blue
    '#f28e2b', // orange
    '#e15759', // red
    '#76b7b2', // teal
    '#59a14f', // green
    '#edc948', // yellow
    '#b07aa1', // purple
    '#ff9da7', // pink
    '#9c755f', // brown
    '#7b7b7b', // gray
    '#4e79a7', // blue (repeated if needed)
    '#f28e2b'  // orange (repeated if needed)
  ];

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
          <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
        </DashboardHeader>
        <StyledWrapper>
  <div className="main-dashboard-layout">
    <div className="cards-row">
      {/* Left side - Total Employees */}
      <div className="card">
          <div className="user-icon-container">
            <Users size={80} strokeWidth={1.5} color="#fff" />
            <div className="employees-text">Total Employees</div>
            {loadingEmployees ? (
              <Spin size="large" style={{ margin: '10px 0' }} />
            ) : (
              <div className="employee-count">{totalEmployees.toLocaleString()}</div>
            )}
          </div>
      </div>
      
      {/* Middle - RAHYO and HHI */}
      <div className="right-cards">
        <div className="card wider-card">
          <div className="user-icon-container">
            <Building2 strokeWidth={1.5} color="#fff"/>
            <div className="employees-text" style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>RAHYO</div>
            {loadingEmployees ? (
              <Spin size="large" style={{ margin: '10px 0' }} />
            ) : (
              <div className="employee-count" style={{ fontSize: '16px', fontWeight: '600' }}>
                {rahyoCount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="card wider-card">
          <div className="user-icon-container">
            <Building2 strokeWidth={1.5} color="#fff" />
            <div className="employees-text" style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>HHI</div>
            {loadingEmployees ? (
              <Spin size="large" style={{ margin: '10px 0' }} />
            ) : (
              <div className="employee-count" style={{ fontSize: '16px', fontWeight: '600' }}>
                {hhiCount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Departments Section */}
    <StyledCard 
      title="Departments"
      styles={{
        header: {
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
          fontWeight: '500',
          fontSize: '16px'
        },
        body: { 
          padding: '24px' 
        }
      }}
    >
      <Row gutter={[16, 16]}>
        {loading ? (
          <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
            Loading departments...
          </Col>
        ) : departments.length > 0 ? (
          departments.map((dept, index) => {
            const iconColor = colors[index % colors.length];
            
            return (
              <Col key={dept.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <DepartmentCard 
                  hoverable
                  $iconColor={iconColor}
                  onClick={() => handleDepartmentClick(dept)}
                  style={{ cursor: 'pointer' }}
                  styles={{
                    body: {
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }
                  }}
                >
                  <CardContent>
                    <CardIcon $iconColor={iconColor}>
                      {React.createElement(iconComponents[dept.icon || 'Building2'], {
                        size: 20,
                        strokeWidth: 1.5,
                        color: iconColor
                      })}
                    </CardIcon>
                    <div>
                      <CardTitle>Department</CardTitle>
                      <DepartmentCardTitle>{dept.name}</DepartmentCardTitle>
                    </div>
                  </CardContent>
                  <DepartmentCardValue>
                    <div className="label">Employees</div>
                    <div className="value">
                      {loadingEmployees ? (
                        <Spin size="small" />
                      ) : (
                        (departmentCounts[dept.name] || 0).toLocaleString()
                      )}
                    </div>
                  </DepartmentCardValue>
                </DepartmentCard>
              </Col>
            );
          })
        ) : (
          <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
            No departments found. Add departments in Settings.
          </Col>
        )}
      </Row>
    </StyledCard>

    {/* Employees Modal */}
    <Modal
      title={modalTitle}
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
      width={800}
    >
      {loadingEmployeesList ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p>Loading employees...</p>
        </div>
      ) : employees.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Employee</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Position</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar 
                      style={{ 
                        backgroundColor: '#1890ff',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      size="large"
                    >
                      {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                    </Avatar>
                    <span>{`${employee.firstName} ${employee.lastName}`}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{employee.position || '-'}</td>
                  <td style={{ padding: '12px' }}>{employee.email || '-'}</td>
                  <td style={{ padding: '12px' }}>{employee.contactNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No employees found in this department.
        </div>
      )}
    </Modal>
  </div>
</StyledWrapper>
      </MainContent>
    </Layout>
  );
}