import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonListHeader,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import type { ToggleCustomEvent } from '@ionic/react';
const Config:React.FC= ()=> {
   const [paletteToggle, setPaletteToggle] = useState(false);

   const toggleChange = (ev: ToggleCustomEvent) => {
     toggleDarkPalette(ev.detail.checked);
   };

   // Add or remove the "ion-palette-dark" class on the html element
   const toggleDarkPalette = (shouldAdd: boolean) => {
     document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
   };

   // Check/uncheck the toggle and update the palette based on isDark
   const initializeDarkPalette = (isDark: boolean) => {
     setPaletteToggle(isDark);
     toggleDarkPalette(isDark);
   };

   useEffect(() => {
     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

     initializeDarkPalette(prefersDark.matches);

     const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
       initializeDarkPalette(mediaQuery.matches);
     };

     prefersDark.addEventListener("change", setDarkPaletteFromMediaQuery);

     return () => {
       prefersDark.removeEventListener("change", setDarkPaletteFromMediaQuery);
     };
   }, []);

  return (
    <IonContent>
      <IonHeader class="ion-no-border">
        <IonToolbar
          style={{
            "--color": "white",
            "--background": "#a11b3a",
          }}
        >
          <IonTitle>Display</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonListHeader>Aparência</IonListHeader>
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
  );
}
export default Config;
