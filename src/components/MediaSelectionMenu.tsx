import { IonSelect, IonSelectOption, IonLabel } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";

interface IMediaSelectionMenuProps {
  onMediaTypeChange: (selectedMediaType: number) => void;
  setSelectedMediaType: Dispatch<SetStateAction<number>>;
  selectedMediaType: number;
}
const MediaSelectionMenu: React.FC<IMediaSelectionMenuProps> = ({
  onMediaTypeChange,
  setSelectedMediaType,
  selectedMediaType,
}) => {
  return (
    <IonSelect
      value={selectedMediaType}
      onIonChange={(e: any) => {
        setSelectedMediaType(e.detail.value)
        onMediaTypeChange(parseInt(e.detail.value))

      }}
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
