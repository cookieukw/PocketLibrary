import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
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
} from '@ionic/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'react-router';

const url: string = "https://bpocket.vercel.app/api/book/";

const BookInfo: React.FC = () => {
    const [bookInfo, setBookInfo] = useState<any | null>(null);
    const { bookId } = useParams<{ bookId: string }>();

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const options = {
                    headers: {
                        'Cookie': `JSESSIONID=${v4()}`,
                        'Accept': '/',
                    }
                };

                const response = await axios.get(`${url}${bookId}`, options);

                setBookInfo(response.data);
            } catch (error) {
                console.error('Ocorreu um erro ao buscar as informações do livro.', error);
            }
        };

        fetchBookInfo();
    }, [bookId]);

    const downloadHandler = () => {
        window.open(bookInfo.downloadUrl, '_blank');
    };

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

            <IonContent>
                {bookInfo ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",

                        }}>
                        <IonCard>
                            <motion.img
                                style={{
                                    display: "block",
                                    height: "300px",
                                    width: "250px",
                                    borderRadius: "15px",
                                    margin: "20px auto"
                                }}
                                src="https://picsum.photos/250/300"
                                alt="Capa do Livro"
                                whileHover={{ scale: 1.06 }}
                                transition={{ duration: 0.3 }}
                            />

                            <IonCardContent>
                                <IonLabel>
                                    <h1 style={{
                                        textAlign: "center",
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}>{bookInfo.title}</h1>
                                </IonLabel>
                                <IonLabel>
                                    <p>Autor: {bookInfo.author}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Categoria: {bookInfo.category}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Idioma: {bookInfo.language}</p>
                                </IonLabel>
                                <IonLabel>
                                    <p>Acessos: {bookInfo.accesses}</p>
                                </IonLabel>
                            </IonCardContent>
                            <IonCardContent>
                            </IonCardContent>
                        </IonCard>
                        <IonButton
                            onClick={() => {
                                console.log('Implemente a lógica para baixar arquivo com a API do Capacitor.');
                            }}
                        >
                            Baixar PDF
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
                                textAlign: "center",

                            }}>CARREGANDO</motion.div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BookInfo;
