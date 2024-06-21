import { Typography, Row } from "antd";
import React from "react";
function Header() {
  const { Title } = Typography;
  return (
    <Row className="flex justify-center">
      <Title level={3}>123456</Title>
    </Row>
  );
}

export default Header;
