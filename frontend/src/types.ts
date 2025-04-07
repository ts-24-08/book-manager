export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  price: number;
  image: string;
  created_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  price: number;
  image: File | null;
  base64Image: string | null;
}
