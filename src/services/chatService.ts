import { ChatResponse } from '../types';
import {
  products,
  getProductsByCategory,
  getProductsByBrand,
  getProductsByPriceRange,
  getProductsOnSale,
  searchProducts,
  getAvailableBrands,
  getAvailableCategories,
  getProductById,
} from '../data/products';
import { getGeminiService } from './geminiService';

export class ChatService {
  private useAI: boolean = false;
  private geminiService = getGeminiService();

  constructor(useAI: boolean = false) {
    this.useAI = useAI && this.geminiService.isReady();
    
    if (useAI && !this.geminiService.isReady()) {
      console.warn('⚠️  AI mode requested but Gemini API not configured. Falling back to pattern matching.');
    }
  }

  setAIMode(enabled: boolean) {
    this.useAI = enabled && this.geminiService.isReady();
  }

  isAIEnabled(): boolean {
    return this.useAI && this.geminiService.isReady();
  }

  async processMessage(userMessage: string, conversationHistory?: Array<{type: 'user' | 'bot', content: string}>): Promise<ChatResponse> {
    // Try AI first if enabled
    if (this.useAI && this.geminiService.isReady()) {
      try {
        const aiResponse = await this.geminiService.generateResponse(userMessage, conversationHistory);
        
        if (!aiResponse.error && aiResponse.text) {
          // Convert product IDs to Product objects
          let matchedProducts = undefined;
          if (aiResponse.productIds && aiResponse.productIds.length > 0) {
            matchedProducts = aiResponse.productIds
              .map(id => getProductById(id))
              .filter(p => p !== undefined);
          }

          return {
            text: aiResponse.text,
            products: matchedProducts,
            quickReplies: aiResponse.quickReplies,
            form: aiResponse.form,
            cart: aiResponse.cart,
            shouldSpeak: true
          };
        }
        
        // If AI failed, fall through to pattern matching
        console.warn('AI response failed, using fallback:', aiResponse.error);
      } catch (error) {
        console.error('AI processing error:', error);
        // Fall through to pattern matching
      }
    }

    // Fallback to pattern-based matching
    return this.processMessageWithPatterns(userMessage);
  }

  private processMessageWithPatterns(userMessage: string): ChatResponse {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Greeting patterns
    if (this.isGreeting(lowerMessage)) {
      return {
        text: "Hello! Welcome to ShoeStore. I'm your personal shoe shopping assistant. How can I help you today?",
        quickReplies: [
          "Show me running shoes",
          "What's on sale?",
          "Nike shoes under $100",
          "Show all brands"
        ],
        shouldSpeak: true
      };
    }

    // Help/capabilities
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return {
        text: "I can help you find the perfect shoes! You can ask me about:\n• Specific brands or categories\n• Shoes by price range\n• What's on sale\n• Shoe features and details\n• Size and color availability",
        quickReplies: [
          "Show running shoes",
          "What's on sale?",
          "Show me Adidas",
          "Shoes under $100"
        ],
        shouldSpeak: true
      };
    }

    // Sale/discount queries
    if (lowerMessage.includes('sale') || lowerMessage.includes('discount') || lowerMessage.includes('deal')) {
      const saleProducts = getProductsOnSale();
      return {
        text: `Great news! We have ${saleProducts.length} shoes on sale right now. Check them out:`,
        products: saleProducts,
        quickReplies: [
          "Tell me more about the first one",
          "Show running shoes on sale",
          "What else is new?"
        ],
        shouldSpeak: true
      };
    }

    // Category queries
    const categories = ['running', 'casual', 'basketball', 'training', 'trail'];
    for (const category of categories) {
      if (lowerMessage.includes(category)) {
        const categoryProducts = getProductsByCategory(category);
        return {
          text: `Here are our ${category} shoes. We have ${categoryProducts.length} options for you:`,
          products: categoryProducts,
          quickReplies: [
            "Filter by brand",
            "Show cheaper options",
            "What's the best rated?"
          ],
          shouldSpeak: true
        };
      }
    }

    // Brand queries
    const brands = ['nike', 'adidas', 'new balance', 'reebok', 'converse', 'asics', 'salomon', 'on running'];
    for (const brand of brands) {
      if (lowerMessage.includes(brand)) {
        const brandName = brand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const brandProducts = getProductsByBrand(brandName);
        return {
          text: `Here are all our ${brandName} shoes. We have ${brandProducts.length} styles available:`,
          products: brandProducts,
          quickReplies: [
            "Show me the cheapest",
            "What's on sale?",
            "Show other brands"
          ],
          shouldSpeak: true
        };
      }
    }

    // Price range queries
    if (lowerMessage.includes('under') || lowerMessage.includes('less than') || lowerMessage.includes('cheaper')) {
      const priceMatch = lowerMessage.match(/\$?(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        const affordableProducts = getProductsByPriceRange(0, maxPrice);
        return {
          text: `I found ${affordableProducts.length} shoes under $${maxPrice}:`,
          products: affordableProducts,
          quickReplies: [
            "Show me the best rated",
            "Any on sale?",
            "Show running shoes"
          ],
          shouldSpeak: true
        };
      }
    }

    if (lowerMessage.includes('between') || lowerMessage.includes('range')) {
      const priceMatches = lowerMessage.match(/\$?(\d+)/g);
      if (priceMatches && priceMatches.length >= 2) {
        const min = parseInt(priceMatches[0].replace('$', ''));
        const max = parseInt(priceMatches[1].replace('$', ''));
        const rangeProducts = getProductsByPriceRange(min, max);
        return {
          text: `Here are shoes between $${min} and $${max}:`,
          products: rangeProducts,
          quickReplies: [
            "Show me the most popular",
            "What's new?",
            "Show all"
          ],
          shouldSpeak: true
        };
      }
    }

    // Show all brands
    if (lowerMessage.includes('all brands') || lowerMessage.includes('what brands')) {
      const brandList = getAvailableBrands();
      return {
        text: `We carry these brands: ${brandList.join(', ')}. Which one would you like to see?`,
        quickReplies: brandList.slice(0, 4),
        shouldSpeak: true
      };
    }

    // Show all categories
    if (lowerMessage.includes('categories') || lowerMessage.includes('types')) {
      const categoryList = getAvailableCategories();
      return {
        text: `We have these categories: ${categoryList.join(', ')}. What interests you?`,
        quickReplies: categoryList.map(c => `Show ${c} shoes`),
        shouldSpeak: true
      };
    }

    // Best rated / highest rated
    if (lowerMessage.includes('best') || lowerMessage.includes('highest rated') || lowerMessage.includes('top rated')) {
      const sortedProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
      return {
        text: `Here are our highest-rated shoes:`,
        products: sortedProducts,
        quickReplies: [
          "Show me the first one",
          "Any on sale?",
          "Show running shoes"
        ],
        shouldSpeak: true
      };
    }

    // Size availability
    if (lowerMessage.includes('size')) {
      const sizeMatch = lowerMessage.match(/size (\d+)/);
      if (sizeMatch) {
        const size = sizeMatch[1];
        const availableProducts = products.filter(p => p.sizes.includes(size));
        return {
          text: `We have ${availableProducts.length} shoes available in size ${size}:`,
          products: availableProducts.slice(0, 6),
          quickReplies: [
            "Show running shoes",
            "Filter by brand",
            "What's on sale?"
          ],
          shouldSpeak: true
        };
      }
      return {
        text: "What size are you looking for? We carry sizes from 5 to 13.",
        quickReplies: ["Size 9", "Size 10", "Size 11"],
        shouldSpeak: true
      };
    }

    // Color queries
    if (lowerMessage.includes('color') || lowerMessage.includes('black') || lowerMessage.includes('white') || lowerMessage.includes('blue') || lowerMessage.includes('red')) {
      const colorKeywords = ['black', 'white', 'blue', 'red', 'grey', 'navy', 'green'];
      for (const color of colorKeywords) {
        if (lowerMessage.includes(color)) {
          const colorName = color.charAt(0).toUpperCase() + color.slice(1);
          const colorProducts = products.filter(p => 
            p.colors.some(c => c.toLowerCase().includes(color))
          );
          return {
            text: `Here are our ${colorName} shoes:`,
            products: colorProducts,
            quickReplies: [
              "Show other colors",
              "Filter by price",
              "What's popular?"
            ],
            shouldSpeak: true
          };
        }
      }
    }

    // Stock availability
    if (lowerMessage.includes('in stock') || lowerMessage.includes('available')) {
      const inStockProducts = products.filter(p => p.inStock);
      return {
        text: `We have ${inStockProducts.length} shoes in stock right now:`,
        products: inStockProducts.slice(0, 6),
        quickReplies: [
          "Show running shoes",
          "What's on sale?",
          "Show by brand"
        ],
        shouldSpeak: true
      };
    }

    // Show all / browse
    if (lowerMessage.includes('show all') || lowerMessage.includes('browse') || lowerMessage.includes('see everything')) {
      return {
        text: `Here's our complete collection of ${products.length} shoes:`,
        products: products,
        quickReplies: [
          "Show running shoes",
          "What's on sale?",
          "Filter by brand"
        ],
        shouldSpeak: true
      };
    }

    // General search
    const searchResults = searchProducts(userMessage);
    if (searchResults.length > 0) {
      return {
        text: `I found ${searchResults.length} shoes matching "${userMessage}":`,
        products: searchResults,
        quickReplies: [
          "Show me more details",
          "What's on sale?",
          "Show other options"
        ],
        shouldSpeak: true
      };
    }

    // Default fallback
    return {
      text: "I'm not sure I understood that. Try asking me about shoe brands, categories, prices, or what's on sale!",
      quickReplies: [
        "Show running shoes",
        "What's on sale?",
        "Show all brands",
        "Shoes under $100"
      ],
      shouldSpeak: true
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(g => message.includes(g));
  }
}
