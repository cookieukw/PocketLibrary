import { useEffect, useState } from "react";
import "./css/BookInfo.css";
import { v4 } from "uuid";
import { useLocation } from "react-router";
import { heartOutline, heart } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonLoading,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router";
import { getIcon, toCamelCase } from "../classes/util";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";
import database from "../classes/database";

const url: string = "https://bpocket.vercel.app/api/book/";

interface IBook {
  downloadUrl: string;
  title: string;
  author: string;
  category: string;
  language: string;
  institutionOrPartner: string;
  institutionOrProgram: string;
  knowledgeArea: string;
  level: string;
  thesisYear: string;
  accesses: number;
  abstract: string;
}

interface IBookContent {
  title: string;
  author: string;
  font: string;
  size: string;
  sizeByBytes: string;
  format: string;
  link: string;
  bookId: string;
}

const BookInfo: React.FC = () => {
  const [bookInfo, setBookInfo] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams<{ bookId: string }>();
  const location = useLocation();
  const { state } = location;
  const [isFavorite, setIsFavorite] = useState(false);

  //@ts-ignore
  const bookContent: IBookContent | undefined = state?.book;

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const options = {
          headers: {
            Cookie: `JSESSIONID=${v4()}`,
            Accept: "/",
          },
        };

        const response = await axios.get<IBook>(`${url}${bookId}`, options);

        setBookInfo(response.data);
      } catch (error) {
        console.error(
          "Ocorreu um erro ao buscar as informações do livro:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookInfo();
  }, [bookId]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      await database.favorites.where("bookId").equals(bookId).delete();
    } else {
      if (bookContent) {
        await database.favorites.add(bookContent);
      }
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

  useEffect(() => {
    {
      (async () => {
        checkIfFavorite();
      })();
    }
  });
  useIonViewWillEnter(() => {
    {
      (async () => {
        checkIfFavorite();
      })();
    }
  });

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("ion-palette-dark", isDark);
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalhes do Livro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} message={"Carregando..."} />
        {bookInfo !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <IonCard>
              <IonCardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <IonIcon
                  style={{
                    height: "150px",
                    width: "100px",
                    borderRadius: "15px",
                    margin: "20px auto",
                    padding: "20px",
                    border: "1px solid",
                  }}
                  icon={getIcon(bookContent?.format ?? "pdf")}
                  color="primary"
                  size="large"
                />{" "}
                <IonCardContent>
                  <IonCardContent
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <IonLabel
                      style={{
                        marginBottom: "10px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {bookInfo?.title}
                    </IonLabel>
                    <IonLabel>Autor: {toCamelCase(bookInfo?.author)}</IonLabel>
                    <IonLabel>
                      Categoria: {bookInfo?.category ?? "indisponível"}
                    </IonLabel>
                    <IonLabel>
                      Idioma: {bookInfo?.language ?? "indisponível"}
                    </IonLabel>
                    <IonLabel>
                      Acessos: {bookInfo?.accesses ?? "indisponível"}
                    </IonLabel>
                    {bookContent && (
                      <>
                        <IonLabel>
                          Fonte: {bookContent.font ?? "indisponível"}
                        </IonLabel>
                        <IonLabel>
                          Tamanho: {bookContent.size ?? "indisponível"}
                        </IonLabel>
                        <IonLabel>
                          Formato:{" "}
                          {bookContent?.format.substring(1).toUpperCase() ??
                            "indisponível"}
                        </IonLabel>
                        <IonLabel>
                          Link original:{" "}
                          <a
                            href={bookContent.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Saiba mais
                          </a>
                        </IonLabel>
                      </>
                    )}
                  </IonCardContent>
                  <IonCardContent style={{ padding: "16px", display: "flex" }}>
                    <IonIcon
                      style={{ margin: "auto" }}
                      size={"large"}
                      icon={isFavorite ? heart : heartOutline}
                      onClick={toggleFavorite}
                    />
                  </IonCardContent>
                </IonCardContent>
              </IonCardContent>
            </IonCard>
            <IonButton
              onClick={async () => {
                window.open(bookInfo.downloadUrl, "_blank");
              }}
              style={{
                "--background": "#e74c3c",
                margin: "20px 0",
              }}
            >
              Baixar conteúdo
            </IonButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Lottie
              animationData={animation404}
              autoplay={true}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BookInfo;
