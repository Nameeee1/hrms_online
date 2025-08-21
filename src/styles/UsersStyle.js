import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

export const MainContent = styled(Layout)`
    margin: 10px 20px 10px 20px;
    transition: margin 0.2s;
    min-height: calc(100vh - 20px);

    &.collapsed {
        margin-left: 90px;
    }

    &.expanded {
        margin-left: 200px;
    }
`;

export const ContentArea = styled(Content)`
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    min-height: calc(100vh - 20px);
    border: 2px solid #000000;
`;

export const DashboardHeader = styled.div`
    background-color: #fff;
    padding: 16px 24px;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #f0f0f0;
    position: sticky;
    top: 10px;
    z-index: 100;
    transition: all 0.3s;

    &.scrolled {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

export const UserSelect = styled.select`
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    min-width: 200px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
`;

export const SaveButton = styled.button`
    padding: 8px 16px;
    background: ${props => props.disabled 
        ? '#ccc' 
        : 'linear-gradient(to bottom, #000000, #880808)'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.7 : 1};
    transition: all 0.3s;
    font-size: 14px;

    &:hover {
        background: ${props => props.disabled 
            ? '#ccc' 
            : 'linear-gradient(to bottom, #111111, #aa0a0a)'};
    }

    &:active {
        background: linear-gradient(to bottom, #000000, #880808);
    }
`;


export const PermissionsContainer = styled.div`
    margin-top: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const PermissionSection = styled.div`
    display: flex;
    gap: 20px;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
`;

export const PermissionGroup = styled.div`
    flex: 1;
`;

export const PermissionTitle = styled.strong`
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
`;

export const PermissionControls = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`;

export const PermissionControl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const PermissionLabel = styled.span`
    min-width: 80px;
    font-size: 14px;
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8f8f8);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  transform: translateY(0);
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(136, 8, 8, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #880808, #ff4d4f);
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    &::before {
      content: '✏️';
      font-size: 1.2em;
    }
  }
`;

export const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  padding: 0;
  transition: all 0.2s ease;
  font-size: 18px;
  
  &:hover {
    background: rgba(136, 8, 8, 0.1);
    color: #880808;
    transform: rotate(90deg);
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

export const ModalBody = styled.div`
  padding: 28px 32px;
  background: #fff;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f9f9f9;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
`;

export const FormGroup = styled.div`
  margin-bottom: 22px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #444;
  font-size: 14px;
  letter-spacing: 0.2px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '•';
    color: #880808;
    font-size: 18px;
    line-height: 1;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fafafa;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  color: #333;
  
  &:focus {
    border-color: #880808;
    box-shadow: 0 0 0 3px rgba(136, 8, 8, 0.1);
    background-color: #fff;
    outline: none;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.8;
  }
  
  &::placeholder {
    color: #999;
    opacity: 0.8;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  background-color: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  color: #333;
  cursor: pointer;
  
  &:focus {
    border-color: #880808;
    box-shadow: 0 0 0 3px rgba(136, 8, 8, 0.1);
    background-color: #fff;
    outline: none;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

export const ModalButton = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${props => props.primary ? 'none' : '1px solid #e0e0e0'};
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #880808, #a82a2a)' 
    : 'white'};
  color: ${props => props.primary ? 'white' : '#555'};
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &::after {
      opacity: 1;
    }
    
    ${props => props.primary 
      ? 'background: linear-gradient(135deg, #9a0a0a, #b83232);' 
      : 'background: #f9f9f9;'}
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &::after {
      opacity: 0.5;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  ${props => props.primary && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
    }
  `}
`;