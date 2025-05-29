import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useWikiContent } from '@/hooks/useWikiContent';
import DOMPurify from 'dompurify';

interface WikiModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

export function WikiModal({ isOpen, onClose, itemName }: WikiModalProps) {
  const { content, error, isLoading } = useWikiContent(itemName);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Add custom styles for wiki content
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .wiki-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
      }
      .wiki-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem auto;
        background-color: #1a1a1a;
        border: 1px solid #333;
      }
      .wiki-content table:first-of-type {
        max-width: 400px;
        margin: 0 auto;
      }
      .wiki-content table:first-of-type th,
      .wiki-content table:first-of-type td {
        text-align: center;
      }
      /* Main item image (in the first cell) */
      .wiki-content table:first-of-type th p img,
      .wiki-content table:first-of-type th .image img {
        width: 200px !important;
        height: 200px !important;
        object-fit: contain;
        vertical-align: middle;
        display: block;
        margin: 0 auto;
      }
      /* Style for images in description text */
      .wiki-content p:not(.wiki-content table:first-of-type th p) img {
        max-width: 20px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 2px;
      }
      /* Other images in the table (like Defence, Gold) */
      .wiki-content table:first-of-type td img {
        max-width: 24px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 4px;
      }
      .wiki-content table:first-of-type p {
        text-align: center;
      }
      .wiki-content table:first-of-type b {
        display: block;
        text-align: center;
      }
      .wiki-content table:not(:first-of-type) img {
        max-width: 32px;
        height: auto;
        vertical-align: middle;
        margin: 0 4px;
      }
      .wiki-content th {
        background-color: #2a2a2a;
        color: #fff;
        padding: 0.5rem;
        text-align: left;
        border: 1px solid #333;
      }
      .wiki-content td {
        padding: 0.5rem;
        border: 1px solid #333;
        color: #fff;
      }
      .wiki-content tr:nth-child(even) {
        background-color: #222;
      }
      .wiki-content h1, .wiki-content h2, .wiki-content h3 {
        color: #fff;
        margin: 1rem 0;
      }
      .wiki-content p {
        color: #ccc;
        line-height: 1.5;
        margin: 0.5rem 0;
      }
      .wiki-content ul, .wiki-content ol {
        color: #ccc;
        margin: 0.5rem 0;
        padding-left: 1.5rem;
      }
      .wiki-content li {
        margin: 0.25rem 0;
      }
      .wiki-content a {
        color: #60a5fa;
        text-decoration: none;
      }
      .wiki-content a:hover {
        text-decoration: underline;
      }
      /* Remove hyperlink styling for Category links and description text */
      .wiki-content p a:not(.image),
      .wiki-content td a:not(.image),
      .wiki-content a[href*="index.php/"],
      .wiki-content a[href*="index.php%2F"] {
        color: inherit;
        text-decoration: none;
        pointer-events: none;
      }
      .wiki-content p a:not(.image):hover,
      .wiki-content td a:not(.image):hover,
      .wiki-content a[href*="index.php/"]:hover,
      .wiki-content a[href*="index.php%2F"]:hover {
        text-decoration: none;
      }
      /* Keep image links clickable */
      .wiki-content a.image {
        color: #60a5fa;
        text-decoration: none;
        pointer-events: auto;
      }
      .wiki-content a.image:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-white">Loading wiki content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-red-500">{error.message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-700 text-sm text-gray-400 text-center font-bold">
          Information from{' '}
          <a 
            href="https://wiki.idleclans.com/index.php/Main_Page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Idle Clans Wiki
          </a>
        </div>
        <div 
          className="wiki-content"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>
    </div>
  );
} 