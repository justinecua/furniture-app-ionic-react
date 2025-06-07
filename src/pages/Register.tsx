import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonRouterLink,
  IonText,
  useIonRouter,
} from "@ionic/react";
import "../css/register.css";

const Register: React.FC = () => {
  const router = useIonRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost/backend/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/home", "forward");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-container">
          <div className="LogoContainer">
            <div className="BorderLeft"></div>
            <div className="AppLogo">
              <img src="/src/assets/icons/logo.png" alt="Logo" />
            </div>
            <div className="BorderRight"></div>
          </div>

          <div>
            <h2>WELCOME</h2>

            {error && <IonText color="danger">{error}</IonText>}
            {success && <IonText color="success">{success}</IonText>}

            <IonItem className="input-item">
              <IonLabel position="stacked" htmlFor="username">
                Username
              </IonLabel>
              <IonInput
                id="username"
                value={username}
                onIonChange={(e) => setUsername(e.detail.value!)}
                type="text"
                required
              />
            </IonItem>

            <IonItem className="input-item">
              <IonLabel position="stacked" htmlFor="email">
                Email
              </IonLabel>
              <IonInput
                id="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                type="email"
                required
              />
            </IonItem>

            <IonItem className="input-item">
              <IonLabel position="stacked" htmlFor="password">
                Password
              </IonLabel>
              <IonInput
                id="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                type="password"
                required
              />
            </IonItem>

            <IonItem className="input-item">
              <IonLabel position="stacked" htmlFor="confirmPassword">
                Confirm Password
              </IonLabel>
              <IonInput
                id="confirmPassword"
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                type="password"
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </IonButton>

            <div className="backToLoginContainer">
              <span className="info-text">Already have an account? </span>
              <IonRouterLink className="highlight-text" routerLink="/login">
                SIGN IN
              </IonRouterLink>
            </div>
          </div>
          <div></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
