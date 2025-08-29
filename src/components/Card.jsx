import React from "react";
import styled from "styled-components";
import { Users, Building2 } from 'lucide-react';

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 4px 12px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)'};
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 4px 0;
`;

const Percentage = styled.span`
  font-size: 14px;
  color: #4CAF50;
  display: flex;
  align-items: center;
  font-weight: 500;

  &::before {
    content: "▲";
    margin-right: 4px;
    font-size: 12px;
  }
`;

const IconWrapper = styled.div`
  background-color: ${props => props.$bgColor};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 28px;
    height: 28px;
    color: ${props => props.$iconColor};
  }
`;

const Sublabel = styled.span`
  font-size: 10px;
  color: #888;
  margin-top: -2px;
  margin-bottom: 4px;
`;

const StatsCard = ({ label, value, percentage, icon, sublabel, onClick, style }) => {
  const Icon = ({ name }) => {
    const iconProps = { size: 28 };
    switch(name) {
      case 'Users':
        return <Users {...iconProps} />;
      case 'RAHYO':
        return <Building2 {...iconProps} />;
      case 'HHI':
        return <Building2 {...iconProps} />;
      default:
        return null;
    }
  };
  
  // Determine background color based on card type
  const getIconBackground = () => {
    switch(icon) {
      case 'RAHYO':
        return '#fff0f6'; // Light red/pink
      case 'HHI':
        return '#f0f9ff'; // Light blue
      default:
        return '#e6f2ff'; // Default light blue
    }
  };
  
  // Determine icon color based on card type
  const getIconColor = () => {
    switch(icon) {
      case 'RAHYO':
        return '#ff4d4f'; // Red
      case 'HHI':
        return '#1890ff'; // Blue
      default:
        return '#3b82f6'; // Default blue
    }
  };

  return (
    <Card 
      onClick={onClick}
      style={style}
      $clickable={!!onClick}
    >
      <Info>
        <Label>{label}</Label>
        <Value>{value}</Value>
        {sublabel && <Sublabel>{sublabel}</Sublabel>}
        {percentage && <Percentage>{percentage} <span>vs last month</span></Percentage>}
      </Info>
      <IconWrapper 
        $bgColor={getIconBackground()}
        $iconColor={getIconColor()}
      >
        <Icon name={icon} />
      </IconWrapper>
    </Card>
  );
};

export default StatsCard;
