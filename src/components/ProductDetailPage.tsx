import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Rate, 
  Spin, 
  message, 
  Divider, 
  Tag, 
  Row, 
  Col, 
  Image,
  Tabs,
  Badge
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import client from '../api/client';
import '../styles/ProductDetailPage.css';

const { TabPane } = Tabs;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
  specifications?: Record<string, string>;
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.get(`/products/${id}`);
        setProduct(response.data);
        
        // Check if product is in favorites (could be from localStorage)
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorite(favorites.includes(response.data.id));
        
      } catch (err: any) {
        let errorMessage = 'Failed to fetch product details';
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = 'No response from server. Check your connection.';
        } else {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({ ...product, quantity });
    message.success(`${product.name} added to cart!`);
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    const newFavoriteStatus = !favorite;
    setFavorite(newFavoriteStatus);
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (newFavoriteStatus) {
      favorites = [...favorites, product.id];
      message.success('Added to favorites!');
    } else {
      favorites = favorites.filter((favId: string) => favId !== product.id);
      message.info('Removed from favorites');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const calculateDiscount = () => {
    if (!product?.oldPrice) return 0;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <p className="error-message">{error}</p>
        <Button 
          type="primary" 
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Button 
          type="primary" 
          onClick={() => navigate('/products')}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  const discountPercentage = calculateDiscount();

  return (
    <div className="product-detail-page">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      
      <Row gutter={[32, 32]} className="product-detail-container">
        <Col xs={24} md={12} lg={10}>
          <div className="product-image-gallery">
            <div className="main-image-container">
              <Image
                src={product.image}
                alt={product.name}
                className="main-image"
                preview={false}
                fallback="/placeholder-product-image.jpg"
              />
              
              <div className="product-badges">
                {product.isNew && (
                  <Tag color="green" className="product-badge">
                    NEW
                  </Tag>
                )}
                {product.isPromo && product.oldPrice && (
                  <Tag color="red" className="product-badge">
                    -{discountPercentage}%
                  </Tag>
                )}
                {product.stock <= 0 && (
                  <Tag color="orange" className="product-badge">
                    Out of Stock
                  </Tag>
                )}
              </div>
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="thumbnail-container">
                {product.images.map((img, index) => (
                  <div key={index} className="thumbnail-item">
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      preview={false}
                      width={60}
                      height={60}
                      fallback="/placeholder-product-image.jpg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
        
        <Col xs={24} md={12} lg={14}>
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-category">
                <Tag color="blue">{product.category}</Tag>
              </div>
              
              <div className="product-rating">
                <Rate 
                  disabled 
                  allowHalf 
                  defaultValue={product.rating} 
                  className="rating-stars" 
                />
                <span className="rating-text">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            </div>
            
            <div className="product-price-section">
              {product.oldPrice && (
                <div className="old-price">
                  ${product.oldPrice.toFixed(2)}
                </div>
              )}
              <div className="current-price">
                ${product.price.toFixed(2)}
              </div>
              {product.oldPrice && (
                <div className="discount-badge">
                  Save {discountPercentage}%
                </div>
              )}
            </div>
            
            <div className="product-stock">
              {product.stock > 0 ? (
                <Badge status="success" text={`In Stock (${product.stock} available)`} />
              ) : (
                <Badge status="error" text="Out of Stock" />
              )}
            </div>
            
            <Divider />
            
            <div className="product-actions">
              <div className="quantity-selector">
                <Button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="quantity-value">{quantity}</span>
                <Button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="add-to-cart-button"
                size="large"
              >
                Add to Cart
              </Button>
              
              <Button
                type={favorite ? "primary" : "default"}
                danger={favorite}
                icon={favorite ? <HeartFilled /> : <HeartOutlined />}
                onClick={toggleFavorite}
                className="favorite-button"
                size="large"
              >
                {favorite ? 'Favorited' : 'Favorite'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <div className="product-details-tabs">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
        >
          <TabPane tab="Description" key="description">
            <div className="product-description">
              <p>{product.description}</p>
            </div>
          </TabPane>
          
          <TabPane tab="Specifications" key="specifications">
            <div className="product-specifications">
              {product.specifications ? (
                <Row gutter={[16, 16]}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <Col span={8} className="spec-label">
                        <strong>{key}</strong>
                      </Col>
                      <Col span={16} className="spec-value">
                        {value}
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              ) : (
                <p>No specifications available for this product.</p>
              )}
            </div>
          </TabPane>
          
          <TabPane tab={`Reviews (${product.reviews?.length || 0})`} key="reviews">
            <div className="product-reviews">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="review-user">{review.user}</span>
                      <Rate 
                        disabled 
                        defaultValue={review.rating} 
                        className="review-rating" 
                      />
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-comment">
                      <p>{review.comment}</p>
                    </div>
                    {index < product.reviews!.length - 1 && <Divider />}
                  </div>
                ))
              ) : (
                <p>No reviews yet for this product.</p>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage;