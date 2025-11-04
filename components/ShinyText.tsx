"use client"

import React from 'react'

interface ShinyTextProps {
  text?: string
  disabled?: boolean
  speed?: number
  className?: string
  children?: React.ReactNode
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className,
  children,
}: ShinyTextProps) {
  const content = text ?? children
  return (
    <span
      className={`shiny-text ${disabled ? 'shiny-disabled' : ''} ${className ?? ''}`}
      style={{
        // @ts-expect-error CSS var
        ['--shiny-duration']: `${Math.max(0.2, speed)}s`,
      }}
    >
      {content}
      <style jsx>{`
        .shiny-text {
          position: relative;
          display: inline-block;
          background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,1), rgba(255,255,255,0.6));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine var(--shiny-duration, 3s) linear infinite;
          white-space: nowrap;
        }

        .shiny-disabled {
          animation: none;
          background-position: 50% 0;
        }

        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  )
}


