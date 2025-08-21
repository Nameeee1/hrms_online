import styled from 'styled-components';
import { Layout } from 'antd';
import { TableCell, TableRow, tableCellClasses } from '@mui/material';

const { Content } = Layout;

export const MainContent = styled(Layout)`
    margin: 10px 20px 10px 20px;
    transition: margin 0.2s;
    min-height: calc(100vh - 20px);
    overflow: hidden;

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
    display: flex;
    flex-direction: column;
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

export const SearchContainer = styled.div`
  position: relative;
  margin: 0 24px 8px 0;
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 400px;
`;

export const SearchInput = styled.input`
  padding: 12px 40px 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #d1d5db;
    border-width: 2px;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const TableToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
`;

export const AddButton = styled.button`
  background: linear-gradient(to bottom, #000000, #880808);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 45px;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: 'linear-gradient(to bottom, #000000, #880808)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    borderBottom: 'none',
    textAlign: 'center',
    verticalAlign: 'middle',
    '&:not(:last-child)': {
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    },
    '& > *': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
    color: '#333',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    verticalAlign: 'middle',
    '& > *': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      margin: '0 auto'
    }
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fafafa',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));