import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import { home, cart, person, bag } from "ionicons/icons";

import "./theme/variables.css";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import { useLocation } from "react-router-dom";

import "./css/app.css";

setupIonicReact();

const App: React.FC = () => {
  const location = useLocation();

  const noTabsRoutes = ["/login", "/register"];

  const showTabs = !noTabsRoutes.includes(location.pathname);
  return (
    <IonApp>
      <IonRouterOutlet id="main">
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
      </IonRouterOutlet>

      {showTabs && (
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={Home} exact />
            <Route path="/cart" component={Cart} exact />
            <Route path="/checkout" component={Checkout} exact />
            <Route path="/profile" component={Profile} exact />
            <Route path="/product/:id" component={ProductDetails} exact />
            <Route path="/my-orders" component={MyOrders} exact />
            <Redirect exact from="/" to="/login" />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="cart" href="/cart">
              <IonIcon icon={cart} />
              <IonLabel>Cart</IonLabel>
            </IonTabButton>

            <IonTabButton tab="checkout" href="/checkout">
              <IonIcon icon={bag} />
              <IonLabel>Checkout</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}
    </IonApp>
  );
};

export default () => (
  <IonReactRouter>
    <App />
  </IonReactRouter>
);
