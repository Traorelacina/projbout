import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import client from '../api/client';
import '../styles/ProductsPage.css';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isNew?: boolean;
}

const NewProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await client.get('/products?isNew=true');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load new products');
        message.error('Could not load new products. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-page-container">
      <h2 className="page-title">
        <FireOutlined style={{ color: '#ff4d4f', marginRight: 10 }} />
        Nouveautés
      </h2>
      
      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col 
            key={product.id} 
            xs={24} 
            sm={12} 
            md={8} 
            lg={6}
            xl={6}
          >
            <Card
              hoverable
              className="product-card"
              cover={
                <img 
                  alt={product.name} 
                  src={product.image || '/placeholder-product.jpg'} 
                  className="product-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }}
                />
              }
            >
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                
                <div className="price-container">
                  {product.oldPrice && (
                    <span className="old-price">€{product.oldPrice.toFixed(2)}</span>
                  )}
                  <span className="current-price">€{product.price.toFixed(2)}</span>
                </div>
                
                <Link 
                  to={`/products/${product.id}`} 
                  className="view-product-btn"
                >
                  Voir le produit
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewProductsPage;