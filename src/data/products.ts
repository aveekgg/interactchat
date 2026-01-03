import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Air Max 270',
    brand: 'Nike',
    category: 'running',
    price: 150,
    originalPrice: 180,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    description: 'Experience ultimate comfort with the Air Max 270. Features large Air unit for exceptional cushioning.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    rating: 4.5,
    inStock: true,
    features: ['Air Max cushioning', 'Breathable mesh', 'Lightweight design']
  },
  {
    id: '2',
    name: 'UltraBoost 22',
    brand: 'Adidas',
    category: 'running',
    price: 190,
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: ['White', 'Black', 'Grey'],
    description: 'Revolutionary energy return with Boost technology. Perfect for long-distance running.',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
    features: ['Boost cushioning', 'Primeknit upper', 'Continental rubber outsole']
  },
  {
    id: '3',
    name: 'Classic Leather',
    brand: 'Reebok',
    category: 'casual',
    price: 75,
    originalPrice: 90,
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Navy'],
    description: 'Timeless style meets everyday comfort. A wardrobe essential.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    rating: 4.3,
    inStock: true,
    features: ['Soft leather upper', 'EVA midsole', 'Classic design']
  },
  {
    id: '4',
    name: '574 Core',
    brand: 'New Balance',
    category: 'casual',
    price: 85,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Grey', 'Navy', 'Burgundy', 'Green'],
    description: 'The iconic 574 silhouette with modern comfort technology.',
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
    rating: 4.4,
    inStock: true,
    features: ['ENCAP midsole', 'Suede and mesh upper', 'Retro style']
  },
  {
    id: '5',
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    category: 'casual',
    price: 60,
    sizes: ['5', '6', '7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red', 'Navy', 'Pink'],
    description: 'The legendary sneaker that started it all. Timeless design for any occasion.',
    imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
    rating: 4.6,
    inStock: true,
    features: ['Canvas upper', 'Iconic design', 'Versatile style']
  },
  {
    id: '6',
    name: 'Gel-Kayano 29',
    brand: 'Asics',
    category: 'running',
    price: 160,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Blue', 'Black', 'Grey'],
    description: 'Premium stability shoe for overpronators. Engineered for long-distance comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop',
    rating: 4.8,
    inStock: true,
    features: ['GEL cushioning', 'Dynamic support', 'Breathable mesh']
  },
  {
    id: '7',
    name: 'Court Vision Low',
    brand: 'Nike',
    category: 'basketball',
    price: 70,
    originalPrice: 85,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Red'],
    description: 'Basketball-inspired style meets everyday comfort. Classic court look.',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
    rating: 4.2,
    inStock: true,
    features: ['Leather upper', 'Padded collar', 'Rubber outsole']
  },
  {
    id: '8',
    name: 'Cloudflow',
    brand: 'On Running',
    category: 'running',
    price: 140,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Blue'],
    description: 'Lightweight performance runner with CloudTec cushioning technology.',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    rating: 4.6,
    inStock: true,
    features: ['CloudTec cushioning', 'Speedboard technology', 'Lightweight mesh']
  },
  {
    id: '9',
    name: 'Stan Smith',
    brand: 'Adidas',
    category: 'casual',
    price: 90,
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['White/Green', 'White/Navy', 'All White'],
    description: 'The tennis legend that became a fashion icon. Clean, minimalist design.',
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
    features: ['Leather upper', 'Perforated 3-Stripes', 'Iconic style']
  },
  {
    id: '10',
    name: 'Speedcross 5',
    brand: 'Salomon',
    category: 'trail',
    price: 130,
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black', 'Blue', 'Red'],
    description: 'Aggressive grip for technical trails. Built for mountain running.',
    imageUrl: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&h=400&fit=crop',
    rating: 4.9,
    inStock: true,
    features: ['Contragrip outsole', 'Quicklace system', 'Sensifit technology']
  },
  {
    id: '11',
    name: 'Fresh Foam 1080',
    brand: 'New Balance',
    category: 'running',
    price: 155,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'Blue', 'Grey'],
    description: 'Plush cushioning for maximum comfort on long runs.',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    rating: 4.5,
    inStock: true,
    features: ['Fresh Foam midsole', 'Hypoknit upper', 'Data-driven design']
  },
  {
    id: '12',
    name: 'Metcon 8',
    brand: 'Nike',
    category: 'training',
    price: 140,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Grey'],
    description: 'Built for high-intensity training and weightlifting. Maximum stability.',
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop',
    rating: 4.6,
    inStock: false,
    features: ['Stable heel', 'Rope wrap', 'Reinforced upper']
  }
];

// Helper functions for querying products
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return products.filter(p => p.price >= min && p.price <= max);
};

export const getProductsOnSale = (): Product[] => {
  return products.filter(p => p.originalPrice && p.originalPrice > p.price);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.features.some(f => f.toLowerCase().includes(lowerQuery))
  );
};

export const getAvailableColors = (): string[] => {
  const colors = new Set<string>();
  products.forEach(p => p.colors.forEach(c => colors.add(c)));
  return Array.from(colors);
};

export const getAvailableBrands = (): string[] => {
  const brands = new Set(products.map(p => p.brand));
  return Array.from(brands);
};

export const getAvailableCategories = (): string[] => {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
};
