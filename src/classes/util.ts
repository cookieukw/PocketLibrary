import {
    document,
    images,
    musicalNotes,
    film,
    playOutline
} from "ionicons/icons";

export const toCamelCase = (text: string): string => {
    return text
        .toLowerCase()
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const getIcon = (format: string) => {
    switch (format.toLowerCase()) {
        case "pdf":
            return document;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return images;
        case "mp4":
        case "avi":
        case "mkv":
            return film;
        case "mp3":
        case "wav":
        case "ogg":
            return musicalNotes;
        case "doc":
        case "docx":
        case "txt":
            return document;
        default:
            return playOutline; // Ícone genérico para outros formatos de arquivo de áudio/vídeo
    }
};
