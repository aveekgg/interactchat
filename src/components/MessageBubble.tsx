import React from 'react';
import { Message } from '../types';
import { Form } from './Form';
import { CartDisplay } from './CartDisplay';
import ProductCarousel from './ProductCarousel';
import QuickReplies from './QuickReplies';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onProductClick?: (product: any) => void;
  onFormSubmit?: (formData: any) => void;
  onFormCancel?: () => void;
  onQuickReplyClick?: (reply: string) => void;
  onCartUpdate?: (action: string, data: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onProductClick,
  onFormSubmit,
  onFormCancel,
  onQuickReplyClick,
  onCartUpdate
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleFormSubmit = (formData: any) => {
    onFormSubmit?.(formData);
  };

  const handleCartUpdate = (action: string, data: any) => {
    onCartUpdate?.(action, data);
  };

  return (
    <div className={`message-bubble ${message.type}`}>
      <div className="message-content">
        {message.imageUrl && (
          <img src={message.imageUrl} alt="Message" className="message-image" />
        )}

        {(message.showText === undefined || message.showText) && (
          <p className="message-text">{message.content}</p>
        )}

        {message.showText === false && (
          <div className="voice-playing-indicator">
            <div className="voice-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <span className="voice-text">Speaking...</span>
          </div>
        )}

        {message.form && (
          <div className="message-form">
            <Form
              fields={message.form.fields}
              onSubmit={handleFormSubmit}
              onCancel={onFormCancel}
              title={message.form.title}
              description={message.form.description}
              submitLabel={message.form.submitLabel}
            />
          </div>
        )}

        {message.cart && (
          <div className="message-cart">
            <CartDisplay
              cart={message.cart}
              onProductClick={onProductClick}
              onUpdateQuantity={(productId: string, quantity: number, selectedSize?: string, selectedColor?: string) =>
                handleCartUpdate('update_quantity', { productId, quantity, selectedSize, selectedColor })
              }
              onRemoveItem={(productId: string, selectedSize?: string, selectedColor?: string) =>
                handleCartUpdate('remove_item', { productId, selectedSize, selectedColor })
              }
              onClearCart={() => handleCartUpdate('clear_cart', {})}
              compact={true}
            />
          </div>
        )}

        {message.products && message.products.length > 0 && (
          <div className="message-products">
            <ProductCarousel
              products={message.products}
              onProductClick={onProductClick}
            />
          </div>
        )}

        {message.quickReplies && message.quickReplies.length > 0 && onQuickReplyClick && (
          <div className="message-quick-replies">
            <QuickReplies
              replies={message.quickReplies}
              onSelect={onQuickReplyClick}
            />
          </div>
        )}

        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;