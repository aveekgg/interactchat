import React, { useState } from 'react';
import { Product } from '../types';
import './ProductDetail.css';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
  onAddToCart?: (product: Product, selectedSize: string, selectedColor: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAskQuestion, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAskAboutProduct = () => {
    onAskQuestion(`Tell me more about the ${product.name}`);
    onClose();
  };

  const handleCompare = () => {
    onAskQuestion(`Show me similar shoes to ${product.name}`);
    onClose();
  };

  const handleAddToCart = () => {
    if (onAddToCart && product.inStock) {
      onAddToCart(product, selectedSize, selectedColor);
      onClose(); // Close the modal after adding to cart
    }
  };

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="product-detail-content">
          <div className="product-detail-header">
            <div className="product-detail-image-container">
              <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
              {discount > 0 && (
                <div className="detail-discount-badge">Save {discount}%</div>
              )}
              {!product.inStock && (
                <div className="detail-stock-badge">Out of Stock</div>
              )}
            </div>

            <div className="product-detail-info">
              <div className="detail-brand">{product.brand}</div>
              <h2 className="detail-name">{product.name}</h2>
              
              <div className="detail-rating">
                <span className="detail-stars">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="detail-rating-value">{product.rating} / 5.0</span>
              </div>

              <div className="detail-price-section">
                <div className="detail-price">${product.price}</div>
                {product.originalPrice && (
                  <div className="detail-original-price">${product.originalPrice}</div>
                )}
                {discount > 0 && (
                  <div className="detail-savings">You save ${product.originalPrice! - product.price}</div>
                )}
              </div>
            </div>
          </div>

          <div className="product-detail-body">
            <div className="detail-section">
              <h3>Description</h3>
              <p className="detail-description">{product.description}</p>
            </div>

            <div className="detail-section">
              <h3>Key Features</h3>
              <ul className="detail-features-list">
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Select Size</h3>
              <div className="size-selector">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Available Colors</h3>
              <div className="color-selector">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    <span 
                      className="color-swatch"
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></span>
                    <span className="color-name">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Product Details</h3>
              <div className="detail-specs">
                <div className="spec-item">
                  <span className="spec-label">Category:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Brand:</span>
                  <span className="spec-value">{product.brand}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Availability:</span>
                  <span className={`spec-value ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-detail-footer">
            <button 
              className="action-button secondary"
              onClick={handleAskAboutProduct}
            >
              💬 Ask about this shoe
            </button>
            <button 
              className="action-button secondary"
              onClick={handleCompare}
            >
              🔍 Find similar shoes
            </button>
            <button 
              className="action-button primary"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              {product.inStock ? '🛒 Add to Cart' : '🔔 Notify Me'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
