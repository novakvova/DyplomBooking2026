import React, { useState } from "react";

const LoginModal: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <div style={styles.container}>
      <div style={styles.modal}>

        {/* Close */}
        <button style={styles.closeButton}>×</button>

        {/* Title */}
        <h1 style={styles.title}>
          Увійти або
          <br />
          зареєструватися
        </h1>

        {/* Description */}
        <p style={styles.description}>
          Створіть акаунт або увійдіть у профіль, щоб отримати доступ
          <br />
          до затишних пропозицій.
        </p>

        {/* Google */}
        <button style={styles.googleButton}>
          <img src="/images/icons/google.png" 
          alt="Google"
            style={styles.googleIcon}
          />
          <span>Увійти за допомогою Google</span>
        </button>

        {/* Facebook */}
        <button style={styles.facebookButton}>
          <img src="/images/icons/facebook.png" 
          alt="Facebook"
            style={styles.facebookIcon}
          />
          <span>Увійти за допомогою Facebook</span>
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.line} />
          <span>або</span>
          <div style={styles.line} />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* Continue */}
        <button style={styles.continueButton}>
          Продовжити
        </button>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  /* Центрування */
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  /* Вікно */
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "50px 35px 35px",
    boxSizing: "border-box",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  },

  /* Хрестик */
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "25px",
    border: "none",
    background: "transparent",
    fontSize: "38px",
    fontWeight: 200,
    color: "#777",
    cursor: "pointer",
    lineHeight: 1,
  },

  /* Заголовок */
  title: {
    margin: "0 0 30px",
    fontSize: "32px",
    lineHeight: "1.2",
    fontWeight: 500,
    color: "#111",
    letterSpacing: "-0.5px",
  },

  /* Опис */
  description: {
    margin: "0 0 25px",
    fontSize: "15px",
    lineHeight: "1.45",
    color: "#666",
  },

  /* Google / Facebook */
  /* Кнопка Google*/
  googleButton: {
    width: "100%",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "38px",
    background: "#fff",
    border: "1px solid #777",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#444",
    cursor: "pointer",
    marginBottom: "14px",
  },

  /* Кнопка Facebook*/
  facebookButton: {
    width: "100%",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    background: "#fff",
    border: "1px solid #777",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#444",
    cursor: "pointer",
    marginBottom: "14px",
  },

  /* Або */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    margin: "25px 0",
    color: "#666",
    fontSize: "15px",
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#aaa",
  },

  /* Email */
  input: {
    width: "100%",
    height: "58px",
    boxSizing: "border-box",
    border: "1px solid #777",
    borderRadius: "12px",
    padding: "0 18px",
    fontSize: "16px",
    outline: "none",
    marginBottom: "15px",
    textAlign: "center" as const,
  },

  /* Продовжити */
  continueButton: {
    width: "100%",
    height: "58px",
    border: "none",
    borderRadius: "12px",
    background: "#355872",
    color: "#fff",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default LoginModal;