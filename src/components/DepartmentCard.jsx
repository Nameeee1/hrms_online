import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Card, Avatar, Typography, Button, Tag, Tooltip, theme } from 'antd';
import { 
  TeamOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  MoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  border: none;
  position: relative;
  background: ${({ theme }) => theme.cardBg || '#fff'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f43f5e);
    background-size: 300% 300%;
    animation: ${gradientAnimation} 8s ease infinite;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
    min-height: 60px;
    
    .ant-card-head-title {
      padding: 0;
      display: flex;
      align-items: center;
    }
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const DepartmentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const DepartmentAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  
  ${StyledCard}:hover & {
    transform: rotate(10deg) scale(1.05);
  }
`;

const DepartmentTitle = styled(Title)`
  margin: 0 0 4px 0 !important;
  font-size: 20px !important;
  color: #1f2937;
  font-weight: 700 !important;
  background: linear-gradient(90deg, #1f2937, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    transition: width 0.3s ease;
  }
  
  ${StyledCard}:hover &::after {
    width: 100%;
  }
`;

const DepartmentMeta = styled.div`
  margin-bottom: 20px;
  display: grid;
  gap: 12px;
  
  .meta-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: rgba(243, 244, 246, 0.6);
    border-radius: 10px;
    transition: all 0.3s ease;
    border: 1px solid rgba(229, 231, 235, 0.8);
    
    &:hover {
      background: rgba(229, 231, 235, 0.8);
      transform: translateX(4px);
    }
    
    .meta-icon {
      margin-right: 10px;
      color: #6366f1;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    
    .meta-content {
      flex: 1;
    }
    
    .meta-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 2px;
      display: block;
    }
    
    .meta-value {
      color: #1f2937;
      font-weight: 500;
      font-size: 14px;
      display: block;
    }
    
    .ant-tag {
      border-radius: 6px;
      padding: 2px 10px;
      font-weight: 500;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: none;
      
      &.ant-tag-success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      
      &.ant-tag-default {
        background: rgba(107, 114, 128, 0.1);
        color: #6b7280;
      }
    }
  }
`;

const EmployeeCount = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px dashed rgba(139, 92, 246, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 0;
  }
  
  .count {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    z-index: 1;
    line-height: 1.2;
  }
  
  .label {
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
    position: relative;
    z-index: 1;
    letter-spacing: 0.3px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 0 0 4px 4px;
  }
  
  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 8px;
    font-weight: 500;
    padding: 0 16px;
    height: 36px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    &:hover::before {
      opacity: 1;
    }
    
    &.view-btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      
      &::before {
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    &.edit-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #4b5563;
      border: 1px solid rgba(209, 213, 219, 0.7);
      backdrop-filter: blur(4px);
      
      &:hover {
        background: white;
        color: #1f2937;
        border-color: #d1d5db;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const DepartmentCard = ({ department, onView, onEdit, onDelete, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <StyledCard
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      theme={theme}
    >
      <DepartmentHeader>
        <DepartmentAvatar 
          icon={<TeamOutlined style={{ fontSize: '24px' }} />} 
          style={{
            transform: isHovered ? 'rotate(5deg) scale(1.05)' : 'none',
            transition: 'transform 0.3s ease'
          }}
        />
        <div>
          <DepartmentTitle level={4}>
            {department.name}
          </DepartmentTitle>
          <Text 
            type="secondary" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              color: '#6b7280'
            }}
          >
            <UserOutlined style={{ fontSize: '12px' }} />
            {department.manager || 'No manager assigned'}
          </Text>
        </div>
        <Button 
          type="text" 
          icon={<MoreOutlined />} 
          style={{ 
            marginLeft: 'auto',
            color: '#9ca3af',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease, color 0.2s ease',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Add dropdown menu here if needed
          }}
        />
      </DepartmentHeader>
      
      <DepartmentMeta>
        <div className="meta-item">
          <span className="meta-icon"><IdcardOutlined /></span>
          <div className="meta-content">
            <span className="meta-label">Department ID</span>
            <span className="meta-value">{department.id}</span>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-icon"><EnvironmentOutlined /></span>
          <div className="meta-content">
            <span className="meta-label">Location</span>
            <span className="meta-value">{department.location || 'Not specified'}</span>
          </div>
        </div>
        <div className="meta-item" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="meta-icon">
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: department.isActive ? '#10b981' : '#9ca3af',
                marginRight: '8px',
                boxShadow: department.isActive ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none'
              }} />
            </span>
            <div className="meta-content">
              <span className="meta-label">Status</span>
              <span className="meta-value">
                {department.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <Tag 
            color={department.isActive ? 'success' : 'default'}
            style={{
              margin: 0,
              opacity: isHovered ? 1 : 0.8,
              transition: 'opacity 0.3s ease'
            }}
          >
            {department.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </div>
      </DepartmentMeta>
      
      <EmployeeCount>
        <div>
          <div className="count">{department.employeeCount || 0}</div>
          <div className="label">Team Members</div>
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative', zIndex: 1 }}>
          {department.employeeCount > 0 ? (
            <Avatar.Group 
              maxCount={4} 
              size="small" 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
                gap: '4px'
              }}
            >
              {Array.from({ length: Math.min(department.employeeCount, 5) }).map((_, i) => (
                <Avatar 
                  key={i} 
                  icon={<UserOutlined />} 
                  style={{
                    background: `hsl(${i * 137.508}, 70%, 60%)`,
                    transition: 'transform 0.3s ease',
                    ':hover': {
                      transform: 'translateY(-3px)'
                    }
                  }}
                />
              ))}
            </Avatar.Group>
          ) : (
            <Text type="secondary" style={{ fontSize: '13px' }}>No team members</Text>
          )}
        </div>
      </EmployeeCount>
      
      <ActionButtons>
        <Tooltip title={`View ${department.name} details`}>
          <Button 
            type="primary" 
            className="view-btn"
            onClick={() => onView(department.id)}
            style={{
              transform: isHovered ? 'translateY(-2px)' : 'none',
              opacity: isHovered ? 0.95 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            View Team
          </Button>
        </Tooltip>
        <Tooltip title={`Edit ${department.name}`}>
          <Button 
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(department);
            }}
            style={{
              transform: isHovered ? 'translateY(-2px)' : 'none',
              opacity: isHovered ? 0.9 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <EditOutlined style={{ fontSize: '14px' }} /> Edit
          </Button>
        </Tooltip>
      </ActionButtons>
    </StyledCard>
  );
};

// Add theme context for potential theming support
const ThemedDepartmentCard = (props) => {
  const { token } = theme.useToken();
  
  const themeConfig = {
    cardBg: token.colorBgContainer,
    textColor: token.colorText,
    borderColor: token.colorBorder,
  };
  
  return <DepartmentCard {...props} theme={themeConfig} />;
};

export default ThemedDepartmentCard;
