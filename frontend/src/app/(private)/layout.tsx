'use client'

import { ReactNode } from 'react'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
