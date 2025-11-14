'use client'

import { ReactNode } from 'react'

interface SingleAdProps {
  image?: string
  link?: string
  backgroundColor?: string
  borderColor?: string
  height?: string
  width?: string
  children?: ReactNode
}

export function SingleAd({
  image,
  link,
  backgroundColor = '#1a1a1a',
  borderColor = '#2a2a2a',
  height = 'h-96',
  width = 'w-full',
  children
}: SingleAdProps) {
  const content = (
    <div
      className={`${width} ${height} border relative flex items-end justify-center`}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      {image && (
        <img
          src={image || "/placeholder.svg"}
          alt="Advertisement"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black-primary/80 to-transparent flex items-end justify-center pb-8">
        {children}
      </div>
    </div>
  )

  return link ? <a href={link} className="block">{content}</a> : content
}
