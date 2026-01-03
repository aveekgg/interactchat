import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

interface ProductCarouselProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onProductClick }) => {
  return (
    <div className="product-carousel">
      <div className="carousel-container">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
