'use client'

import { useState } from 'react'

export interface RecommendedItem {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
}

interface RecommendedItemsProps {
  items: RecommendedItem[]
  onAddToCart?: (item: RecommendedItem) => void
  columns?: number
}

export function RecommendedItems({ items, onAddToCart, columns = 3 }: RecommendedItemsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-border transition-all duration-300"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            borderColor: hoveredId === item.id ? '#d4af37' : '#2a2a2a'
          }}
        >
          <div className="h-80 overflow-hidden bg-black-secondary">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: hoveredId === item.id ? 'scale(1.08)' : 'scale(1)'
              }}
            />
          </div>
          <div className="p-6">
            {item.category && (
              <p className="text-xs font-bold tracking-widest text-gold-primary mb-2 uppercase">
                {item.category}
              </p>
            )}
            <h3 className="text-lg font-bold tracking-wide mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-xs text-muted-foreground mb-4">{item.description}</p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-bold text-gold-primary">${item.price.toFixed(2)}</span>
              <button
                onClick={() => onAddToCart?.(item)}
                className="text-xs font-bold tracking-widest text-foreground hover:text-gold-primary transition-colors uppercase"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
