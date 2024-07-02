import { useEffect, useState } from "react";
import {
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router";
import { motion } from "framer-motion";
import { getIcon, toCamelCase } from "../classes/util";

import { heartOutline, heart } from "ionicons/icons";
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

const BookItem: React.FC<BookItemProps> = ({ book, onDelete, favorite }) => {
  const { title, author, font, size, format, link, bookId } = book;
  const navigate = useHistory().push;
  const [isFavorite, setIsFavorite] = useState(favorite ?? false);

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
      <IonItem key={bookId}>
        <IonIcon
          style={{
            height: "140px",
            width: "140px",
            margin: "15px",
            border: "1px solid black",
            padding: "10px",
            color: "black",
          }}
          icon={getIcon(format.substring(1))}
        />
        <IonLabel>
          <h2
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {title}
          </h2>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            <p>
              <strong>Autor: </strong> {toCamelCase(author)}
            </p>
            <p>
              <strong>Fonte: </strong>
              {font.charAt(0).toUpperCase() + font.slice(1)}
            </p>
            <p>
              <strong>Tamanho:</strong> {size}
            </p>
            <p>
              <strong>Formato: </strong>
              {format.substring(1).toUpperCase()}
            </p>
            <p>
              <strong>Link original: </strong>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Saiba mais
              </a>
            </p>
            <IonButton
              onClick={() => navigate(`/bookInfo/${bookId}`, { book })}
            >
              Ver mais sobre o livro
            </IonButton>
          </div>
        </IonLabel>
        <IonButton
          fill="clear"
          onClick={() => {
            toggleFavorite();
            if (onDelete) onDelete();
          }}
        >
          <IonIcon icon={isFavorite ? heart : heartOutline} />
        </IonButton>
      </IonItem>
    </motion.div>
  );
};

export default BookItem;
