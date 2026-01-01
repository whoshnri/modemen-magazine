'use client'

import { ReactNode } from 'react'

interface HorizontalAdProps {
  title?: string
  description?: string
  image?: string
  link?: string
  banner?: boolean
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
  banner,
  backgroundColor = '#1a1a1a',
  textColor = '#f5f5f5',
  borderColor = '#2a2a2a',
  children,
}: HorizontalAdProps) {
  const content = (
    <div
      className={`flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 p-4 border w-full max-w-xl mx-auto mb-12 relative`}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      {/* Image - Left */}
      {image && (
        <div className="w-full sm:w-1/3 h-auto shrink-0 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title || 'Advertisement'}
            className="w-full h-full aspect-square object-cover"
          />
        </div>
      )}

      {/* Text - Right */}
      <div className="flex-1 flex flex-col justify-center" style={{ color: textColor }}>
        {title && (
          <h3 className="text-lg sm:text-xl font-bold text-gold-primary tracking-widest mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>

      <span className='absolute right-0 bottom-0 w-fit h-fit bg-amber-50/30 text-black z-10 px-4 text-xs'>
        Advertisement
      </span>
    </div>
  )

  return link ? (
    <a href={link} className="block hover:opacity-90 transition-opacity" target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : content
}
