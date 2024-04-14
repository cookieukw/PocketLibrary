import { useEffect, useState, useCallback } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    useIonViewWillEnter
} from "@ionic/react";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";
import BookItem from "../components/BookItem";
import { heart } from "ionicons/icons";

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
        };
        fetchData();
    }, [db]);
    useIonViewWillEnter(() => {
        fetchFavorites();
    });
    const removeFromFavorites = async (bookId: string) => {
        await db.favorites.where("bookId").equals(bookId).delete();
        const updatedFavorites = books.filter(
            (book: IBook) => book.bookId !== bookId
        );
        setBooks(updatedFavorites);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
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
                                    onDelete={() => {
                                        setBooks(prevBooks =>
                                            prevBooks.filter(
                                                (deleteBook: IBook) =>
                                                    deleteBook.bookId !==
                                                    book.bookId
                                            )
                                        );
                                    }}
                                />
                            );
                        })
                    ) : (
                        <IonContent>
                            <Lottie
                                animationData={animation404}
                                autoplay={true}
                                loop={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                            <IonText>Nada encontrado</IonText>
                        </IonContent>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Favorite;
