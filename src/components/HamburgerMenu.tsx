import React, { useState, useEffect } from 'react';
import { Cart } from '../types';
import { cartService } from '../services/cartService';
import './HamburgerMenu.css';

interface HamburgerMenuProps {
  cart: Cart;
  onCartClick?: () => void;
  onAddressClick?: () => void;
  onWishlistClick?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  cart,
  onCartClick,
  onAddressClick,
  onWishlistClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cart.itemCount);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const [showAddressAnimation, setShowAddressAnimation] = useState(false);

  // Listen for cart changes to update count
  useEffect(() => {
    const unsubscribe = cartService.subscribe((updatedCart: Cart) => {
      setCartCount(updatedCart.itemCount);
    });

    return unsubscribe;
  }, []);

  // Animation trigger functions
  const triggerCartAnimation = () => {
    setShowCartAnimation(true);
    setTimeout(() => setShowCartAnimation(false), 1000);
  };

  const triggerAddressAnimation = () => {
    setShowAddressAnimation(true);
    setTimeout(() => setShowAddressAnimation(false), 1000);
  };

  // Expose animation triggers to parent
  useEffect(() => {
    (window as any).triggerCartAnimation = triggerCartAnimation;
    (window as any).triggerAddressAnimation = triggerAddressAnimation;
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCartClick = () => {
    onCartClick?.();
    setIsOpen(false);
  };

  const handleAddressClick = () => {
    onAddressClick?.();
    setIsOpen(false);
  };

  const handleWishlistClick = () => {
    onWishlistClick?.();
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-button" onClick={toggleMenu} title="Menu">
        <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {/* Cart count badge */}
        {cartCount > 0 && (
          <div className={`cart-badge ${showCartAnimation ? 'animate' : ''}`}>
            {cartCount}
          </div>
        )}
      </button>

      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)} />}

      {/* Menu Panel */}
      <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Menu</h3>
        </div>

        <div className="menu-items">
          {/* Cart Item */}
          <button
            className={`menu-item ${showCartAnimation ? 'highlight' : ''}`}
            onClick={handleCartClick}
          >
            <div className="menu-item-icon">
              🛒
              {cartCount > 0 && (
                <span className="item-count">{cartCount}</span>
              )}
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">Shopping Cart</div>
              <div className="menu-item-subtitle">
                {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Empty'}
              </div>
            </div>
          </button>

          {/* Address Item */}
          <button
            className={`menu-item ${showAddressAnimation ? 'highlight' : ''}`}
            onClick={handleAddressClick}
          >
            <div className="menu-item-icon">📍</div>
            <div className="menu-item-content">
              <div className="menu-item-title">Address</div>
              <div className="menu-item-subtitle">Manage delivery address</div>
            </div>
          </button>

          {/* Wishlist Item */}
          <button className="menu-item" onClick={handleWishlistClick}>
            <div className="menu-item-icon">❤️</div>
            <div className="menu-item-content">
              <div className="menu-item-title">Wishlist</div>
              <div className="menu-item-subtitle">Saved items</div>
            </div>
          </button>

          {/* Orders */}
          <button className="menu-item">
            <div className="menu-item-icon">📦</div>
            <div className="menu-item-content">
              <div className="menu-item-title">Orders</div>
              <div className="menu-item-subtitle">Order history</div>
            </div>
          </button>

          {/* Account */}
          <button className="menu-item">
            <div className="menu-item-icon">👤</div>
            <div className="menu-item-content">
              <div className="menu-item-title">Account</div>
              <div className="menu-item-subtitle">Profile & settings</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};