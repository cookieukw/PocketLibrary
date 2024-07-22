import { useEffect, useState } from "react";
import {
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  useIonViewWillEnter,
  IonText,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonModal,
  IonContent,
} from "@ionic/react";
import { useHistory } from "react-router";
import { motion } from "framer-motion";
import { getIcon, toCamelCase } from "../classes/util";

import { heartOutline, heart, informationCircleOutline } from "ionicons/icons";
import database from "../classes/database";

interface IBook {
  title: string;
  author: string;
  font: string;
  size: string;
  sizeByBytes: string;
  format: string;
  link: string;
  bookId: string;
}

interface BookItemProps {
  book: IBook;
  onDelete?: () => void;
  favorite?: boolean;
}

const BookItem: React.FC<BookItemProps> = ({ book, favorite }) => {
  const { title, author, font, size, format, link, bookId } = book;
  const navigate = useHistory().push;
  const [isFavorite, setIsFavorite] = useState(favorite ?? false);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const toggleFavorite = async () => {
    if (isFavorite) {
      await database.favorites.where("bookId").equals(bookId).delete();
    } else {
      await database.favorites.add(book);
    }
    setIsFavorite(!isFavorite);
  };

  const checkIfFavorite = async () => {
    try {
      const existingBook = await database.favorites
        .where("bookId")
        .equals(bookId)
        .first();
      if (existingBook) {
        setIsFavorite(true);
      }
    } catch (error) {
      setIsFavorite(false);

      console.error("Error checking if book is favorite:", error);
    }
  };

  useIonViewWillEnter(() => {
    {
      (async () => {
        await checkIfFavorite();
      })();
    }
  });

  useEffect(() => {
    (async () => {
      await checkIfFavorite();
    })();
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <IonItem
        key={bookId}
        style={{
          marginBottom: "15px",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <IonIcon
          style={{
            height: "60px",
            width: "60px",
            margin: "10px",
            border: "1px solid",
            borderRadius: "8px",
            padding: "10px",
          }}
          icon={getIcon(format.substring(1))}
        />
        <IonLabel style={{ marginLeft: "10px" }}>
          <IonText
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: "18px",
            }}
          >
            {title}
          </IonText>
          <IonText style={{ display: "block", marginTop: "5px" }}>
            <strong>Autor: </strong> {toCamelCase(author)}
          </IonText>
          <IonText style={{ display: "block", marginTop: "5px" }}>
            <strong>Formato: </strong> {format.substring(1).toUpperCase()}
          </IonText>
        </IonLabel>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <IonButton fill="clear" onClick={toggleFavorite}>
            <IonIcon
              icon={isFavorite ? heart : heartOutline}
              style={{ fontSize: "24px", color: isFavorite ? "red" : "grey" }}
            />
          </IonButton>
          <IonButton fill="clear" onClick={() => setShowModal(true)}>
            <IonIcon
              icon={informationCircleOutline}
              style={{ fontSize: "24px" }}
            />
          </IonButton>
          <IonButton onClick={() => navigate(`/bookInfo/${bookId}`, { book })}>
            Ler
          </IonButton>
        </div>
      </IonItem>

      <IonModal
        style={{ height: "auto" }}
        isOpen={showModal}
        onDidDismiss={closeModal}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Informações do Livro</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>Fechar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div
            style={{
              padding: "16px",
              //alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <IonText
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <strong>Título:</strong> {title}
            </IonText>
            <IonText>
              <strong>Autor:</strong> {toCamelCase(author)}
            </IonText>
            <IonText>
              <strong>Fonte:</strong>{" "}
              {font.charAt(0).toUpperCase() + font.slice(1)}
            </IonText>
            <IonText>
              <strong>Tamanho:</strong> {size}
            </IonText>
            <IonText>
              <strong>Formato:</strong> {format.substring(1).toUpperCase()}
            </IonText>
            <IonText>
              <strong>Link original:</strong>{" "}
              <a href={link} target="_blank" rel="noopener noreferrer">
                Saiba mais
              </a>
            </IonText>
          </div>
        </IonContent>
      </IonModal>
    </motion.div>
  );
};

export default BookItem;
