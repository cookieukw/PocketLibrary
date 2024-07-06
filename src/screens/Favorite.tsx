import { useState, useCallback } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  useIonViewWillEnter,
} from "@ionic/react";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";
import BookItem from "../components/BookItem";
import db from "../classes/database";

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
const Favorite: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);

  const fetchFavorites = useCallback(() => {
    const fetchData = async () => {
      const favBooks = await db.favorites.toArray();
      setBooks(favBooks);
      console.log({ favBooks });
    };
    fetchData();
  }, [db]);

  useIonViewWillEnter(() => {
    fetchFavorites();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            "--color": "white",
            "--background": "#a11b3a",
          }}
        >
          <IonTitle>Favoritos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {books.length > 0 ? (
            books.map((book: IBook) => {
              return (
                <BookItem
                  book={book}
                  key={book.bookId}
                  favorite={true}
                  onDelete={() => {
                    setBooks((prevBooks) =>
                      prevBooks.filter(
                        (deleteBook: IBook) => deleteBook.bookId !== book.bookId
                      )
                    );
                    console.log(books.length);
                  }}
                />
              );
            })
          ) : (
            <Lottie
              animationData={animation404}
              autoplay={true}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Favorite;
