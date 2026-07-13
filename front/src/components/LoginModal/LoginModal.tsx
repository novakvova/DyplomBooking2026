import { useEffect, useId, useRef, type FormEvent } from 'react'
import styles from './LoginModal.module.scss'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue?: (email: string) => void
  onGoogleLogin?: () => void
  onFacebookLogin?: () => void
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg
      className={styles.iconGoogle}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M29.6 16.2273C29.6 15.2182 29.5182 14.2455 29.3636 13.3091H16V18.835H23.5818C23.2273 20.5582 22.2182 22.0109 20.7273 22.9818V26.4727H25.2727C28.0727 23.9273 29.6 20.3636 29.6 16.2273Z"
        fill="#4285F4"
      />
      <path
        d="M16 30C19.74 30 22.8727 28.7636 25.2727 26.4727L20.7273 22.9818C19.3818 23.9273 17.6727 24.4909 16 24.4909C12.2909 24.4909 9.10909 22.1273 7.92727 18.8727H3.21818V22.4727C5.60909 27.0182 10.4364 30 16 30Z"
        fill="#34A853"
      />
      <path
        d="M7.92727 18.8727C7.61818 18.0182 7.45455 17.1091 7.45455 16.1818C7.45455 15.2545 7.61818 14.3455 7.92727 13.4909V9.89091H3.21818C2.21818 11.8545 1.63636 14.0727 1.63636 16.3636C1.63636 18.6545 2.21818 20.8727 3.21818 22.8364L7.92727 18.8727Z"
        fill="#FBBC05"
      />
      <path
        d="M16 7.85455C17.8545 7.85455 19.5273 8.50909 20.8364 9.76364L24.7273 5.87273C22.8636 4.14545 20.5818 3.18182 16 3.18182C10.4364 3.18182 5.60909 6.16364 3.21818 10.7091L7.92727 14.3091C9.10909 11.0545 12.2909 8.69091 16 8.69091V7.85455Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      className={styles.iconFacebook}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.5 3.5C9.768 3.5 3.5 9.768 3.5 17.5C3.5 24.395 8.575 30.135 15.3125 31.2375V21.4375H11.8125V17.5H15.3125V14.4375C15.3125 10.9875 17.4625 9.0125 20.5625 9.0125C22.05 9.0125 23.625 9.275 23.625 9.275V12.6875H21.875C20.1625 12.6875 19.6875 13.7375 19.6875 14.8125V17.5H23.4062L22.8375 21.4375H19.6875V31.2375C26.425 30.135 31.5 24.395 31.5 17.5C31.5 9.768 25.232 3.5 17.5 3.5Z"
        fill="#1877F2"
      />
      <path
        d="M22.8375 21.4375L23.4062 17.5H19.6875V14.8125C19.6875 13.7375 20.1625 12.6875 21.875 12.6875H23.625V9.275C23.625 9.275 22.05 9.0125 20.5625 9.0125C17.4625 9.0125 15.3125 10.9875 15.3125 14.4375V17.5H11.8125V21.4375H15.3125V31.2375C16.0417 31.1625 16.7708 31.0625 17.5 31.0625C18.2292 31.0625 18.9583 31.1625 19.6875 31.2375V21.4375H22.8375Z"
        fill="white"
      />
    </svg>
  )
}

export function LoginModal({
  isOpen,
  onClose,
  onContinue,
  onGoogleLogin,
  onFacebookLogin,
}: LoginModalProps) {
  const titleId = useId()
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    emailInputRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = emailInputRef.current?.value.trim() ?? ''
    if (email) {
      onContinue?.(email)
    }
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрити"
        >
          <CloseIcon />
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              Увійти або зареєструватися
            </h2>
            <p className={styles.subtitle}>
              Створіть акаунт або увійдіть у профіль, щоб отримати доступ до
              затишних пропозицій.
            </p>
          </div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              className={styles.socialButton}
              onClick={onGoogleLogin}
            >
              <GoogleIcon />
              Увійти за допомогою Google
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={onFacebookLogin}
            >
              <FacebookIcon />
              Увійти за допомогою Facebook
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.divider}>
              <span className={styles.dividerLine} aria-hidden="true" />
              <span className={styles.dividerText}>або</span>
              <span className={styles.dividerLine} aria-hidden="true" />
            </div>

            <input
              ref={emailInputRef}
              type="email"
              name="email"
              className={styles.emailInput}
              placeholder="Електронна пошта"
              autoComplete="email"
              required
            />

            <button type="submit" className={styles.continueButton}>
              Продовжити
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
