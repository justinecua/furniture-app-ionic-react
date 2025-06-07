import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonItem,
	IonLabel,
	IonToast,
	useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import "../css/profile.css";

const Profile = () => {
	  const router = useIonRouter();
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const [showToast, setShowToast] = useState(false);
	const handleLogout = async () => {
		try {
			await fetch("http://localhost/backend/logout.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: user.email }), // optional
			});
		} catch (err) {
			console.error("Logout failed:", err);
		}

		localStorage.removeItem("user");
		setShowToast(true);
		setTimeout(() => {
			router.push("/login", "forward");
		}, 1000);
	};
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Profile</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="profileContainer">
					<div className="profileContent">
						<div className="profileLeft">
							<div className="profileCircle">
								<img src="/src/assets/icons/profile.png" alt="Profile" />
							</div>
						</div>
						<div className="profileRight">
							<h2>Username: {user.username}</h2>
							<h3>Email: {user.email}</h3>
						</div>
					</div>

					<div className="MyOrdersContainer">
						<IonItem routerLink="/my-orders" className="OrdersContainer">
							<div className="OrdersContent">
								<h2>My Orders</h2>
								<p>Click me to view your orders</p>
							</div>
						</IonItem>
					</div>

					<div className="MyOrdersContainer" onClick={handleLogout}>
						<h3>Logout</h3>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Profile;
