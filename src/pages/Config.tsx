import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import type { ToggleCustomEvent } from "@ionic/react";
const Config: React.FC = () => {
  const [paletteToggle, setPaletteToggle] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    if (shouldAdd) {
      localStorage.setItem("darkMode", "true");
    } else {
      localStorage.removeItem("darkMode");
    }
  };
  toggleDarkPalette(paletteToggle);
  const toggleChange = (ev: ToggleCustomEvent) => {
    toggleDarkPalette(ev.detail.checked);
    setPaletteToggle(ev.detail.checked);
  };

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      toggleDarkPalette(mediaQuery.matches);
      setPaletteToggle(mediaQuery.matches);
    };

    prefersDark.addEventListener("change", setDarkPaletteFromMediaQuery);

    return () => {
      prefersDark.removeEventListener("change", setDarkPaletteFromMediaQuery);
    };
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonHeader class="ion-no-border">
          <IonToolbar>
            <IonTitle>Display</IonTitle>
          </IonToolbar>
        </IonHeader>

      
        <IonList inset={true}>
          <IonItem>
            <IonToggle
              checked={paletteToggle}
              onIonChange={toggleChange}
              justify="space-between"
            >
              Modo escuro
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default Config;
