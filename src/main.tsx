import ReactDOM from "react-dom/client";
import { IonApp, setupIonicReact } from "@ionic/react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";
import "./main.css";
import BookList from "./pages/BookList";
import Favorite from "./pages/Favorite";
import BookInfo from "./pages/BookInfo";
import { heart, home, constructOutline } from "ionicons/icons";
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
import Config from "./pages/Config";
import "@ionic/react/css/palettes/dark.class.css";
setupIonicReact();
SplashScreen.hide();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

 //@ts-ignore
    <IonReactRouter>
       <IonApp>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          <Route path="/home" render={() => <BookList />} />
          <Route path="/bookInfo/:bookId" render={() => <BookInfo />} />
          <Route path="/favorite" render={() => <Favorite />} />
          <Route path="/options" render={() => <Config />} />
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

          <IonTabButton tab="options" href="/options">
            <IonIcon icon={constructOutline} />
            <IonLabel>Configurações</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs></IonApp>
    </IonReactRouter>
);
