"use client"

import { useRegistration } from "@/components/registration-context"
import { RegistrationModal } from "@/components/registration-modal"

export function ClientModalWrapper() {
  const { isModalOpen, closeModal } = useRegistration()

  return <RegistrationModal isOpen={isModalOpen} onClose={closeModal} />
}
