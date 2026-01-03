import React from 'react';
import { Cart } from '../types';
import './OrderSummary.css';

interface OrderSummaryProps {
  cart: Cart;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: string;
  estimatedDelivery?: string;
  onEditShipping?: () => void;
  onEditPayment?: () => void;
  onConfirmOrder?: () => void;
  onCancelOrder?: () => void;
  showActions?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  shippingAddress,
  paymentMethod,
  estimatedDelivery,
  onEditShipping,
  onEditPayment,
  onConfirmOrder,
  onCancelOrder,
  showActions = true
}) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const taxRate = 0.08; // 8% tax
  const shippingCost = cart.total > 50 ? 0 : 9.99; // Free shipping over $50
  const taxAmount = cart.total * taxRate;
  const finalTotal = cart.total + shippingCost + taxAmount;

  return (
    <div className="order-summary">
      <h3 className="order-summary-title">📦 Order Summary</h3>

      {/* Order Items */}
      <div className="order-items">
        <h4>Items ({cart.itemCount})</h4>
        {cart.items.map((item, index) => (
          <div key={`${item.product.id}-${index}`} className="order-item">
            <div className="order-item-image">
              <img src={item.product.imageUrl} alt={item.product.name} />
            </div>
            <div className="order-item-details">
              <h5>{item.product.name}</h5>
              <p className="order-item-brand">{item.product.brand}</p>
              {(item.selectedSize || item.selectedColor) && (
                <div className="order-item-options">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                </div>
              )}
              <div className="order-item-price">
                {formatPrice(item.product.price)} × {item.quantity}
              </div>
            </div>
            <div className="order-item-total">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="order-totals">
        <div className="order-total-row">
          <span>Subtotal:</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
        <div className="order-total-row">
          <span>Shipping:</span>
          <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
        </div>
        <div className="order-total-row">
          <span>Tax:</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        <div className="order-total-row total">
          <span><strong>Total:</strong></span>
          <span><strong>{formatPrice(finalTotal)}</strong></span>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="order-section">
          <div className="order-section-header">
            <h4>📍 Shipping Address</h4>
            {onEditShipping && (
              <button className="edit-btn" onClick={onEditShipping}>
                Edit
              </button>
            )}
          </div>
          <div className="address-display">
            <p><strong>{shippingAddress.name}</strong></p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="order-section">
          <div className="order-section-header">
            <h4>💳 Payment Method</h4>
            {onEditPayment && (
              <button className="edit-btn" onClick={onEditPayment}>
                Edit
              </button>
            )}
          </div>
          <p>{paymentMethod}</p>
        </div>
      )}

      {/* Delivery Estimate */}
      {estimatedDelivery && (
        <div className="order-section">
          <h4>🚚 Estimated Delivery</h4>
          <p>{estimatedDelivery}</p>
        </div>
      )}

      {/* Order Actions */}
      {showActions && (
        <div className="order-actions">
          {onCancelOrder && (
            <button className="order-btn cancel" onClick={onCancelOrder}>
              Cancel Order
            </button>
          )}
          {onConfirmOrder && (
            <button className="order-btn confirm" onClick={onConfirmOrder}>
              Confirm Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};