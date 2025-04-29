import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/CartContext';
import '.././styles/HeaderComponent.css';

const HeaderComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { totalItems } = useCart();
  
  // Effect to detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const navItems = ['Accueil', 'Produits', 'Nouveautés', 'Promotions', 'À Propos', 'Contact'];

  return (
    <header className={`header-component ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo and Navigation */}
        <div className="header-logo-nav">
          <div 
            className="mobile-menu-button" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuOutlined className="menu-icon" />
          </div>
          
          <div className="logo-container">
            <div className="site-logo">
              TechBoutique
            </div>
          </div>
          
          <nav className="desktop-navigation">
            {navItems.map((item, index) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`nav-item ${index === 0 ? 'active' : ''}`}
              >
                {item}
                <span className={`nav-item-underline ${index === 0 ? 'active' : ''}`}></span>
              </a>
            ))}
          </nav>
        </div>
        
        {/* Search field - visible only on large screens by default */}
        <div className={`desktop-search ${searchFocused ? 'search-focused' : ''}`}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <SearchOutlined className="search-icon" />
          </div>
        </div>
        
        {/* User, favorites, cart icons */}
        <div className="header-actions">
          {/* Search icon on mobile */}
          <div className="mobile-search-button">
            <SearchOutlined className="action-icon" />
          </div>
          
          <div className="user-icon-container">
            <UserOutlined className="action-icon" />
          </div>
          
          <div className="wishlist-icon-container">
            <HeartOutlined className="action-icon" />
            <span className="wishlist-count">2</span>
          </div>
          
          <div className="cart-icon-container">
            <Badge 
              count={totalItems} 
              showZero={false} 
              size="small"
              style={{ 
                backgroundColor: '#0ea5e9',
                boxShadow: '0 0 0 2px #fff'
              }}
            >
              <ShoppingCartOutlined className="action-icon" />
            </Badge>
          </div>
        </div>
      </div>

      {/* Full-width search bar on mobile */}
      <div className="mobile-search-bar">
        <div className="mobile-search-container">
          <div className="mobile-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="mobile-search-input"
            />
            <SearchOutlined className="mobile-search-icon" />
          </div>
        </div>
      </div>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default HeaderComponent;