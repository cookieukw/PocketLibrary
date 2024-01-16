import React from "react";
import { IonSelect, IonSelectOption, IonLabel, IonItem } from "@ionic/react";

interface ILanguageSelectionProps {
  language: number;
  setLanguage: React.Dispatch<React.SetStateAction<number>>;
  onLanguageChange: (value: number) => void;
}
const languageOptions = [
  { value: 11, label: "Alemão" },
  { value: 18, label: "Dinamarquês" },
  { value: 7, label: "Espanhol" },
  { value: 12, label: "Esperanto" },
  { value: 19, label: "Finlandês" },
  { value: 10, label: "Francês" },
  { value: 8, label: "Galego" },
  { value: 17, label: "Holandês" },
  { value: 2, label: "Inglês" },
  { value: 15, label: "Italiano" },
  { value: 9, label: "Latim" },
  { value: 14, label: "Norueguês" },
  { value: 5, label: "Não Aplicável" },
  { value: 1, label: "Português" },
  { value: 16, label: "Russo" },
  { value: 13, label: "Sueco" },
  { value: 21, label: "Sânscrito" },
];
const LanguageSelection: React.FC<ILanguageSelectionProps> = ({
  language,
  setLanguage,
  onLanguageChange,
}) => {
  return (

      <IonSelect
        value={language}
        placeholder="Escolha o idioma"
        onIonChange={(e: any) => {
          onLanguageChange(parseInt(e.detail.value));
          setLanguage(parseInt(e.detail.value));
        }}
      >
        {languageOptions.map((option) => (
          <IonSelectOption key={option.value} value={option.value}>
            {option.label}
          </IonSelectOption>
        ))}
      </IonSelect>
  );
};

export default LanguageSelection;
