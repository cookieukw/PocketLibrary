import React, { useEffect, useState } from "react";
import "./css/BookInfo.css";
import { v4 } from "uuid";
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
    IonIcon
} from "@ionic/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router";
import { getIcon } from "../classes/util";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";

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

const BookInfo: React.FC = () => {
    const [bookInfo, setBookInfo] = useState<IBook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { bookId } = useParams<{ bookId: string }>();

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const options = {
                    headers: {
                        Cookie: `JSESSIONID=${v4()}`,
                        Accept: "/"
                    }
                };

                const response = await axios.get<IBook>(
                    `${url}${bookId}`,
                    options
                );

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
                        "--background": "#a11b3a"
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
                            flexDirection: "column"
                        }}
                    >
                        <IonCard>
                            <IonCardContent
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
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
                                        color: "black"
                                    }}
                                    icon={getIcon(
                                         "pdf"
                                    )}
                                    color="primary"
                                    size="large"
                                />

                                <IonLabel>
                                    <h1>{bookInfo?.title}</h1>
                                </IonLabel>
                                <IonLabel>
                                    <p>Autor: {bookInfo?.author}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Categoria: {bookInfo?.category}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Idioma: {bookInfo?.language}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Acessos: {bookInfo?.accesses}</p>
                                </IonLabel>
                            </IonCardContent>
                        </IonCard>
                        <IonButton
                            onClick={downloadHandler}
                            style={{
                                "--background": "#e74c3c",
                                margin: "20px 0"
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
                            height: "80vh"
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
