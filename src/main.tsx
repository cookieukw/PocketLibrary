import ReactDOM from "react-dom/client";
import { setupIonicReact } from "@ionic/react";

import BookList from "./screens/BookList";
import Favorite from "./screens/Favorite";
import BookInfo from "./screens/BookInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
        <Routes>
            <Route path="*" element={<BookList />} />
            <Route path="/bookInfo/:bookId" element={<BookInfo />} />
            <Route path="/favorite" element={<Favorite />} />
        </Routes>
    </BrowserRouter>
);
