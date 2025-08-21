import styled from "styled-components";
import { Layout } from "antd";

const { Sider } = Layout;

export const StyledSider = styled(Sider)`
  background: linear-gradient(to bottom, #000000, #880808);
  height: calc(100vh - 20px);
  position: fixed;
  top: 10px;
  left: 10px;
  bottom: 10px;
  z-index: 1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.2s;
  width: 160px !important;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;

  &.ant-layout-sider-collapsed {
    width: 60px !important;
  }
`;
