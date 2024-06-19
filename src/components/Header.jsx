import { Typography, Row } from "antd";
import React from "react";
function Header() {
  const { Title } = Typography;
  return (
    <Row className="flex justify-center">
      <Title level={3}>Book Catalogue</Title>
    </Row>
  );
}

export default Header;
