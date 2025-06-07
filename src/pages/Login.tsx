import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
} from "@ionic/react";

import "../css/login.css";

const Login: React.FC = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost/backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/home", "forward");
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
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
            <h1>Hello!</h1>
            <h2>WELCOME BACK</h2>

            {error && <IonText color="danger">{error}</IonText>}
            {success && <IonText color="success">{success}</IonText>}

            <IonItem className="input-item">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem className="input-item">
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <div className="forgotPassword-container">Forgot Password</div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing In..." : "SIGN IN"}
            </IonButton>

            <IonButton
              expand="block"
              className="signUp-button"
              routerLink="/register"
            >
              SIGN UP
            </IonButton>
          </div>

          <div></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
