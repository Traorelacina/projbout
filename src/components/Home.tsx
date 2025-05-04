import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Carousel, Typography, Button, Space } from 'antd';
import { ShoppingCartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];
const newArrivals = Array.isArray(products) ? products.slice(4, 8) : [];

  const heroImages = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner3.jpg',
  ];

  return (
    <div className="home-container">
      {/* Hero Carousel */}
      <Carousel autoplay className="hero-carousel">
        {heroImages.map((img, index) => (
          <div key={index} className="hero-slide">
            <div className="hero-image" style={{ backgroundImage: `url(${img})` }} />
            <div className="hero-overlay">
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  {index === 0 && 'Découvrez EMarketAfrica'}
                  {index === 1 && 'Produits Africains de Qualité'}
                  {index === 2 && 'Livraison Rapide et Sécurisée'}
                </Title>
                <Button
                  type="primary"
                  size="large"
                  className="hero-button"
                  onClick={() => navigate('/products')}
                >
                  Voir nos produits
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Featured Categories */}
      <section className="categories-section">
        <Title level={2} className="section-title">
          Nos Catégories Populaires
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {[
            { name: 'Électronique', icon: '📱', path: '/category/electronics' },
            { name: 'Mode', icon: '👗', path: '/category/fashion' },
            { name: 'Alimentation', icon: '🍎', path: '/category/food' },
            { name: 'Artisanat', icon: '🖼️', path: '/category/artisanat' },
          ].map((category) => (
            <Col key={category.name} xs={12} sm={8} md={6} lg={4}>
              <Card 
                hoverable 
                className="category-card"
                onClick={() => navigate(category.path)}
              >
                <Text className="category-icon">{category.icon}</Text>
                <Text strong className="category-name">{category.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <Title level={3} className="section-subtitle">
            <FireOutlined className="section-icon" />
            Produits Tendances
          </Title>
          <Button type="link" onClick={() => navigate('/products')}>
            Voir tout
          </Button>
        </div>
        <Row gutter={[16, 24]}>
          {featuredProducts.slice(0, 4).map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img 
                    alt={product.name} 
                    src={product.image || '/images/placeholder-product.jpg'} 
                    className="product-image"
                  />
                }
                className="product-card"
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => addToCart(product)}
                    className="product-action-button"
                  >
                    Ajouter
                  </Button>,
                  <Button 
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="product-action-button"
                  >
                    Voir détails
                  </Button>
                ]}
              >
                <Meta
                  title={<div className="product-title">{product.name}</div>}
                  description={
                    <>
                      <Text strong className="product-price">
                        {product.price.toLocaleString()} FCFA
                      </Text>
                      <Paragraph ellipsis={{ rows: 2 }} className="product-description">
                        {product.description}
                      </Paragraph>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* New Arrivals */}
      <section className="products-section">
        <div className="section-header">
          <Title level={3} className="section-subtitle">
            <StarOutlined className="section-icon" />
            Nouveaux Produits
          </Title>
          <Button type="link" onClick={() => navigate('/products?sort=newest')}>
            Voir tout
          </Button>
        </div>
        <Row gutter={[16, 24]}>
          {newArrivals.slice(0, 4).map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img 
                    alt={product.name} 
                    src={product.image || '/images/placeholder-product.jpg'} 
                    className="product-image"
                  />
                }
                className="product-card"
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => addToCart(product)}
                    className="product-action-button"
                  >
                    Ajouter
                  </Button>,
                  <Button 
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="product-action-button"
                  >
                    Voir détails
                  </Button>
                ]}
              >
                <Meta
                  title={<div className="product-title">{product.name}</div>}
                  description={
                    <>
                      <Text strong className="product-price">
                        {product.price.toLocaleString()} FCFA
                      </Text>
                      <Paragraph ellipsis={{ rows: 2 }} className="product-description">
                        {product.description}
                      </Paragraph>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Value Proposition */}
      <section className="value-proposition">
        <Row gutter={[24, 24]} justify="space-around">
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">🚚</div>
              <Title level={4} className="value-title">Livraison Rapide</Title>
              <Text className="value-text">Livraison express dans toute l'Afrique</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">🔒</div>
              <Title level={4} className="value-title">Paiement Sécurisé</Title>
              <Text className="value-text">Transactions 100% sécurisées</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">👍</div>
              <Title level={4} className="value-title">Satisfaction Garantie</Title>
              <Text className="value-text">Retours faciles sous 14 jours</Text>
            </div>
          </Col>
        </Row>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Title level={2} className="cta-title">
          Prêt à faire du shopping sur EMarketAfrica?
        </Title>
        <Paragraph className="cta-text">
          Découvrez notre large sélection de produits africains de qualité
        </Paragraph>
        <Space>
          <Button 
            type="primary" 
            size="large"
            className="cta-button"
            onClick={() => navigate('/products')}
          >
            Commencer à magasiner
          </Button>
          <Button 
            size="large"
            className="cta-button secondary"
            onClick={() => navigate('/about')}
          >
            Découvrir notre histoire
          </Button>
        </Space>
      </section>
    </div>
  );
};

export default Home;