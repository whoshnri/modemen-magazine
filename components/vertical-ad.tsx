'use client'

import { ReactNode } from 'react'

interface VerticalAdProps {
  title?: string
  description?: string
  image?: string
  link?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  width?: string
  children?: ReactNode
}

export function VerticalAd({
  title,
  description,
  image,
  link,
  backgroundColor = '#1a1a1a',
  textColor = '#f5f5f5',
  borderColor = '#2a2a2a',
  width = 'w-64',
  children
}: VerticalAdProps) {
  const content = (
    <div
      className={`${width} flex flex-col border`}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      {image && (
        <div className="w-full h-64">
          <img
            src={image || "/placeholder.svg"}
            alt={title || 'Advertisement'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col" style={{ color: textColor }}>
        {title && <h3 className="text-lg font-bold tracking-widest mb-2">{title}</h3>}
        {description && <p className="text-xs leading-relaxed mb-4">{description}</p>}
        {children}
      </div>
    </div>
  )

  return link ? <a href={link} className="block">{content}</a> : content
}
