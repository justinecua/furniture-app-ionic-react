import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonImg,
  IonInput,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { chevronBack, closeCircle, add, remove } from "ionicons/icons";
import "../css/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchCartItems = () => {
    if (!user?.id) return;

    fetch(`http://localhost/backend/fetchCart.php?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  };

  useIonViewWillEnter(() => {
    fetchCartItems();
  });

  const removeItem = (cart_id: number) => {
    fetch(`http://localhost/backend/removeFromCart.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchCartItems();
        } else {
          console.error("Failed to remove item:", data.message);
        }
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const totalValue = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const updateQuantity = (
    cart_id: number,
    currentQty: number,
    delta: number,
  ) => {
    const newQuantity = currentQty + delta;

    if (newQuantity < 1) {
      removeItem(cart_id);
      return;
    }

    fetch(`http://localhost/backend/updateCartQuantity.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_id, quantity: newQuantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchCartItems();
        } else {
          console.error("Failed to update quantity:", data.message);
        }
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/home">
            <IonIcon icon={chevronBack} />
          </IonButton>
          <IonTitle>My Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">No items in cart</div>
        ) : (
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="cart-item">
                <div className="imageItemContainer">
                  <div className="image-wrapper">
                    <IonImg
                      src={item.image}
                      alt={item.name}
                      className="item-img"
                    />
                  </div>
                </div>

                <div className="item-details">
                  <div className="item-name">
                    {item.name}{" "}
                    <div
                      className="remove-btn"
                      onClick={() => removeItem(item.cart_id)}
                    >
                      <h2 className="removeIcon">X</h2>
                    </div>
                  </div>
                  <div className="item-quantity">
                    <div
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.cart_id, item.quantity, -1)
                      }
                    >
                      <h2 className="minusIcon">-</h2>
                    </div>
                    <span>{item.quantity}</span>

                    <div>
                      <div
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity, 1)
                        }
                      >
                        <h2 className="plusIcon">+</h2>
                      </div>
                    </div>
                    <div className="item-price">₱{item.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="total-row">
            <span className="totalTitle">Total</span>
            <span className="totalTitle">₱{totalValue.toFixed(2)}</span>
          </div>
          <IonButton
            expand="block"
            className="checkout-btn"
            routerLink="/checkout"
          >
            CHECK OUT
          </IonButton>
        </div>
      )}
    </IonPage>
  );
};

export default Cart;
