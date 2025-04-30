import React from 'react';
import { Card, Row, Col } from 'antd';
import { FireOutlined } from '@ant-design/icons';


const NewProductsPage = () => {
  const newProducts = [
    { id: 1, name: 'Smartphone X9', price: '€799' },
    { id: 2, name: 'Écran 4K 32"', price: '€349' },
    { id: 3, name: 'Casque Bluetooth Pro', price: '€199' }
  ];

  return (
    <div className="products-container">
      <h2><FireOutlined /> Nouveautés</h2>
      <Row gutter={[16, 16]}>
        {newProducts.map(product => (
          <Col xs={24} sm={12} md={8} key={product.id}>
            <Card hoverable className="product-card">
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <button className="view-btn">Voir le produit</button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewProductsPage;