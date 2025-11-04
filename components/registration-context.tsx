"use client"
import { createContext, useContext, useState, ReactNode } from 'react'

interface RegistrationContextType {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <RegistrationContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return context
}
