'use client'

import { ReactNode } from 'react'

interface AdBannerProps {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderPosition?: 'top' | 'bottom' | 'both' | 'none'
  children: ReactNode
}

export function AdBanner({
  backgroundColor = '#d4af37',
  textColor = '#0a0a0a',
  borderColor = '#b8942f',
  borderPosition = 'both',
  children
}: AdBannerProps) {
  const borderClasses = {
    top: 'border-t',
    bottom: 'border-b',
    both: 'border-y',
    none: ''
  }

  return (
    <div
      className={`w-full px-6 py-4 ${borderClasses[borderPosition]}`}
      style={{
        backgroundColor,
        color: textColor,
        borderColor,
      }}
    >
      {children}
    </div>
  )
}
