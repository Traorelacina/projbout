import React, { useState } from 'react';
import { Rate, Tooltip } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EyeOutlined, 
  CheckOutlined 
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import '../styles/ProductsSection.css';

const ProductsSection = () => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [addedToCartIds, setAddedToCartIds] = useState([]);
  
  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCartIds([...addedToCartIds, product.id]);
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      setAddedToCartIds(addedToCartIds.filter(id => id !== product.id));
    }, 2000);
  };
  
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  return (
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2 className="products-title">Produits Vedettes</h2>
          <div className="products-divider"></div>
          <p className="products-subtitle">
            Découvrez notre sélection de produits technologiques tendance et innovants
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
                {/* Image et badges */}
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                  
                  {/* Badges */}
                  <div className="product-badges">
                    {product.isNew && (
                      <span className="badge badge-new">
                        NOUVEAU
                      </span>
                    )}
                    {product.isPromo && product.oldPrice && (
                      <span className="badge badge-promo">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>
                  
                  {/* Actions superposées */}
                  <div className="product-actions-top">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                    >
                      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </div>
                  
                  <div className="product-actions-overlay">
                    <div className="product-actions-center">
                      <Tooltip title="Voir détails">
                        <button className="action-button">
                          <EyeOutlined />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="product-content">
                  <div className="product-category">
                    <span>{product.category}</span>
                  </div>
                  
                  <h3 className="product-name">
                    {product.name}
                  </h3>
                  
                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>
                  
                  <div className="product-rating">
                    <Rate 
                      disabled 
                      defaultValue={product.rating} 
                      className="rating-stars" 
                    />
                    <span className="rating-count"></span>
                  </div>
                  
                  <div className="product-footer">
                    <div className="product-prices">
                      <div className="current-price">
                        {product.price.toFixed(2)} €
                      </div>
                      {product.oldPrice && (
                        <div className="old-price">
                          {product.oldPrice.toFixed(2)} €
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart}
                      className={`add-to-cart-button ${isInCart ? 'added' : ''}`}
                    >
                      {isInCart ? (
                        <>
                          <CheckOutlined className="button-icon" />
                          <span>Ajouté</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartOutlined className="button-icon" />
                          <span>Ajouter</span>
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
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;