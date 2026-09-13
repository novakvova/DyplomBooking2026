import React, { useState } from "react";

const LoginModal: React.FC = () => {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  if (step === 2) {
    return (
      <div style={styles.container}>
        <div style={styles.modalSecond}>
          
          {/* Back button */}
        <button style={styles.backButton} onClick={() => setStep(1)}>‹</button>
          {/* Title */}
        <h1 style={styles.titleSecond}>Створімо ваш акаунт</h1>
        <p style={styles.descriptionSecond}>
          Ця інформація необхідна, щоб приймати гостей
          <br />
          або робити бронювання.
        </p>

        {/* Name */}
        <label style={styles.label}>
          Ім’я згідно з документами
        </label>

        <input
          type="text"
          placeholder="Ім’я"
          style={styles.inputLeft}
        />
        <input
          type="text"
          placeholder="Прізвище"
          style={styles.inputLeft}
        />

        <p style={styles.smallText}>
          Переконайтеся, що зазначена інформація відповідає даним у вашому
          посвідченні особи державного зразка. Якщо ви хочете використовувати
          інше ім’я, то можете додати ім’я для звертання.
        </p>
        {/* Birthday */}
        <label style={styles.label}>
          Дата народження
        </label>

        <input
          type="text"
          placeholder="Виберіть дату"
          style={styles.inputLeft}
          value={displayDate}

          onFocus={(e) => {
            e.target.type = "date";
            e.target.value = birthDate;
            try {
                e.target.showPicker();
            } catch {
                console.log("Браузер не підтримує авто-відкриття");
            }
          }}
          onChange={(e) => {
              const rawDate = e.target.value;
              setBirthDate(rawDate);
              if (rawDate) {
                const [year, month, day] = rawDate.split("-");
                setDisplayDate(`${day}.${month}.${year}`);
              } else {
                setDisplayDate("");
              }
            }}

          onBlur={(e) => {
            if(!e.target.value) {
                e.target.type = "text";
            }
          }}
        />

        {/* Email */}
        <label style={styles.label}>
          Електронна адреса
        </label>

        <input
          type="email"
          placeholder="Електронна адреса"
          style={styles.inputLeft}
        />

        <p style={styles.smallText}>
          Ми надішлемо вам електронною поштою підтвердження
          <br />
          подорожі і квитанції.
        </p>
        <p style={styles.googleText}>
          Усю попередньо заповнену інформацію отримано від Google.
        </p>

        {/* Marketing block */}
        <div style={styles.marketingBox}>
          <p style={styles.marketingText}>
            WayGo надсилатиме вам рекламні матеріали, зокрема вигідні
            пропозиції та маркетингові сповіщення. Ви можете будь-коли
            відмовитися від розсилки в налаштуваннях акаунта або в самому
            маркетинговому електронному листі.
          </p>
          <label style={styles.checkboxRow}>
            <span>
              Я не хочу отримувати рекламні повідомлення від WayGo.
            </span>

            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              style={styles.checkbox}
            />
          </label>
        </div>

        {/* Terms */}
        <p style={styles.terms}>
          Натискаючи Погодитись і продовжити, я погоджуюсь з Умовами
          обслуговування, Умовами здійснення платежів, а також підтверджую
          ознайомлення з Політикою конфіденційності компанії WayGo.
        </p>

        {/* Continue */}
        <button style={styles.continueButton}>
          Погодитись і продовжити
        </button>

      </div>
    </div>
  );
}

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
        <button style={styles.googleButton} onClick={() => setStep(2)}>
          <img src="/images/icons/google.png" 
          alt="Google"
            style={styles.googleIcon}
          />
          <span>Увійти за допомогою Google</span>
        </button>

        {/* Facebook */}
        <button style={styles.facebookButton} onClick={() => setStep(2)}>
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
        <button style={styles.continueButton} onClick={() => setStep(2)}>
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
  modalSecond:{
    position: "relative",
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "18px",
    padding: "55px 35px 35px",
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
  backButton: {
    position: "absolute",
    top: "22px",
    left: "25px",
    border: "none",
    background: "transparent",
    fontSize: "40px",
    fontWeight: 300,
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
  titleSecond: {
    margin: "0 0 18px",
    fontSize: "32px",
    lineHeight: "1.2",
    fontWeight: 500,
    color: "#111",
  },

  /* Опис */
  description: {
    margin: "0 0 25px",
    fontSize: "15px",
    lineHeight: "1.45",
    color: "#666",
  },
  descriptionSecond: {
    margin: "0 0 25px",
    fontSize: "16px",
    lineHeight: "1.35",
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
  inputLeft: {
    width: "100%",
    height: "58px",
    boxSizing: "border-box",
    border: "1px solid #888",
    borderRadius: "12px",
    padding: "0 16px",
    fontSize: "16px",
    outline: "none",
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "17px",
    fontWeight: 600,
    color: "#222",
  },
  smallText: {
    margin: "0 0 25px",
    fontSize: "14px",
    lineHeight: "1.3",
    color: "#666",
  },

  googleText: {
    margin: "5px 0 18px",
    fontSize: "14px",
    color: "#555",
  },

  marketingBox: {
    background: "#e5f1e9",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
  },
  marketingText: {
    margin: "0 0 15px",
    fontSize: "14px",
    lineHeight: "1.35",
    color: "#555",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    fontSize: "14px",
    color: "#555",
  },

  checkbox: {
    width: "25px",
    height: "25px",
    cursor: "pointer",
    flexShrink: 0,
  },

  terms: {
    margin: "0 0 20px",
    fontSize: "14px",
    lineHeight: "1.4",
    color: "#555",
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