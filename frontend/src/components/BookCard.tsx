import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div
        className="cursor-pointer p-4 flex items-start gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img
          src={book.image_url}
          alt={book.title}
          className="w-24 h-36 object-cover rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <div
        className={`px-4 pb-4 transition-all duration-200 ${
          isExpanded ? 'block' : 'hidden'
        }`}
      >
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Price:</strong> €{book.price.toFixed(2)}</p>
          <p><strong>Description:</strong></p>
          <p className="text-sm">{book.description}</p>
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};