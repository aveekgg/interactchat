import { FormData } from '../types';

export interface ResponseTemplate {
  type: 'text' | 'form' | 'cart' | 'products' | 'confirmation';
  content: string;
  data?: any;
}

export class ResponseTemplates {
  // Form templates for different scenarios
  static appointmentBooking(): FormData {
    return {
      title: 'Book an Appointment',
      description: 'Schedule a time to visit our store or speak with a specialist.',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'your.email@example.com'
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone Number',
          required: true,
          placeholder: '(555) 123-4567'
        },
        {
          id: 'preferred_date',
          type: 'date',
          label: 'Preferred Date',
          required: true,
          minDate: new Date().toISOString().split('T')[0] // Today or later
        },
        {
          id: 'preferred_time',
          type: 'select',
          label: 'Preferred Time',
          required: true,
          options: [
            '9:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '1:00 PM - 2:00 PM',
            '2:00 PM - 3:00 PM',
            '3:00 PM - 4:00 PM',
            '4:00 PM - 5:00 PM'
          ]
        },
        {
          id: 'visit_reason',
          type: 'textarea',
          label: 'Reason for Visit',
          required: false,
          placeholder: 'What would you like to discuss or see?'
        }
      ],
      submitLabel: 'Book Appointment'
    };
  }

  static contactInfo(): FormData {
    return {
      title: 'Contact Information',
      description: 'Please provide your contact details so we can follow up.',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'your.email@example.com'
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone Number',
          required: false,
          placeholder: '(555) 123-4567'
        },
        {
          id: 'preferred_contact',
          type: 'select',
          label: 'Preferred Contact Method',
          required: true,
          options: ['Email', 'Phone', 'Text Message']
        }
      ],
      submitLabel: 'Save Contact Info'
    };
  }

  static productInquiry(productName?: string): FormData {
    return {
      title: 'Product Inquiry',
      description: `Tell us more about what you're looking for${productName ? ` regarding ${productName}` : ''}.`,
      fields: [
        {
          id: 'budget',
          type: 'select',
          label: 'Budget Range',
          required: false,
          options: ['Under $50', '$50-$100', '$100-$150', '$150-$200', '$200+']
        },
        {
          id: 'size',
          type: 'select',
          label: 'Size Needed',
          required: false,
          options: ['6', '7', '8', '9', '10', '11', '12', '13', '14']
        },
        {
          id: 'color_preference',
          type: 'text',
          label: 'Color Preference',
          required: false,
          placeholder: 'Any specific colors you prefer?'
        },
        {
          id: 'specific_needs',
          type: 'textarea',
          label: 'Specific Needs or Questions',
          required: false,
          placeholder: 'Any specific requirements or questions about this product?'
        }
      ],
      submitLabel: 'Submit Inquiry'
    };
  }

  static deliveryInfo(): FormData {
    return {
      title: 'Delivery Information',
      description: 'Where should we deliver your order?',
      fields: [
        {
          id: 'address_line1',
          type: 'text',
          label: 'Street Address',
          required: true,
          placeholder: '123 Main Street'
        },
        {
          id: 'address_line2',
          type: 'text',
          label: 'Apartment/Suite (Optional)',
          required: false,
          placeholder: 'Apt 4B'
        },
        {
          id: 'city',
          type: 'text',
          label: 'City',
          required: true,
          placeholder: 'New York'
        },
        {
          id: 'state',
          type: 'text',
          label: 'State/Province',
          required: true,
          placeholder: 'NY'
        },
        {
          id: 'zip_code',
          type: 'text',
          label: 'ZIP/Postal Code',
          required: true,
          placeholder: '10001'
        },
        {
          id: 'delivery_instructions',
          type: 'textarea',
          label: 'Delivery Instructions',
          required: false,
          placeholder: 'Any special delivery instructions?'
        }
      ],
      submitLabel: 'Save Delivery Address'
    };
  }

  // Response text templates
  static getTextTemplates() {
    return {
      greeting: "👋 Hi! I'm your ShoeStore assistant. I can help you find the perfect shoes, answer questions about our products, and even collect information when needed. What can I help you with today?",

      formIntroduction: "I'd be happy to help you with that! To provide the best assistance, I'll need some information from you. Please fill out this quick form:",

      cartSummary: (itemCount: number, total: number) =>
        `🛒 Your cart has ${itemCount} item${itemCount !== 1 ? 's' : ''} totaling $${total.toFixed(2)}. Would you like to checkout or make any changes?`,

      appointmentConfirmation: "✅ Your appointment has been scheduled! You'll receive a confirmation email shortly with all the details.",

      contactSaved: "✅ Your contact information has been saved! We'll be in touch soon.",

      inquiryReceived: "✅ Thanks for your inquiry! Our team will review your requirements and get back to you within 24 hours.",

      deliverySaved: "✅ Your delivery address has been saved! We'll use this for your order.",

      productAddedToCart: (productName: string) =>
        `✅ ${productName} has been added to your cart! Would you like to continue shopping or view your cart?`,

      formCancelled: "No problem! If you'd like to fill out the form later or need help with anything else, just let me know.",

      outOfStock: (productName: string) =>
        `😔 I'm sorry, ${productName} is currently out of stock. Would you like to see similar alternatives or be notified when it becomes available?`,

      sizeRecommendation: (activity: string, recommendedSize?: string) =>
        `For ${activity}, I recommend ${recommendedSize || 'trying on different sizes'}. Would you like me to show you our sizing guide?`,

      priceComparison: (productName: string, originalPrice: number, salePrice: number) =>
        `🎉 Great news! ${productName} is on sale for $${salePrice.toFixed(2)} (was $${originalPrice.toFixed(2)}). That's a savings of $${(originalPrice - salePrice).toFixed(2)}!`,

      brandExpertise: (brand: string) =>
        `I'm an expert on ${brand} shoes! They specialize in ${this.getBrandDescription(brand)}. What specific ${brand} style are you interested in?`,

      activityRecommendation: (activity: string) =>
        `For ${activity}, I recommend these types of shoes: ${this.getActivityRecommendations(activity)}. Would you like me to show you specific options?`
    };
  }

  private static getBrandDescription(brand: string): string {
    const descriptions: {[key: string]: string} = {
      'Nike': 'high-performance athletic footwear with innovative cushioning and support',
      'Adidas': 'stylish and comfortable shoes with German engineering and sport heritage',
      'New Balance': 'premium running shoes known for their comfort and unique fit',
      'Reebok': 'classic athletic wear with a focus on fitness and lifestyle',
      'Converse': 'iconic casual sneakers that have been a staple since 1917'
    };
    return descriptions[brand] || 'quality footwear with their unique style and expertise';
  }

  private static getActivityRecommendations(activity: string): string {
    const recommendations: {[key: string]: string} = {
      'running': 'lightweight running shoes with good cushioning and breathability',
      'basketball': 'high-top shoes with ankle support and traction for quick movements',
      'casual': 'comfortable everyday sneakers that look great with any outfit',
      'training': 'versatile cross-training shoes for gym workouts and general exercise',
      'trail': 'rugged hiking shoes with good grip and weather protection'
    };
    return recommendations[activity.toLowerCase()] || 'versatile shoes suitable for various activities';
  }

  // Quick reply templates
  static getQuickReplies() {
    return {
      initial: [
        "Show running shoes",
        "What's on sale?",
        "Show all brands",
        "Help me find shoes"
      ],

      afterProductView: [
        "Add to cart",
        "Show similar shoes",
        "Check sizing",
        "Ask a question"
      ],

      cartActions: [
        "View cart",
        "Continue shopping",
        "Checkout",
        "Clear cart"
      ],

      formOptions: [
        "Fill out form",
        "Skip for now",
        "Ask a different question"
      ],

      appointmentFollowup: [
        "Book another appointment",
        "Contact us",
        "Browse products"
      ]
    };
  }
}