import React from 'react';
import './WishlistPage.css';

interface WishlistPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="page-overlay" onClick={onClose} />

      {/* Wishlist Page Modal */}
      <div className="wishlist-page-modal">
        <div className="wishlist-page-header">
          <h2>My Wishlist</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="wishlist-page-content">
          <div className="coming-soon">
            <div className="coming-soon-icon">❤️</div>
            <h3>Wishlist Feature</h3>
            <p>Coming Soon!</p>
            <p className="description">
              Save your favorite shoes and get notified when they're on sale or back in stock.
            </p>
            <div className="features-list">
              <div className="feature-item">💝 Save favorite items</div>
              <div className="feature-item">🔔 Price drop notifications</div>
              <div className="feature-item">🔄 Restock alerts</div>
              <div className="feature-item">📊 Wishlist analytics</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};