"use client"

import { useRouter } from "next/navigation"
import styles from "./AlertModal.module.css"

const AlertModal = ({ isOpen, message, type, onClose, redirectUrl }) => {
  const router = useRouter()

  if (!isOpen) return null

  const handleAccept = () => {
    onClose()
    if (redirectUrl && type === "success") {
      router.push(redirectUrl)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.modalContent} ${styles[type]}`}>
          <h2>{type === "success" ? "¡Éxito!" : "Error"}</h2>
          <p>{message}</p>
          <button className={styles.acceptButton} onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertModal
