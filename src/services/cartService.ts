import { Product, Cart, CartItem } from '../types';

class CartService {
  private static instance: CartService;
  private cart: Cart = {
    items: [],
    total: 0,
    itemCount: 0
  };
  private listeners: ((cart: Cart) => void)[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  // Subscribe to cart changes
  subscribe(listener: (cart: Cart) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of cart changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.cart));
  }

  // Get current cart
  getCart(): Cart {
    return { ...this.cart };
  }

  // Add item to cart
  addItem(product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string): void {
    const existingItemIndex = this.cart.items.findIndex(item =>
      item.product.id === product.id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        selectedSize,
        selectedColor,
        addedAt: new Date()
      };
      this.cart.items.push(newItem);
    }

    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Remove item from cart
  removeItem(productId: string, selectedSize?: string, selectedColor?: string): void {
    this.cart.items = this.cart.items.filter(item =>
      !(item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor)
    );

    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number, selectedSize?: string, selectedColor?: string): void {
    const item = this.cart.items.find(item =>
      item.product.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, selectedSize, selectedColor);
      } else {
        item.quantity = quantity;
        this.updateCartTotals();
        this.saveToStorage();
        this.notifyListeners();
      }
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cart.items = [];
    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Check if product is in cart
  isInCart(productId: string, selectedSize?: string, selectedColor?: string): boolean {
    return this.cart.items.some(item =>
      item.product.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );
  }

  // Get item count for specific product
  getItemQuantity(productId: string, selectedSize?: string, selectedColor?: string): number {
    const item = this.cart.items.find(item =>
      item.product.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );
    return item?.quantity || 0;
  }

  // Calculate cart totals
  private updateCartTotals(): void {
    this.cart.total = this.cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    this.cart.itemCount = this.cart.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  }

  // Save cart to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('shoestore_cart', JSON.stringify(this.cart));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }

  // Load cart from localStorage
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('shoestore_cart');
      if (saved) {
        const parsedCart = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        this.cart = parsedCart;
        this.updateCartTotals();
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      // Reset to empty cart if loading fails
      this.cart = {
        items: [],
        total: 0,
        itemCount: 0
      };
    }
  }

  // Get cart summary for AI context
  getCartSummary(): string {
    if (this.cart.items.length === 0) {
      return 'Cart is empty';
    }

    const items = this.cart.items.map(item =>
      `${item.quantity}x ${item.product.name}${item.selectedSize ? ` (${item.selectedSize})` : ''}${item.selectedColor ? ` - ${item.selectedColor}` : ''}`
    ).join(', ');

    return `Cart contains: ${items}. Total: $${this.cart.total.toFixed(2)}`;
  }
}

export const cartService = CartService.getInstance();