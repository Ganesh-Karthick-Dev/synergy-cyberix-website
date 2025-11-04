import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AdBanner } from '@/components/ad-banner'
import { RegistrationProvider } from '@/components/registration-context'
import { AuthProvider } from '@/components/auth-context'
import { ClientModalWrapper } from '@/components/client-modal-wrapper'
import { QueryProvider } from '@/components/query-provider'
import { LoginModal } from '@/components/login-modal'
import { RegisterModal } from '@/components/register-modal'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cyberix - Advanced Cybersecurity Solutions',
  description: 'Professional cybersecurity services with AI-driven threat detection and automated response systems. Secure your business with enterprise-grade security solutions.',
  generator: 'Cyberix Security Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          <RegistrationProvider>
            <AuthProvider>
              <AdBanner />
              {children}
              <ClientModalWrapper />
              <LoginModal />
              <RegisterModal />
            </AuthProvider>
          </RegistrationProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
