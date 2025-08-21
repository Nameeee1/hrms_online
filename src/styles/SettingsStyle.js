import styled from 'styled-components';
import { Layout, Card, Input, Table, Button, Typography } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

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

export const SettingsContainer = styled.div`
    padding: 24px;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
`;

export const StyledCard = styled(Card)`
    margin-bottom: 24px;
    flex: 1;
    min-width: 400px;
    
    .ant-card-head {
        background-color: #ffffff;
        border-bottom: 1px solid #f0f0f0;
        padding: 12px 16px;
    }
    
    .ant-card-body {
        padding: 16px;
    }
`;

export const SearchContainer = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StyledSearchInput = styled(Input)`
    width: 250px;
`;

export const ButtonContainer = styled.div`
    flex: 1;
    margin-left: 16px;
`;

export const StyledTable = styled(Table)`
    min-width: 600px;
    
    .ant-table-thead > tr > th {
        font-weight: 500;
        background: #fafafa;
    }
    
    .ant-table-tbody > tr > td {
        padding: 12px 16px;
    }
`;

export const DepartmentName = styled.span`
    font-weight: 500;
`;

export const LayoutContainer = styled(Layout)`
    min-height: 100vh;
    background-color: #f0f2f5;
`;

export const TitleContainer = styled(Title)`
    margin: 0 !important;
`;

export const FlexContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const TableContainer = styled.div`
    overflow-x: auto;
`;

export const StyledEditIcon = styled(EditOutlined)`
    color: #1890ff;
`;

export const StyledSearchIcon = styled(SearchOutlined)`
    color: #bfbfbf;
`;