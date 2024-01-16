import { IonSelect, IonSelectOption, IonLabel } from "@ionic/react";
import { Dispatch, SetStateAction, useState } from "react";

interface IMediaSelectionMenuProps {
  onMediaTypeChange: (selectedMediaType: number) => void;
  setSelectedMediaType: () =>void
  selectedMediaType: number;
}
const MediaSelectionMenu: React.FC<IMediaSelectionMenuProps> = ({
  onMediaTypeChange,
  setSelectedMediaType,
  selectedMediaType,
}) => {
  return (
    <IonSelect
      style={{ padding: "10px", margin: "0 0 0 20px" }}
      value={selectedMediaType}
      onIonChange={(e: any) => onMediaTypeChange(parseInt(e.detail.value, 2))}
    >
      <IonSelectOption value={5}>
        <IonLabel>Imagem</IonLabel>
      </IonSelectOption>
      <IonSelectOption value={3}>
        <IonLabel>Som</IonLabel>
      </IonSelectOption>
      <IonSelectOption value={2}>
        <IonLabel>Texto</IonLabel>
      </IonSelectOption>
      <IonSelectOption value={6}>
        <IonLabel>Vídeo</IonLabel>
      </IonSelectOption>
    </IonSelect>
  );
};

export default MediaSelectionMenu;
