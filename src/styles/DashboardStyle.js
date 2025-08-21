import styled from 'styled-components';
import { Layout, Card } from 'antd';

const { Content } = Layout;

export const ContentArea = styled(Content)`
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    height: calc(100% - 72px);
    border: 1px solid #f0f0f0;
    overflow: auto;
`;

export const MainContent = styled(Layout)`
    margin: 0;
    padding: 0 20px;
    transition: margin 0.2s;
    height: 100vh;
    display: flex;
    flex-direction: column;

    &.collapsed {
        margin-left: 80px;
    }

    &.expanded {
        margin-left: 180px;
    }
`;

export const DashboardHeader = styled.div`
    background-color: #fff;
    padding: 16px 24px;
    margin: 10px 0 16px 0;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    border: 1px solid #f0f0f0;
    position: sticky;
    top: 0;
    z-index: 10;
`;

export const StyledCard = styled(Card)`
  margin-top: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f2f5;
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const DepartmentCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.$iconColor}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const CardTitle = styled.div`
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.4;
`;

export const DepartmentCardTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #262626;
`;

export const DepartmentCardValue = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px dashed #f0f0f0;
  
  .label {
    font-size: 12px;
    color: #8c8c8c;
    line-height: 1.4;
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }
`;

export const StyledWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  
  .main-dashboard-layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .cards-row {
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 10px;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 3px;
    }
  }
  
  .card {
    width: 160px;
    height: 220px;
    border-radius: 40px;
    background: #1e1e1e;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 20px;
      
      &::before {
        opacity: 1;
      }
      
      .user-icon-container svg {
        transform: scale(1.05);
      }
    }
  }
  
  .right-cards {
    display: flex;
    flex-direction: row;
    gap: 20px;
    flex-shrink: 0;
  }
  
  .wider-card {
    width: 200px;
    height: 110px;
    border-radius: 20px;
    background: #1e1e1e;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 15px;
      
      &::before {
        opacity: 1;
      }
      
      .user-icon-container svg {
        transform: scale(1.05);
      }
    }
  }
  
  .departments-section {
    width: 100%;
    margin-top: 20px;
    
    .section-title {
      color: #333;
      font-size: 1.5rem;
      margin-bottom: 20px;
      font-weight: 600;
    }
  }
  
  .departments-sidebar {
    flex: 1;
    max-width: 900px;
    background: white;
    border-radius: 20px;
    padding: 12px 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px;
  }
  
  .departments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
    width: 100%;
  }
  
  .department-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid #e9ecef;
    min-height: 60px;
    gap: 10px;
    
    &:hover {
      background: #f1f3f5;
      transform: translateY(-1px);
    }
  }
  
  .department-icon {
    background: #e9ecef;
    min-width: 28px;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  .department-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .department-name {
    font-size: 10px;
    font-weight: 500;
    color: #495057;
    text-align: center;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    line-height: 1.2;
  }
  
  .department-count {
    font-size: 12px;
    font-weight: 600;
    color: #1e1e1e;
    text-align: center;
  }
  .cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
  
}
  .right-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

  .card {
  width: 160px;
  height: 220px;
  border-radius: 40px;
  background: #1e1e1e;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

  .wider-card {
    width: 200px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    
    .user-icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
      
      svg {
        height: 40px;
        width: 40px;
        margin: 0;
      }
      
      .employees-text {
        margin: 0;
        line-height: 1;
      }
      
      .employee-count {
        margin: 0;
        color: #ffffffcc;
      }
    }
  }

  .user-icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
    padding: 20px 0 30px;
    transition: transform 0.3s ease;
    
    svg {
      transition: transform 0.3s ease;
    }
  }

  .employees-text {
    color: #fff;
    font-size: 18px;
    margin-top: 15px;
    text-align: center;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .employee-count {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    margin-top: 5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Update responsive styles */
@media (max-width: 1024px) {
  .wider-card {
    width: 250px;
  }
}

@media (max-width: 768px) {
    .cards-container {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .right-cards {
      width: 100%;
      align-items: center;
    }
    
    .card, .wider-card {
      width: 100%;
      max-width: 300px;
      height: 180px;
    }
    
    .wider-card {
      height: 100px;
    }
  }

  @media (max-width: 480px) {
    .card, .wider-card {
      max-width: 100%;
      border-radius: 30px;
    }
    
    .employees-text {
      font-size: 16px;
    }
    
    .employee-count {
      font-size: 24px;
    }
  }

  .user-icon-container {
    display: flex;
  flex-direction: column;
  align-items: center;
`;



const EmployeesText = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
`;

