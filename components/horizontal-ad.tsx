'use client'

import { ReactNode } from 'react'

interface HorizontalAdProps {
  title?: string
  description?: string
  image?: string
  link?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  children?: ReactNode
}

export function HorizontalAd({
  title,
  description,
  image,
  link,
  backgroundColor = '#1a1a1a',
  textColor = '#f5f5f5',
  borderColor = '#2a2a2a',
  children
}: HorizontalAdProps) {
  const content = (
    <div
      className="w-full flex items-center gap-6 p-8 border"
      style={{
        backgroundColor,
        borderColor,
        minHeight: '200px'
      }}
    >
      {image && (
        <div className="w-1/3 flex-shrink-0">
          <img
            src={image || "/placeholder.svg"}
            alt={title || 'Advertisement'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1" style={{ color: textColor }}>
        {title && <h3 className="text-xl font-bold tracking-widest mb-2">{title}</h3>}
        {description && <p className="text-sm leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  )

  return link ? <a href={link} className="block">{content}</a> : content
}
