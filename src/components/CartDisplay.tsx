import React from 'react';
import { Cart, CartItem } from '../types';
import './CartDisplay.css';

interface CartDisplayProps {
  cart: Cart;
  onUpdateQuantity?: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem?: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  onClearCart?: () => void;
  onProductClick?: (product: any) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const CartDisplay: React.FC<CartDisplayProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProductClick,
  showActions = true,
  compact = false
}) => {
  if (cart.items.length === 0) {
    return (
      <div className="cart-display empty">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <small>Add some shoes to get started!</small>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const CartItemRow: React.FC<{ item: CartItem; onProductClick?: (product: any) => void }> = ({ item, onProductClick }) => (
    <div className={`cart-item ${compact ? 'compact' : ''}`}>
      <div className="cart-item-image">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          onClick={() => onProductClick?.(item.product)}
          style={{ cursor: onProductClick ? 'pointer' : 'default' }}
        />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-brand">{item.product.brand}</p>

        {(item.selectedSize || item.selectedColor) && (
          <div className="cart-item-options">
            {item.selectedSize && <span className="option">Size: {item.selectedSize}</span>}
            {item.selectedColor && <span className="option">Color: {item.selectedColor}</span>}
          </div>
        )}

        <div className="cart-item-price">
          <span className="unit-price">{formatPrice(item.product.price)}</span>
          {item.quantity > 1 && (
            <span className="quantity"> × {item.quantity}</span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="cart-item-actions">
          {onUpdateQuantity && (
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="quantity">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
              >
                +
              </button>
            </div>
          )}

          {onRemoveItem && (
            <button
              className="remove-btn"
              onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
              title="Remove item"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="cart-item-total">
        {formatPrice(item.product.price * item.quantity)}
      </div>
    </div>
  );

  return (
    <div className={`cart-display ${compact ? 'compact' : ''}`}>
      {!compact && <h3 className="cart-title">Shopping Cart ({cart.itemCount} items)</h3>}

      <div className="cart-items">
        {cart.items.map((item, index) => (
          <CartItemRow key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} item={item} onProductClick={onProductClick} />
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">{formatPrice(cart.total)}</span>
        </div>

        {showActions && onClearCart && cart.items.length > 0 && (
          <button className="clear-cart-btn" onClick={onClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {!compact && cart.items.length > 0 && (
        <div className="cart-actions">
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};