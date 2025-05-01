import React, { useState, useEffect } from 'react';
import { Rate, Tooltip, Spin, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EyeOutlined, 
  CheckOutlined 
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import client from '../api/client';
import '../styles/ProductsSection.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  rating: number;
  isNew?: boolean;
  isPromo?: boolean;
}

const ProductsSection = () => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utilisation du client axios configuré
        const response = await client.get('/products');
        setProducts(response.data);
        
      } catch (err: any) {
        let errorMessage = 'Failed to fetch products';
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

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCartIds([...addedToCartIds, product.id]);
    message.success(`${product.name} added to cart!`);
    
    setTimeout(() => {
      setAddedToCartIds(prevIds => prevIds.filter(id => id !== product.id));
    }, 2000);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      message.info('Removed from favorites');
    } else {
      setFavorites([...favorites, id]);
      message.success('Added to favorites!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2 className="products-title">Featured Products</h2>
          <div className="products-divider"></div>
          <p className="products-subtitle">
            Discover our selection of trendy and innovative tech products
          </p>
        </div>
        
        <div className="products-grid">
          {products.map((product) => {
            const isInCart = addedToCartIds.includes(product.id);
            const isFavorite = favorites.includes(product.id);
            const discountPercentage = product.oldPrice 
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
              : 0;
              
            return (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product-image.jpg';
                    }}
                  />
                  
                  <div className="product-badges">
                    {product.isNew && (
                      <span className="badge badge-new">NEW</span>
                    )}
                    {product.isPromo && product.oldPrice && (
                      <span className="badge badge-promo">-{discountPercentage}%</span>
                    )}
                  </div>
                  
                  <div className="product-actions-top">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </div>
                  
                  <div className="product-actions-overlay">
                    <div className="product-actions-center">
                      <Tooltip title="View details">
                        <button className="action-button">
                          <EyeOutlined />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                
                <div className="product-content">
                  <div className="product-category">
                    <span>{product.category}</span>
                  </div>
                  
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>
                  
                  <div className="product-rating">
                    <Rate 
                      disabled 
                      defaultValue={product.rating} 
                      className="rating-stars" 
                    />
                  </div>
                  
                  <div className="product-footer">
                    <div className="product-prices">
                      <div className="current-price">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.oldPrice && (
                        <div className="old-price">
                          ${product.oldPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart}
                      className={`add-to-cart-button ${isInCart ? 'added' : ''}`}
                      aria-label={isInCart ? 'Already in cart' : 'Add to cart'}
                    >
                      {isInCart ? (
                        <>
                          <CheckOutlined className="button-icon" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartOutlined className="button-icon" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="view-all-container">
          <button className="view-all-button">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;