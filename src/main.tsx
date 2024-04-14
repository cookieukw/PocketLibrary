import ReactDOM from "react-dom/client";
import { setupIonicReact } from "@ionic/react";
import {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";

import BookList from "./screens/BookList";
import Favorite from "./screens/Favorite";
import BookInfo from "./screens/BookInfo";
import { heart, home } from "ionicons/icons";
import { SplashScreen } from "@capacitor/splash-screen";
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

setupIonicReact();
SplashScreen.hide();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // @ts-ignore
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/home" />

        <Route path="/home" render={() => <BookList />} exact={true} />
        <Route
          path="/bookInfo/:bookId"
          render={() => <BookInfo />}
          exact={true}
        />
        <Route path="/favorite" render={() => <Favorite />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>Início</IonLabel>
        </IonTabButton>

        <IonTabButton tab="favorite" href="/favorite">
          <IonIcon icon={heart} />
          <IonLabel>Favoritos</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
);