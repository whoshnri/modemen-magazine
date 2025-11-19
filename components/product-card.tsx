"use client";

import { motion } from 'framer-motion';
import { Product } from '@/lib/mock-data'; // Adjust path

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="border border-border bg-black-secondary transition-all duration-300 hover:border-gold-primary">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 text-center">
          <p className="text-xs tracking-widest text-muted-foreground mb-2">{product.category.toUpperCase()}</p>
          <h3 className="text-lg font-bold tracking-wider mb-3">{product.name}</h3>
          <p className="text-gold-primary text-xl font-light mb-6">${product.price.toFixed(2)}</p>
          <button className="w-full py-3 bg-black-primary text-gold-primary border border-gold-primary font-bold tracking-widest text-sm hover:bg-gold-primary hover:text-black-primary transition-colors">
            ADD TO CART
          </button>
        </div>
      </div>
    </motion.div>
  );
};