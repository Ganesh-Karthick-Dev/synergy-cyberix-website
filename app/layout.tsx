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
import { ScrollToTop } from '@/components/scroll-to-top'
import { Chatbot } from '@/components/chatbot'
import { AuthRedirectHandler } from '@/components/auth-redirect-handler'
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
              <AuthRedirectHandler />
              <AdBanner />
              {children}
              <ClientModalWrapper />
              <LoginModal />
              <RegisterModal />
              <ScrollToTop />
              <Chatbot />
            </AuthProvider>
          </RegistrationProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
