import React from 'react';
import { CloseOutlined, UserOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import '../styles/MobileMenu.css';

const MobileMenu = ({ open, onClose }) => {
  const navItems = ['Accueil', 'Produits', 'Nouveautés', 'Promotions', 'À Propos', 'Contact'];

  return (
    <div className={`mobile-menu ${open ? 'open' : ''}`}>
      <div className="mobile-menu-container">
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">TechBoutique</div>
          <button className="mobile-menu-close" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {navItems.map((item, index) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`mobile-menu-item ${index === 0 ? 'active' : ''}`}
              onClick={onClose}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="mobile-menu-actions">
          <a href="#account" className="mobile-menu-action">
            <UserOutlined />
            <span>Mon Compte</span>
          </a>
          <a href="#wishlist" className="mobile-menu-action">
            <HeartOutlined />
            <span>Mes Favoris</span>
            <span className="mobile-menu-badge">2</span>
          </a>
          <a href="#cart" className="mobile-menu-action">
            <ShoppingCartOutlined />
            <span>Mon Panier</span>
            <span className="mobile-menu-badge">3</span>
          </a>
        </div>

        <div className="mobile-menu-contact">
          <p className="mobile-menu-contact-info">
            <strong>Téléphone:</strong> +33 1 23 45 67 89
          </p>
          <p className="mobile-menu-contact-info">
            <strong>Email:</strong> contact@techboutique.fr
          </p>
        </div>
      </div>
      <div className="mobile-menu-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default MobileMenu;