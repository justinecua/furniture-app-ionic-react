import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonImg,
	IonButton,
	IonIcon,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/productDetails.css";
import { chevronBack } from "ionicons/icons";
import { useIonToast } from "@ionic/react";

type Product = {
	id: number;
	name: string;
	image: string;
	details: string;
	rating: number;
	price: number;
	value: number;
};

const ProductDetails = () => {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [presentToast] = useIonToast();
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleAddToCart = (product: Product) => {
		if (!user?.id) {
			presentToast({
				message: "Please log in to add to cart.",
				duration: 2000,
				position: "bottom",
				color: "warning",
			});
			return;
		}

		fetch("http://localhost/backend/addToCart.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: user.id,
				product_id: product.id,
				quantity: 1,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message) {
					presentToast({
						message: "Added to cart!",
						duration: 2000,
						position: "bottom",
						cssClass: "custom-toast",
					});
				} else if (data.error) {
					presentToast({
						message: "Error: " + data.error,
						duration: 2000,
						position: "bottom",
						color: "danger",
					});
				}
			})
			.catch((err) => {
				console.error("Add to cart error:", err);
				presentToast({
					message: "Something went wrong.",
					duration: 2000,
					position: "bottom",
					color: "danger",
				});
			});
	};

	useEffect(() => {
		fetch(`http://localhost/backend/fetchProductById.php?id=${id}`)
			.then((res) => res.json())
			.then((data) => setProduct(data))
			.catch((err) => console.error("Fetch product error:", err));
	}, [id]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButton slot="start" fill="clear" routerLink="/home">
						<IonIcon icon={chevronBack} />
					</IonButton>
					<IonTitle>{product?.name || "Loading..."}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen className="product-details-content">
				{!product ? (
					<div style={{ padding: "1rem", textAlign: "center" }}>
						Loading product...
					</div>
				) : (
					<div className="productContainer">
						<div className="product-image-wrapper">
							<IonImg
								src={product.image}
								alt={product.name}
								className="product-image"
							/>
						</div>
						<div className="product-info">
							<h2 className="product-title">{product.name}</h2>
							<p className="product-description">{product.details}</p>
							<p className="product-rating">⭐ {product.rating}</p>
							<p className="product-price">₱{product.price}</p>
							<p className="product-quantity">Available: {product.value}</p>
							<IonButton
								expand="block"
								className="AddToCartButton"
								onClick={() => handleAddToCart(product)}
							>
								Add to Cart
							</IonButton>
						</div>
					</div>
				)}
			</IonContent>
		</IonPage>
	);
};

export default ProductDetails;
