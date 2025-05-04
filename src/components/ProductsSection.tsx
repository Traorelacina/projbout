import React, { useState, useEffect } from 'react';
import { Rate, Tooltip, Spin, message } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  CheckOutlined,
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
  rating?: number;
  stock: number;
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
        const response = await client.get('/products');

        // Vérification si response.data est un tableau
        const fetched = response.data;
        const fetchedProducts = Array.isArray(fetched)
          ? fetched
          : Array.isArray(fetched.data)
          ? fetched.data
          : [];

        if (!Array.isArray(fetchedProducts)) {
          throw new Error('Les données reçues ne sont pas au format attendu.');
        }

        setProducts(fetchedProducts);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          (err.request
            ? 'Aucune réponse du serveur. Vérifiez votre connexion.'
            : err.message || 'Échec du chargement des produits');
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      message.warning('Ce produit est en rupture de stock.');
      return;
    }
    addToCart(product);
    setAddedToCartIds((prev) => [...prev, product.id]);
    message.success(`${product.name} ajouté au panier !`);

    setTimeout(() => {
      setAddedToCartIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((favId) => favId !== id));
      message.info('Retiré des favoris');
    } else {
      setFavorites((prev) => [...prev, id]);
      message.success('Ajouté aux favoris !');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Chargement des produits..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2 className="products-title">Produits en vedette</h2>
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
                    {product.isNew && <span className="badge badge-new">NOUVEAU</span>}
                    {product.isPromo && product.oldPrice && (
                      <span className="badge badge-promo">-{discountPercentage}%</span>
                    )}
                    {product.stock <= 0 && <span className="badge badge-outofstock">Rupture</span>}
                  </div>

                  <div className="product-actions-top">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </div>

                  <div className="product-actions-overlay">
                    <div className="product-actions-center">
                      <Tooltip title="Voir les détails">
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

                  {product.rating !== undefined && (
                    <div className="product-rating">
                      <Rate disabled defaultValue={product.rating} className="rating-stars" />
                    </div>
                  )}

                  <div className="product-footer">
                    <div className="product-prices">
                      <div className="current-price">${product.price.toFixed(2)}</div>
                      {product.oldPrice && (
                        <div className="old-price">${product.oldPrice.toFixed(2)}</div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart || product.stock <= 0}
                      className={`add-to-cart-button ${isInCart ? 'added' : ''}`}
                      aria-label={isInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
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
          <button className="view-all-button">Voir tous les produits</button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
