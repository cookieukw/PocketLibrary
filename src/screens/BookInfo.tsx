import { useEffect, useState } from "react";
import "./css/BookInfo.css";
import { v4 } from "uuid";
import { useLocation } from "react-router";
import { FileOpener } from "@capacitor-community/file-opener";
import { Filesystem, Directory } from "@capacitor/filesystem";

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
} from "@ionic/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router";
import { getIcon, toCamelCase } from "../classes/util";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";
import { Capacitor } from "@capacitor/core";
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
const downloadAndOpenFile = async (url: string) => {
  console.log(url);

  try {
    // Use axios to fetch the file
    const response = await fetch(url, {
     // responseType: "blob",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 11; SM-A107M Build/RP1A.200720.012) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.91 Mobile Safari/537.36",
        Cookie: "JSESSIONID=61D57D0C629DBCD3C6C767F21AC8D301",
        Accept: "/",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "http://localhost:5174",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      },
    });
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    /*
    const blob = response.data;

    const filename = url.substring(url.lastIndexOf("/") + 1);

  
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      const base64 = base64data.split(",")[1];
      const { uri } = await Filesystem.writeFile({
        path: filename,
        data: base64,
        directory: Directory.Data,
      });

      const platform = Capacitor.getPlatform();
      if (platform === "android" || platform === "ios") {
      } else {
        const blobUrl = URL.createObjectURL(blob);
        // window.open(blobUrl, "_blank");
      }
    };*/
  } catch (error) {
    console.error("Error downloading and opening the file:", error);
  }
};

const BookInfo: React.FC = () => {
  const [bookInfo, setBookInfo] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams<{ bookId: string }>();
  const location = useLocation();
  const { state } = location;

  //@ts-ignore
  const bookContent: IBookContent = location.state?.book;

  console.log(state);
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

  const downloadHandler = () => {
    window.open(bookInfo?.downloadUrl, "_blank");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            "--color": "white",
            "--background": "#a11b3a",
          }}
        >
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
                    border: "1px solid black",
                    color: "black",
                  }}
                  icon={getIcon(bookContent?.format ?? "pdf")}
                  color="primary"
                  size="large"
                />

                <IonLabel>
                  <h1>{bookInfo?.title}</h1>
                </IonLabel>
                <IonLabel>
                  <p>Autor: {toCamelCase(bookInfo?.author)}</p>
                </IonLabel>
                <IonLabel>
                  <p>Categoria: {bookInfo?.category ?? "indisponível"}</p>
                </IonLabel>
                <IonLabel>
                  <p>Idioma: {bookInfo?.language ?? "indisponível"}</p>
                </IonLabel>
                <IonLabel>
                  <p>Acessos: {bookInfo?.accesses ?? "indisponível"}</p>
                </IonLabel>
                <IonLabel>
                  <p>Fonte: {bookContent.font ?? "indisponível"}</p>
                </IonLabel>
                <IonLabel>
                  <p>Tamanho: {bookContent.size ?? "indisponível"}</p>
                </IonLabel>
                <IonLabel>
                  <p>
                    Formato:{" "}
                    {bookContent?.format.substring(1).toUpperCase() ??
                      "indisponível"}
                  </p>
                </IonLabel>
                <IonLabel>
                  <p>
                    Link original:{" "}
                    <a
                      href={bookContent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba mais
                    </a>
                  </p>
                </IonLabel>
              </IonCardContent>
            </IonCard>
            <IonButton
              onClick={async () => {
                await downloadAndOpenFile(bookInfo.downloadUrl);
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
