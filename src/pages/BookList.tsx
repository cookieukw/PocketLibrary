import React, { useState, useEffect, useCallback } from "react";
import {
  IonContent,
  IonPage,
  IonInfiniteScroll,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScrollContent,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonLoading,
} from "@ionic/react";
import { document, images, musicalNotes, fileTray } from "ionicons/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { debounce } from "lodash";
import MediaSelectionMenu from "../components/MediaSelectionMenu";
import CategorySelectionMenu from "../components/CategorySelectionMenuProps";
import Lottie from "lottie-react";
import animation404 from "../lottie/404.json";

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

const url: string = "http://localhost:3000/api/books"; // "https://bpocket.vercel.app/api/books";

const BookList: React.FC = () => {
  console.log(0);
  const [skipItems, setSkipItems] = useState<number>(0);
  const [itemsSize] = useState<number>(10);
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("title");
  const [selectedMediaType, setSelectedMediaType] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<number>(43);

  const navigate = useHistory();

  const toCamelCase = useCallback((text: string) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const getBooks = useCallback(
    async (
      skipItems: number,
      searchTerm: string,
      searchType: string,
      selectedMediaType: number,
      selectedCategory: number
    ) => {
      setIsLoading(true);
      try {
        console.log("request");
        const requestUrl: string = `${url}?itemsSize=${itemsSize}&skipItems=${skipItems}&${searchType}=${searchTerm}&media=${selectedMediaType}&category=${selectedCategory}`;
        const response = await axios.get(requestUrl);
        console.log(requestUrl);
        const newBooks: IBook[] = response.data;
        setBooks((prevBooks) => {
          const uniqueBooks = newBooks.filter(
            (newBook) =>
              !prevBooks.some((book) => book.bookId === newBook.bookId)
          );
          return [...prevBooks, ...uniqueBooks];
        });
      } catch (error) {
        console.log("Ocorreu um erro");
        console.error(error);
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
    ]
  );

  useEffect(() => {
    if (books.length === 0) {
      getBooks(0, searchTerm, searchType, selectedMediaType, selectedCategory);
    }
  }, []);

  const handleSearchDebounced = debounce((value: string) => {
    console.log("change search");
    if (value.length < 4) return;
    setSearchTerm(value);
    setSkipItems(0);
    setBooks([]);
    getBooks(0, value, searchType, selectedMediaType, selectedCategory);
  }, 1200);

  const handleSearch = (value: string) => {
    handleSearchDebounced(value);
  };

  const getIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return document;
      case "jpg":
        return images;
      case "mp4":
        return musicalNotes;
      default:
        return fileTray;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => handleSearchDebounced(e.detail.value!)}
          onIonClear={() =>{
   
              setSearchTerm("");
              setSkipItems(0);
              setBooks([]);
              getBooks(
                0,
                "",
                searchType,
                selectedMediaType,
                selectedCategory
              );
      
          }}
        ></IonSearchbar>
        <IonSelect
          style={{ padding: "10px", margin: "0 0 0 20px" }}
          value={searchType}
          placeholder="Escolha o tipo de busca"
          onIonChange={(e) => {
            setSearchType(e.detail.value);
            console.log(`change search by ${e.detail.value}`);
            setSkipItems(0);
            setBooks([]);
            getBooks(
              0,
              searchTerm,
              e.detail.value,
              selectedMediaType,
              selectedCategory
            );
          }}
        >
          <IonSelectOption value="title">Título</IonSelectOption>
          <IonSelectOption value="authorName">Autor</IonSelectOption>
        </IonSelect>

        <MediaSelectionMenu
          selectedMediaType={selectedMediaType}
          setSelectedMediaType={() => setSelectedMediaType}
          onMediaTypeChange={(selectedValue: number) => {
            setSelectedMediaType(selectedValue);
            setSkipItems(0);
            setBooks([]);
            getBooks(
              0,
              searchTerm,
              searchType,
              selectedValue,
              selectedCategory
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
              selectedValue
            );
          }}
        />
        <IonList>
          {books.length > 0 ? (
            books.map((book: IBook) => {
              const { title, author, font, size, format, link, bookId } = book;
              return (
                <IonItem
                  key={bookId}
                  style={{
                    padding: "20px",
                  }}
                >
                  <IonIcon
                    style={{
                      height: "140px",
                      width: "100px",
                      margin: "0 10px",
                      border: "1px solid #ffffff",
                      padding: "30px",
                      color: "white",
                    }}
                    icon={getIcon(format)}
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
                        <strong>Autor:</strong> {toCamelCase(author)}
                      </p>
                      <p>
                        <strong>Fonte:</strong>{" "}
                        {font.charAt(0).toUpperCase() + font.slice(1)}
                      </p>
                      <p>
                        <strong>Tamanho:</strong> {size}
                      </p>
                      <p>
                        <strong>Formato:</strong>{" "}
                        {format.substring(1).toUpperCase()}
                      </p>
                      <p>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link do livro
                        </a>
                      </p>
                      <IonButton
                        onClick={() => navigate.push(`/bookInfo/${bookId}`)}
                      >
                        Ver mais sobre o livro
                      </IonButton>
                    </div>
                  </IonLabel>
                </IonItem>
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
        <IonInfiniteScroll
          threshold="100px"
          onIonInfinite={(e: any) => {
            if (books.length < skipItems) return;
            if (!isLoading) {
              console.log("carregando mais");
              setSkipItems((prev) => {
                const newSkipItems = prev + itemsSize;
                getBooks(
                  newSkipItems,
                  searchTerm,
                  searchType,
                  selectedMediaType,
                  selectedCategory
                );
                return newSkipItems;
              });
            }

            setTimeout(() => e.target.complete(), 500);
          }}
        >
          {books.length > skipItems && (
            <IonInfiniteScrollContent
              loadingText="Carregando mais..."
              loadingSpinner="bubbles"
            ></IonInfiniteScrollContent>
          )}
        </IonInfiniteScroll>
        <IonLoading
          isOpen={isLoading && books.length > skipItems}
          message={"Carregando..."}
        />
      </IonContent>
    </IonPage>
  );
};

export default BookList;
