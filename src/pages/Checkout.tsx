import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonToast,
  IonText,
  IonIcon,
} from "@ionic/react";
import { useState } from "react";
import "../css/checkout.css";
import { chevronBack } from "ionicons/icons";

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    console.error("Invalid user data in localStorage");
  }
  const user_id = (user as any).id;

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !cardNumber) {
      setToastMessage("Please fill all fields");
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/submitOrder.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, cardNumber, user_id }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setToastMessage("Order placed successfully!");
        setShippingAddress("");
        setCardNumber("");
      } else {
        setToastMessage("Order failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      setToastMessage("Network error or server issue.");
    } finally {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/cart">
            <IonIcon icon={chevronBack} />
          </IonButton>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding checkout-content">
        <div className="checkout-card">
          <IonText className="checkout-title">Complete Your Order</IonText>

          <div className="checkoutContainer">
            <IonItem lines="full" className="checkout-input">
              <IonLabel position="stacked">Shipping Address</IonLabel>
              <IonInput
                value={shippingAddress}
                onIonChange={(e) => setShippingAddress(e.detail.value!)}
                placeholder="Enter your shipping address"
                autocomplete="shipping street-address"
              />
            </IonItem>

            <IonItem lines="full" className="checkout-input">
              <IonLabel position="stacked">Card Number</IonLabel>
              <IonInput
                type="tel"
                value={cardNumber}
                onIonChange={(e) => setCardNumber(e.detail.value!)}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                maxlength={19}
                autocomplete="cc-number"
                inputMode="numeric"
              />
            </IonItem>

            <IonButton
              expand="block"
              className="checkout-button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          position="bottom"
          color={toastMessage.includes("success") ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
};

export default Checkout;
