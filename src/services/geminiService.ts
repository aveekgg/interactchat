import { GoogleGenAI } from '@google/genai';
import { products } from '../data/products';
import { ResponseTemplates } from './responseTemplates';
import { FormData, Cart } from '../types';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  private modelName: string = 'gemini-2.0-flash-exp';
  private isConfigured: boolean = false;

  constructor(config?: GeminiConfig) {
    if (config?.apiKey) {
      this.configure(config);
    }
  }

  configure(config: GeminiConfig) {
    try {
      this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
      this.modelName = config.model || 'gemini-2.0-flash-exp';
      this.isConfigured = true;
      console.log('✅ Gemini AI configured successfully');
    } catch (error) {
      console.error('Failed to configure Gemini AI:', error);
      this.isConfigured = false;
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.genAI !== null;
  }

  private buildSystemContext(): string {
    const productInfo = products.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      features: p.features,
      sizes: p.sizes,
      colors: p.colors,
      rating: p.rating,
      inStock: p.inStock
    }));

    return `You are an expert shoe consultant at ShoeStore with 15+ years of experience. You know every detail about running shoes, training gear, and athletic footwear. You ask smart questions to understand needs and give precise, helpful recommendations.

# EXPERT RECOMMENDATION GUIDELINES:
1. Keep responses to 4 sentences MAX (aim for 2-3 sentences, 15-20 seconds of natural speech)
2. Ask ONE targeted question at a time to gather key information
3. Use your expertise to give specific context about shoe features, fit, and performance
4. Reference real shoe knowledge: cushioning types, support levels, terrain suitability, injury prevention
5. Be conversational and confident - use contractions, natural phrasing
6. Focus on user needs: activity type, experience level, foot type, budget, preferences

# QUESTIONING STRATEGY:
- Start with: What activity/sport? (running, training, basketball, casual, trail)
- Then: Experience level? (beginner, intermediate, advanced)
- Then: Specific needs? (injury prevention, performance, comfort, style)
- Then: Budget and size preferences
- Always ask ONE question per response

# EXPERT CONTEXT TO PROVIDE:
- Running: Cushioning levels, pronation support, mileage expectations
- Training: Stability features, cross-training versatility, durability
- Basketball: Ankle support, traction patterns, court performance
- Trail: Grip technology, waterproofing, terrain adaptability
- Materials: Flyknit breathability, Air cushioning, Boost energy return

# FORM AND CART CAPABILITIES:
You can share forms and manage cart contents to collect information or display/process shopping cart.

FORM TYPES AVAILABLE:
- APPOINTMENT: Book an appointment (name, email, phone, date, time, reason)
- CONTACT: Collect contact information (name, email, phone, preferred contact)
- PRODUCT_INQUIRY: Ask about product preferences (budget, size, color, needs)
- DELIVERY: Collect delivery address (address, city, state, zip, instructions)

To share a form, include: FORM: [form_type]
Example: "I'd love to schedule that for you! FORM: [APPOINTMENT]"

To show cart contents, include: SHOW_CART: true
Example: "Here's what's in your cart! SHOW_CART: true"

To add items to cart, include: ADD_TO_CART: [product_id, size, color]
Example: "Great choice! ADD_TO_CART: [1, "10", "Black"]"

PRODUCT CATALOGUE:
${JSON.stringify(productInfo, null, 2)}

RESPONSE FORMAT:
When recommending products, include them using:
PRODUCTS: [product_id1, product_id2, product_id3, product_id4, ...]

Example: "For serious trail running, I'd recommend these with superior grip! PRODUCTS: [1, 2, 3, 4]"

IMPORTANT: When showing product options or recommendations, ALWAYS include at least 4 products to give users good choices. Only show fewer than 4 if there genuinely aren't that many matching products available.

When user wants to buy/add items conversationally, use:
ADD_TO_CART: [product_id, "size", "color"]

Examples:
- User: "Buy the Nike Air Max" → "Great choice! ADD_TO_CART: [1, "10", "Black"]"
- User: "Add those running shoes to my cart" → "Perfect! ADD_TO_CART: [2, "9", "Blue"]"
- User: "I'll take the red Adidas" → "Excellent! ADD_TO_CART: [3, "11", "Red"]"

QUICK REPLIES (optional - max 3):
QUICK_REPLIES: ["Question 1", "Question 2", "Question 3"]

AVAILABLE CATEGORIES: running, casual, basketball, training, trail
AVAILABLE BRANDS: Nike, Adidas, New Balance, Reebok, Converse, Asics, Salomon, On Running

EXPERT APPROACH:
- Lead with confidence and knowledge
- Ask the right follow-up question
- Provide specific shoe expertise
- Keep it conversational and brief
- Focus on user success and satisfaction`;
  }

  private generateConversationSummary(conversationHistory: Array<{type: 'user' | 'bot', content: string}>): string {
    if (conversationHistory.length === 0) return '';

    // Take last 10 messages to keep context manageable
    const recentHistory = conversationHistory.slice(-10);
    
    const summary = recentHistory.map(msg => {
      const role = msg.type === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    }).join('\n');

    return `Previous conversation context:\n${summary}\n\nUse this context to provide relevant, personalized recommendations.`;
  }

  async generateResponse(userMessage: string, conversationHistory?: Array<{type: 'user' | 'bot', content: string}>): Promise<{
    text: string;
    productIds?: string[];
    quickReplies?: string[];
    form?: FormData;
    cart?: Cart;
    error?: string;
  }> {
    if (!this.isReady() || !this.genAI) {
      return {
        text: '',
        error: 'AI service not configured. Please set your Gemini API key.'
      };
    }

    try {
      const systemContext = this.buildSystemContext();
      
      // Generate conversation summary if history exists
      let conversationSummary = '';
      if (conversationHistory && conversationHistory.length > 0) {
        conversationSummary = this.generateConversationSummary(conversationHistory);
      }

      const prompt = `${systemContext}

${conversationSummary ? `CONVERSATION SUMMARY:\n${conversationSummary}\n\n` : ''}CURRENT USER QUESTION: ${userMessage}

YOUR EXPERT RESPONSE (2-4 sentences MAX, 15-20 seconds of natural speech, ask ONE smart question, use PRODUCTS: [...] if recommending):`;

      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt
      });

      let text = response.text || '';

      // Extract product IDs if mentioned
      let productIds: string[] | undefined;
      const productMatch = text.match(/PRODUCTS:\s*\[(.*?)\]/);
      if (productMatch) {
        const ids = productMatch[1].split(',').map((id: string) => id.trim());
        productIds = ids;
        // Remove the PRODUCTS tag from the visible text
        text = text.replace(/PRODUCTS:\s*\[.*?\]/, '').trim();
      }

      // Extract quick replies if mentioned
      let quickReplies: string[] | undefined;
      const repliesMatch = text.match(/QUICK_REPLIES:\s*\[(.*?)\]/);
      if (repliesMatch) {
        const repliesStr = repliesMatch[1];
        quickReplies = repliesStr
          .split(',')
          .map((r: string) => r.trim().replace(/^["']|["']$/g, ''))
          .filter((r: string) => r.length > 0);
        // Remove the QUICK_REPLIES tag from the visible text
        text = text.replace(/QUICK_REPLIES:\s*\[.*?\]/, '').trim();
      }

      // Extract form if mentioned
      let form: FormData | undefined;
      const formMatch = text.match(/FORM:\s*\[([^\]]+)\]/);
      if (formMatch) {
        const formType = formMatch[1].trim().toUpperCase();
        switch (formType) {
          case 'APPOINTMENT':
            form = ResponseTemplates.appointmentBooking();
            break;
          case 'CONTACT':
            form = ResponseTemplates.contactInfo();
            break;
          case 'PRODUCT_INQUIRY':
            form = ResponseTemplates.productInquiry();
            break;
          case 'DELIVERY':
            form = ResponseTemplates.deliveryInfo();
            break;
          default:
            console.warn('Unknown form type:', formType);
        }
        // Remove the FORM tag from the visible text
        text = text.replace(/FORM:\s*\[[^\]]+\]/, '').trim();
      }

      // Extract cart display if mentioned
      let cart: Cart | undefined;
      const cartMatch = text.match(/SHOW_CART:\s*true/);
      if (cartMatch) {
        // Import cart service dynamically to avoid circular dependency
        const { cartService } = await import('./cartService');
        cart = cartService.getCart();
        // Remove the SHOW_CART tag from the visible text
        text = text.replace(/SHOW_CART:\s*true/, '').trim();
      }

      // Extract cart addition if mentioned
      const addToCartMatch = text.match(/ADD_TO_CART:\s*\[([^\]]+)\]/);
      if (addToCartMatch) {
        const { cartService } = await import('./cartService');
        const params = addToCartMatch[1].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (params.length >= 1) {
          const productId = params[0];
          const selectedSize = params[1] || undefined;
          const selectedColor = params[2] || undefined;

          // Find the product
          const product = products.find(p => p.id === productId);
          if (product) {
            cartService.addItem(product, 1, selectedSize, selectedColor);
            // Always show cart after adding items
            cart = cartService.getCart();
          }
        }
        // Remove the ADD_TO_CART tag from the visible text
        text = text.replace(/ADD_TO_CART:\s*\[[^\]]+\]/, '').trim();
      }

      return {
        text: text || "I'd be happy to help you find the perfect shoes!",
        productIds,
        quickReplies,
        form,
        cart
      };
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      return {
        text: '',
        error: error.message || 'Failed to generate response'
      };
    }
  }

  // Helper method to test the connection
  async testConnection(): Promise<boolean> {
    if (!this.isReady() || !this.genAI) {
      return false;
    }

    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: 'Say "hello" if you can hear me'
      });
      return !!response.text;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let geminiServiceInstance: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiServiceInstance) {
    // Try to get API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    geminiServiceInstance = new GeminiService(apiKey ? { apiKey } : undefined);
  }
  return geminiServiceInstance;
};

export const configureGeminiService = (config: GeminiConfig): void => {
  geminiServiceInstance = new GeminiService(config);
};
