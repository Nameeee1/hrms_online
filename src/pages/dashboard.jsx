import React, { useState, useEffect } from 'react';
import MenuList from '../components/MenuList';
import Logo from '../components/logo';
import "../css/sidebar.css";
import { MainContent, DashboardHeader, StyledWrapper, StyledCard, DepartmentCard, CardContent, CardIcon, CardTitle, DepartmentCardTitle, DepartmentCardValue } from '../styles/DashboardStyle';
import { Typography, Card, Row, Col, Spin } from 'antd';
import { StyledSider } from '../styles/SiderStyle';
import { Layout } from 'antd';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../js/firebase';
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

const { Title } = Typography;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);
  const { departments, loading } = useDepartments();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [hhiCount, setHhiCount] = useState(0);
  const [rahyoCount, setRahyoCount] = useState(0);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployeeCounts = async () => {
      try {
        setLoadingEmployees(true);
        const employeesRef = collection(db, 'employees');
        
        // Get total count
        const totalSnapshot = await getCountFromServer(employeesRef);
        setTotalEmployees(totalSnapshot.data().count);
        
        // Get HHI count
        const hhiQuery = query(employeesRef, where('organization', '==', 'HHI'));
        const hhiSnapshot = await getCountFromServer(hhiQuery);
        setHhiCount(hhiSnapshot.data().count);
        
        // Get RAHYO count
        const rahyoQuery = query(employeesRef, where('organization', '==', 'RAHYO'));
        const rahyoSnapshot = await getCountFromServer(rahyoQuery);
        setRahyoCount(rahyoSnapshot.data().count);
        
      } catch (error) {
        console.error('Error fetching employee counts:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployeeCounts();
  }, []);

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
                  styles={{
                    body: {
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
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
                    <div className="value">0</div>
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
  </div>
</StyledWrapper>
      </MainContent>
    </Layout>
  );
}
