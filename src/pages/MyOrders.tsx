import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import "../css/myOrder.css";

type OrderItem = {
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total_amount: string;
  order_date: string;
  shipping_address: string;
  card_number: string;
  items: OrderItem[];
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost/backend/fetchOrdersByUser.php?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setOrders(data);
      })
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <IonText className="ion-padding">Loading orders...</IonText>
        ) : orders.length === 0 ? (
          <IonText className="ion-padding">You have no orders yet.</IonText>
        ) : (
          orders.map((order) => (
            <IonCard key={order.id} className="order-card">
              <IonCardHeader>
                <IonCardTitle className="title">Order #{order.id}</IonCardTitle>
                <IonCardSubtitle>
                  Total: ₱{order.total_amount} | Date:{" "}
                  {new Date(order.order_date).toLocaleString()}
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <div className="order-info">
                  <p>
                    <strong>Shipping Address:</strong> {order.shipping_address}
                  </p>
                  <p>
                    <strong>Card: </strong>
                    {order.card_number}
                  </p>
                </div>
                <IonList className="order-items">
                  {order.items.map((item, idx) => (
                    <IonItem key={idx} lines="none">
                      <IonImg
                        src={item.image}
                        alt={item.name}
                        className="item-img"
                      />
                      <IonLabel>
                        <h2>{item.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₱{item.price}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyOrders;
