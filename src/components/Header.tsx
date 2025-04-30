import React, { useState, useEffect } from 'react';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  SearchOutlined, 
  HeartOutlined, 
  MenuOutlined, 
  LogoutOutlined, 
  DownOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import '../styles/HeaderComponent.css';

const HeaderComponent = () => {
  // État pour gérer les comportements de la barre de navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Simulation des données de contexte (remplacez par vos propres contextes)
  const totalItems = 3; // Nombre d'articles dans le panier
  const user = { name: "Thomas", avatar: null }; // Utilisateur connecté
  
  const navigate = useNavigate();
  
  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simulation de déconnexion
  const handleLogout = () => {
    // Remplacez par votre logique de déconnexion
    console.log("Déconnexion");
    navigate('/');
  };

  // Éléments de navigation
  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Nouveautés', path: '/new' },
    { name: 'Promotions', path: '/sales' },
    { name: 'Propos', path: '/about' },
    
  ];
  
  // Fermer les menus si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ferme le dropdown utilisateur si on clique en dehors
      if (userDropdownOpen && 
          !event.target.closest('.user-dropdown') && 
          !event.target.closest('.user-avatar')) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Prévenir le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`header-component ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo et navigation */}
        <div className="header-logo-nav">
          {/* Bouton menu mobile */}
          <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
            <MenuOutlined />
          </div>
          
          {/* Logo */}
          <div className="logo-container">
            <Link to="/" className="site-logo">
              TechBoutique
            </Link>
          </div>
          
          {/* Navigation desktop */}
          <nav className="desktop-navigation">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.name}
                <span className="nav-item-underline"></span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Recherche desktop */}
        <div className={`search-section ${searchFocused ? 'focused' : ''}`}>
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

        {/* Actions */}
        <div className="header-actions">
          {/* Bouton recherche mobile */}
          <div 
            className="action-item mobile-search-button"
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
          >
            <SearchOutlined />
          </div>

          {/* User dropdown */}
          <div className={`action-item user-dropdown ${userDropdownOpen ? 'open' : ''}`}>
            <div className="user-avatar" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              {user ? (
                <>
                  <div className="avatar-circle">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="avatar-image" />
                    ) : (
                      <UserOutlined />
                    )}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <DownOutlined className="dropdown-icon" />
                </>
              ) : (
                <Link to="/login">
                  <UserOutlined />
                </Link>
              )}
            </div>
            
            {/* User dropdown menu */}
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Mon Profil
              </Link>
              <Link to="/orders" className="dropdown-item">
                Mes Commandes
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-button" onClick={handleLogout}>
                <LogoutOutlined className="dropdown-button-icon" />
                Déconnexion
              </button>
            </div>
          </div>
          
          {/* Wishlist */}
          <div className="action-item">
            <Link to="/wishlist">
              <HeartOutlined />
              <span className="badge">2</span>
            </Link>
          </div>
          
          {/* Cart */}
          <div className="action-item">
            <Link to="/cart">
              <ShoppingCartOutlined />
              {totalItems > 0 && (
                <span className="badge blue">{totalItems}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className={`mobile-search-bar ${mobileSearchVisible ? 'visible' : ''}`}>
        <div className="mobile-search-container">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="mobile-search-input"
          />
          <SearchOutlined className="mobile-search-icon" />
        </div>
      </div>

      {/* Mobile menu overlay et menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'mobile-menu-open' : ''}`} 
           onClick={() => setMobileMenuOpen(false)}></div>
      
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* En-tête du menu mobile */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">TechBoutique</div>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <CloseOutlined />
          </button>
        </div>
        
        {/* Section utilisateur dans le menu mobile */}
        {user && (
          <div className="mobile-user-section">
            <div className="mobile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-image" />
              ) : (
                <UserOutlined />
              )}
            </div>
            <div className="mobile-user-info">
              <div className="mobile-user-name">{user.name}</div>
              <button className="mobile-logout-button" onClick={handleLogout}>
                <LogoutOutlined className="mobile-logout-icon" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation mobile */}
        <nav className="mobile-navigation">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Actions rapides mobile */}
        <div className="mobile-actions">
          <Link to="/profile" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
            <UserOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Profil</span>
          </Link>
          <Link to="/wishlist" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
            <HeartOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Favoris</span>
          </Link>
          <Link to="/cart" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCartOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Panier</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;