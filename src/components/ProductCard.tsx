import React from 'react';
import { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        {!product.inStock && (
          <div className="stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="rating-value">{product.rating}</span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-features">
          {product.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="feature-tag">✓ {feature}</span>
          ))}
        </div>

        <div className="product-colors">
          {product.colors.map((color, index) => (
            <span key={index} className="color-dot" title={color} style={{
              backgroundColor: color.toLowerCase()
            }}></span>
          ))}
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>
          <button 
            className="view-button" 
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {product.inStock ? 'View Details' : 'Notify Me'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
