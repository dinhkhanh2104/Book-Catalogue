import { Typography, Row } from "antd";
import React from "react";
function Header({ name }) {
  const { Title } = Typography;
  return (
    <Row className="flex justify-center">
      <Title level={3}>{name}</Title>
    </Row>
  );
}

export default Header;
