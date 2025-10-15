'use client'

import QRCode from 'qrcode.react'

interface QRProps {
  value: string
  size?: number
  className?: string
}

export function QR({ value, size = 200, className = '' }: QRProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <QRCode
        value={value}
        size={size}
        level="M"
        includeMargin
        renderAs="svg"
        bgColor="#ffffff"
        fgColor="#111111"
      />
    </div>
  )
}
