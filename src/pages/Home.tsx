import { IonPage, IonContent, IonCard, IonImg, IonIcon } from "@ionic/react";
import "../css/home.css";
import { useState, useEffect } from "react";
import { bag } from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { useIonToast } from "@ionic/react";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("Logged in user:", user);

  useEffect(() => {
    fetch("http://localhost/backend/fetchCategory.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/backend/fetchProducts.php?category_id=${selectedCategory}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Fetch products error:", err));
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
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

  return (
    <IonPage>
      <IonContent className="home-container">
        <div className="homeSubContainer">
          <div className="topNav">
            <div className="topNavImage"></div>
            <div className="midNav">
              <h1>Make home</h1>
              <h2>BEAUTIFUL</h2>
            </div>
            <div className="topNavImage"></div>
          </div>

          <div className="itemList">
            <div
              className="categoryWrapper"
              onClick={() => setSelectedCategory(0)}
            >
              <IonCard className="categoryContainer">
                <div className="categoryImageContainer">
                  <IonImg
                    src="/src/assets/icons/all.png"
                    className="categoryImage"
                  />
                </div>
              </IonCard>
              <p className="categoryTitle">All</p>
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                className="categoryWrapper"
                onClick={() => setSelectedCategory(category.id)}
              >
                <IonCard className="categoryContainer">
                  <div className="categoryImageContainer">
                    <IonImg
                      src={category.image}
                      alt={category.name}
                      className="categoryImage"
                    />
                  </div>
                </IonCard>
                <p className="categoryTitle">{category.name}</p>
              </div>
            ))}
          </div>

          <div className="productList">
            <div className="productWrapper">
              {products.length === 0 && <p>No products to show</p>}
              {products.map((product) => (
                <IonCard
                  key={product.id}
                  className="productCard"
                  onClick={() => {
                    router.push(`/product/${product.id}`, "forward", "push");
                  }}
                >
                  <div className="productImageWrapper">
                    <IonImg src={product.image} alt={product.name} />
                    <button
                      className="addToCartButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <IonIcon icon={bag} />
                    </button>
                  </div>
                  <h3 className="productName">{product.name}</h3>
                  <p className="productPrice">₱{product.price}</p>
                  <p className="productQuantity">{product.value} available</p>
                </IonCard>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
