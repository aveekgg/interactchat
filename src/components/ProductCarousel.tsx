import React, { useRef, useEffect, useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

interface ProductCarouselProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onProductClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  return (
    <div className="product-carousel">
      <div
        ref={containerRef}
        className={`carousel-container ${canScroll ? 'has-scroll' : ''}`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
      {canScroll && (
        <div className="carousel-scroll-hint">
          <span className="scroll-text">Swipe for more →</span>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
