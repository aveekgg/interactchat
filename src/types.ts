export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  description: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  products?: Product[];
  quickReplies?: string[];
  imageUrl?: string;
  cart?: Cart;
  form?: FormData;
}

export interface ChatResponse {
  text: string;
  products?: Product[];
  quickReplies?: string[];
  imageUrl?: string;
  shouldSpeak?: boolean;
  cart?: Cart;
  form?: FormData;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  minDate?: string;
  maxDate?: string;
}

export interface FormData {
  title?: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
}
