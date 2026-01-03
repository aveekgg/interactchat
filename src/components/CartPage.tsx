import React from 'react';
import { cartService } from '../services/cartService';
import { CartDisplay } from './CartDisplay';
import './CartPage.css';

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const cart = cartService.getCart();

  return (
    <>
      {/* Overlay */}
      <div className="page-overlay" onClick={onClose} />

      {/* Cart Page Modal */}
      <div className="cart-page-modal">
        <div className="cart-page-header">
          <h2>Shopping Cart</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cart-page-content">
          <CartDisplay
            cart={cart}
            showActions={true}
            compact={false}
            onUpdateQuantity={(productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
              cartService.updateQuantity(productId, quantity, selectedSize, selectedColor);
            }}
            onRemoveItem={(productId: string, selectedSize?: string, selectedColor?: string) => {
              cartService.removeItem(productId, selectedSize, selectedColor);
            }}
            onClearCart={() => {
              cartService.clearCart();
            }}
          />
        </div>

        {cart.items.length > 0 && (
          <div className="cart-page-footer">
            <button className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};