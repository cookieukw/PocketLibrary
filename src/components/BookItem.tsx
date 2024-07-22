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
  IonRippleEffect,
} from "@ionic/react";
import { useHistory } from "react-router";
import { motion } from "framer-motion";
import { getIcon, toCamelCase } from "../classes/util";

import { heartOutline, heart, informationCircleOutline } from "ionicons/icons";
import database from "../classes/database";
import "./css/BookItem.css";
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
      className="ion-activatable"
      style={{
        position: "relative",
      }}
    >
      <IonItem key={bookId} className="book-item">
        {" "}
        <IonRippleEffect style={{ color: "red" }}></IonRippleEffect>
        <IonIcon className="icon" icon={getIcon(format.substring(1))} />
        <IonLabel className="label">
          <IonText className="text-bold">
            <strong>{toCamelCase(title)} </strong>
          </IonText>
          <IonText className="block-text">
            <strong>Autor: </strong> {toCamelCase(author)}
          </IonText>
          <IonText className="block-text">
            <strong>Formato: </strong> {format.substring(1).toUpperCase()}
          </IonText>
        </IonLabel>
        <div className="actions">
          <IonButton fill="clear" onClick={toggleFavorite}>
            <IonIcon
              icon={isFavorite ? heart : heartOutline}
              style={{ color: isFavorite ? "red" : "grey" }}
            />
          </IonButton>
          <IonButton
            onClick={() => navigate(`/bookInfo/${bookId}`, { book })}
            fill="clear"
          >
            <IonIcon icon={informationCircleOutline} />
          </IonButton>
        </div>
        <IonButton onClick={() => navigate(`/bookInfo/${bookId}`, { book })}>
          Sobre
        </IonButton>
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
            <IonText>
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
