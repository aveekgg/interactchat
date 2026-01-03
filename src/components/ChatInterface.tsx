import React, { useState, useRef, useEffect } from 'react';
import { Message, Product } from '../types';
import { ChatService } from '../services/chatService';
import { CartesiaTTSService } from '../services/cartesiaService';
import { cartService } from '../services/cartService';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import ProductDetail from './ProductDetail';
import Settings from './Settings';
import { HamburgerMenu } from './HamburgerMenu';
import { CartPage } from './CartPage';
import { AddressPage } from './AddressPage';
import { WishlistPage } from './WishlistPage';
import './ChatInterface.css';

const chatService = new ChatService(true); // Try to use AI by default

// Create Cartesia TTS service (or use environment variable for API key)
const cartesiaApiKey = import.meta.env.VITE_CARTESIA_API_KEY || '';
const ttsService = cartesiaApiKey 
  ? new CartesiaTTSService({
      apiKey: cartesiaApiKey,
      emotion: 'enthusiastic', // Energetic sales person!
      speed: 1.1 // Slightly faster for energy
    })
  : null;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your ShoeStore assistant. Ask me anything about our shoes, or tap the mic to speak!",
      timestamp: new Date(),
      quickReplies: [
        "Show running shoes",
        "What's on sale?",
        "Show all brands"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isAIMode, setIsAIMode] = useState(chatService.isAIEnabled());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCartPage, setShowCartPage] = useState(false);
  const [showAddressPage, setShowAddressPage] = useState(false);
  const [showWishlistPage, setShowWishlistPage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Process message and get response (now async)
    try {
      // Prepare conversation history for context (exclude the current user message)
      const conversationHistory = messages.slice(1).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await chatService.processMessage(text, conversationHistory);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.text,
        timestamp: new Date(),
        products: response.products,
        quickReplies: response.quickReplies,
        imageUrl: response.imageUrl,
        form: response.form,
        cart: response.cart,
        showText: !response.shouldSpeak // Hide text initially if voice will play
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);

      // Speak the response with callback to track speaking state
      if (response.shouldSpeak && response.text && ttsService) {
        setIsSpeaking(true);
        ttsService.speak(response.text, () => {
          setIsSpeaking(false);
          // Show text after voice synthesis completes
          setMessages(prev => prev.map(msg => 
            msg.id === botMessage.id 
              ? { ...msg, showText: true }
              : msg
          ));
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setIsProcessing(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm having trouble processing that right now. Please try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    // Stop any ongoing speech when user starts speaking
    if (ttsService?.isSpeaking()) {
      ttsService.stop();
      setIsSpeaking(false);
    }
    handleSendMessage(transcript);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleAskQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleAddToCart = (product: Product, selectedSize: string, selectedColor: string) => {
    cartService.addItem(product, 1, selectedSize, selectedColor);
    
    // Add a confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `✅ ${product.name} has been added to your cart! ${cartService.getCartSummary()}`,
      timestamp: new Date(),
      cart: cartService.getCart()
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleAIModeChange = (enabled: boolean) => {
    chatService.setAIMode(enabled);
    setIsAIMode(enabled);
  };

  const handleFormSubmit = (formData: any) => {
    // Handle form submission - could send to backend or process locally
    console.log('Form submitted:', formData);

    // Add a confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Thanks for submitting the form! I've received your information.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleFormCancel = () => {
    // Handle form cancellation
    const cancelMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `No problem! Let me know if you'd like to fill out the form later or ask about something else.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleCartUpdate = (action: string, data: any) => {
    switch (action) {
      case 'update_quantity':
        cartService.updateQuantity(data.productId, data.quantity, data.selectedSize, data.selectedColor);
        break;
      case 'remove_item':
        cartService.removeItem(data.productId, data.selectedSize, data.selectedColor);
        break;
      case 'clear_cart':
        cartService.clearCart();
        break;
      default:
        console.warn('Unknown cart action:', action);
    }

    // Add a confirmation message
    const cartMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Cart updated! ${cartService.getCartSummary()}`,
      timestamp: new Date(),
      cart: cartService.getCart()
    };

    setMessages(prev => [...prev, cartMessage]);
  };

  const handleStopSpeaking = () => {
    if (ttsService?.isSpeaking()) {
      ttsService.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="header-content">
          <div className="store-icon">👟</div>
          <div className="header-text">
            <h1>ShoeStore Assistant</h1>
            <p className="status">
              {isProcessing ? 'Typing...' : isAIMode ? 'AI Mode ✨' : 'Online'}
            </p>
          </div>
          <button className="settings-button" onClick={() => setShowSettings(true)} title="Settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4.22 4.22l4.24 4.24m5.28 5.28l4.24 4.24M19.78 4.22l-4.24 4.24m-5.28 5.28l-4.24 4.24" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <HamburgerMenu
            cart={cartService.getCart()}
            onCartClick={() => setShowCartPage(true)}
            onAddressClick={() => setShowAddressPage(true)}
            onWishlistClick={() => setShowWishlistPage(true)}
          />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onProductClick={handleProductClick}
            onFormSubmit={handleFormSubmit}
            onFormCancel={handleFormCancel}
            onQuickReplyClick={handleQuickReply}
            onCartUpdate={handleCartUpdate}
          />
        ))}
        {isProcessing && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Stop Speaking Button */}
      {isSpeaking && (
        <div className="stop-speaking-container">
          <button 
            className="stop-speaking-button" 
            onClick={handleStopSpeaking}
            title="Stop AI voice"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
            <span>Stop Speaking</span>
          </button>
        </div>
      )}

      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about shoes..."
            disabled={isProcessing}
            className="chat-input"
          />
          <VoiceInput 
            onTranscript={handleVoiceInput} 
            disabled={isProcessing}
            ttsService={ttsService}
            continuous={false}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isProcessing}
            className="send-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseProductDetail}
          onAskQuestion={handleAskQuestion}
          onAddToCart={handleAddToCart}
        />
      )}

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onAIModeChange={handleAIModeChange}
          currentAIMode={isAIMode}
        />
      )}

      {showCartPage && (
        <CartPage isOpen={showCartPage} onClose={() => setShowCartPage(false)} />
      )}

      {showAddressPage && (
        <AddressPage isOpen={showAddressPage} onClose={() => setShowAddressPage(false)} />
      )}

      {showWishlistPage && (
        <WishlistPage isOpen={showWishlistPage} onClose={() => setShowWishlistPage(false)} />
      )}
    </div>
  );
};

export default ChatInterface;
