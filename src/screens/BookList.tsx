import React, { useState, useEffect, useCallback } from "react";
import "./css/BookList.css";
import { alert } from "ionicons/icons";

import {
  IonContent,
  IonPage,
  IonCard,
  IonTitle,
  IonInfiniteScroll,
  IonList,
  IonInfiniteScrollContent,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonToolbar,
  useIonRouter,
  IonText,
} from "@ionic/react";

import axios from "axios";

import { debounce } from "lodash";
import MediaSelectionMenu from "../components/MediaSelectionMenu";
import CategorySelectionMenu from "../components/CategorySelectionMenuProps";
import BookItem from "../components/BookItem";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";
import LanguageSelection from "../components/LanguageSelection";
import { AnimatePresence, motion } from "framer-motion";
import { initializeADS } from "../classes/util";

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

const url: string = "https://bpocket.vercel.app/api/books";
//const url: string = "http://localhost:3000/api/books";

const BookList: React.FC = () => {
  //console.log(0);
  const [skipItems, setSkipItems] = useState<number>(0);
  const [itemsSize] = useState<number>(10);
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("title");
  const [selectedMediaType, setSelectedMediaType] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<number>(43);
  const [language, setLanguage] = useState<number>(1);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const ionRouter: any = useIonRouter();

  const getBooks = useCallback(
    async (
      skipItems: number,
      searchTerm: string,
      searchType: string,
      selectedMediaType: number,
      selectedCategory: number,
      language: number
    ) => {
      setIsLoading(true);
      try {
        // console.log("request");
        const requestUrl: string = `${url}?itemsSize=${itemsSize}&skipItems=${skipItems}&${searchType}=${searchTerm}&media=${selectedMediaType}&category=${selectedCategory}&language=${language}`;
        const response = await axios.get(requestUrl);
        //  console.log({ requestUrl, response: response.data });
        const newBooks: IBook[] = response.data;
        setBooks((prevBooks) => {
          const uniqueBooks = newBooks.filter(
            (newBook) =>
              !prevBooks.some((book) => book.bookId === newBook.bookId)
          );
          if (uniqueBooks.length === 0) setDisabled(true);
          return [...prevBooks, ...uniqueBooks];
        });
      } catch (error) {
        console.log("Ocorreu um erro");
        console.error(error);
        setDisabled(true);
      } finally {
        setIsLoading(false);
      }
    },
    [
      itemsSize,
      searchTerm,
      searchType,
      skipItems,
      selectedMediaType,
      selectedCategory,
      language,
    ]
  );

  useEffect(() => {
    if (books.length === 0) {
      getBooks(
        0,
        searchTerm,
        searchType,
        selectedMediaType,
        selectedCategory,
        language
      );
    }
  }, []);

  const handleSearchDebounced = debounce((value: string) => {
    // console.log("change search");
    setDisabled(false);
    if (value.length < 4) return;
    //setSearchTerm(value);
    setSkipItems(0);
    setBooks([]);
    getBooks(
      0,
      value,
      searchType,
      selectedMediaType,
      selectedCategory,
      language
    );
  }, 1200);

  useEffect(() => {
    (async () => {
      await initializeADS();
    })();
  }, []);

  document.addEventListener("ionBackButton", (ev: any) => {
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        ionRouter.goBack();
      }
    });
  });

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";

    document.documentElement.classList.toggle("ion-palette-dark", isDark);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PocketLibrary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => {
            setSearchTerm(e.detail.value!);
            handleSearchDebounced(e.detail.value!);
          }}
          onIonClear={() => {
            setSearchTerm("");
            setSkipItems(0);
            setBooks([]);
            getBooks(
              0,
              "",
              searchType,
              selectedMediaType,
              selectedCategory,
              language
            );
          }}
        ></IonSearchbar>
        <div className="flex">
          <IonIcon icon={alert} />
          <IonText>Digite no mínimo 4 caracteres</IonText>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            style={{
              margin: "20px",
              background: "transparent",
              border: "none",
              color: "black",
              fontWeight: "bold",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCategories(!showCategories)}
          >
            {" "}
            <IonText color="secondary">
              {showCategories ? "Esconder Categorias" : "Mostrar Categorias"}
            </IonText>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showCategories && (
            <IonCard>
              <IonSelect
                value={searchType}
                placeholder="Escolha o tipo de busca"
                onIonChange={(e) => {
                  setSearchType(e.detail.value);
                  // console.log(`change search by ${e.detail.value});
                  setSkipItems(0);
                  setBooks([]);
                  getBooks(
                    0,
                    searchTerm,
                    e.detail.value,
                    selectedMediaType,
                    selectedCategory,
                    language
                  );
                }}
              >
                <IonSelectOption value="title">Título</IonSelectOption>
                <IonSelectOption value="authorName">Autor</IonSelectOption>
              </IonSelect>

              <MediaSelectionMenu
                selectedMediaType={selectedMediaType}
                setSelectedMediaType={setSelectedMediaType}
                onMediaTypeChange={(selectedValue: number) => {
                  setSkipItems(0);
                  getBooks(
                    0,
                    searchTerm,
                    searchType,
                    selectedValue,
                    selectedCategory,
                    language
                  );
                }}
              />
              <CategorySelectionMenu
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                selectedMediaType={selectedMediaType}
                onCategoryChange={(selectedValue: number) => {
                  setSelectedCategory(selectedValue);
                  setSkipItems(0);
                  setBooks([]);
                  getBooks(
                    0,
                    searchTerm,
                    searchType,
                    selectedMediaType,
                    selectedValue,
                    language
                  );
                }}
              />
              <LanguageSelection
                onLanguageChange={(language) => {
                  setLanguage(language);
                  setSkipItems(0);
                  setBooks([]);
                  getBooks(
                    0,
                    searchTerm,
                    searchType,
                    selectedMediaType,
                    selectedCategory,
                    language
                  );
                }}
                language={language}
                setLanguage={setLanguage}
              />
            </IonCard>
          )}
        </AnimatePresence>
        <IonList>
          {books.length > 0 ? (
            books.map((book: IBook) => {
              return <BookItem book={book} key={book.bookId} />;
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

        <IonInfiniteScroll
          disabled={disabled}
          threshold="10vh"
          onIonInfinite={(e: any) => {
            if (!isLoading) {
              //  console.log("carregando mais");
              setSkipItems((prev) => {
                const newSkipItems = prev + itemsSize;
                getBooks(
                  newSkipItems,
                  searchTerm,
                  searchType,
                  selectedMediaType,
                  selectedCategory,
                  language
                );
                return newSkipItems;
              });
            }

            setTimeout(() => e.target.complete(), 3000);
          }}
        >
          <IonInfiniteScrollContent
            loadingText="Carregando mais..."
            loadingSpinner="bubbles"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default BookList;
