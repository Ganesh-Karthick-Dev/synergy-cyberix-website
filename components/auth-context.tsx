"use client"
import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLoginModalOpen: boolean
  isRegisterModalOpen: boolean
  openLoginModal: () => void
  openRegisterModal: () => void
  closeLoginModal: () => void
  closeRegisterModal: () => void
  switchToRegister: () => void
  switchToLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }
  
  const openRegisterModal = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }
  
  const closeLoginModal = () => setIsLoginModalOpen(false)
  const closeRegisterModal = () => setIsRegisterModalOpen(false)
  
  const switchToRegister = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }
  
  const switchToLogin = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  return (
    <AuthContext.Provider value={{
      isLoginModalOpen,
      isRegisterModalOpen,
      openLoginModal,
      openRegisterModal,
      closeLoginModal,
      closeRegisterModal,
      switchToRegister,
      switchToLogin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

