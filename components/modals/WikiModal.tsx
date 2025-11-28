import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useWikiContent } from "@/hooks/useWikiContent";

interface WikiModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

export function WikiModal({ isOpen, onClose, itemName }: WikiModalProps) {
  const { content, error, isLoading } = useWikiContent(itemName);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Custom styles for wiki content
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .wiki-content {
        max-width: 100%;
        margin: 0 auto;
        padding: 1.5rem;
        color: #e2e8f0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      
      /* Base table styles */
      .wiki-content table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 1.5rem 0;
        background-color: #1e293b;
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid #334155;
      }

      /* First table (Item Stats) specific styling */
      .wiki-content table:first-of-type {
        max-width: 400px;
        margin: 0 auto 2rem auto;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      .wiki-content table:first-of-type th,
      .wiki-content table:first-of-type td {
        text-align: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #334155;
      }
      
      .wiki-content table:first-of-type th {
        background-color: #0f172a;
        font-weight: 600;
        color: #f1f5f9;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
      }
      
      /* Main item image styling */
      .wiki-content table:first-of-type th p img,
      .wiki-content table:first-of-type th .image img {
        width: 128px !important;
        height: 128px !important;
        object-fit: contain;
        vertical-align: middle;
        display: block;
        margin: 0 auto;
        filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
      }

      /* Inline images styling */
      .wiki-content p:not(.wiki-content table:first-of-type th p) img {
        max-width: 20px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 4px;
      }

      /* Icon images in stats table */
      .wiki-content table:first-of-type td img {
        max-width: 24px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 6px;
      }

      /* Fix for large images in other tables (like upgrade costs) */
      .wiki-content table:not(:first-of-type) img {
        max-width: 24px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 auto;
      }

      /* Text styling within tables */
      .wiki-content table:first-of-type p {
        text-align: center;
        margin: 0;
      }
      
      .wiki-content table:first-of-type b {
        display: block;
        text-align: center;
        color: #38bdf8;
        margin-bottom: 0.25rem;
      }

      /* General Table Styling */
      .wiki-content th {
        background-color: #1e293b;
        color: #94a3b8;
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #334155;
        font-weight: 600;
        font-size: 0.875rem;
      }
      
      .wiki-content td {
        padding: 0.75rem;
        border-bottom: 1px solid #334155;
        color: #cbd5e1;
        font-size: 0.95rem;
      }
      
      .wiki-content tr:last-child td {
        border-bottom: none;
      }
      
      .wiki-content tr:nth-child(even):not(:first-of-type tr) {
        background-color: #253146;
      }

      /* Typography */
      .wiki-content h1, .wiki-content h2, .wiki-content h3 {
        color: #f1f5f9;
        margin: 2rem 0 1rem 0;
        font-weight: 700;
        letter-spacing: -0.025em;
      }
      
      .wiki-content h2 {
        font-size: 1.5rem;
        border-bottom: 1px solid #334155;
        padding-bottom: 0.5rem;
      }
      
      .wiki-content p {
        color: #94a3b8;
        line-height: 1.75;
        margin: 1rem 0;
        font-size: 1rem;
      }

      /* Lists */
      .wiki-content ul, .wiki-content ol {
        color: #cbd5e1;
        margin: 1rem 0;
        padding-left: 2rem;
      }
      
      .wiki-content li {
        margin: 0.5rem 0;
        line-height: 1.6;
      }

      /* Links */
      .wiki-content a {
        color: #38bdf8;
        text-decoration: none;
        transition: color 0.2s;
      }
      
      .wiki-content a:hover {
        color: #7dd3fc;
        text-decoration: underline;
      }

      /* Non-interactive links */
      .wiki-content p a:not(.image),
      .wiki-content td a:not(.image),
      .wiki-content a[href*="index.php/"],
      .wiki-content a[href*="index.php%2F"] {
        color: inherit;
        text-decoration: none;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen || !mounted) return null;

  let modalContent = null;

  if (isLoading) {
    modalContent = (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-200">
        <div className="bg-[#0f172a] p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 font-medium">Loading wiki content...</p>
        </div>
      </div>
    );
  } else if (error) {
    modalContent = (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-200">
        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-2xl border border-red-500/20 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
            <FaTimes className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Error Loading Content
          </h3>
          <p className="text-slate-400 text-sm mb-6">{error.message}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  } else if (content) {
    modalContent = (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
        <div
          ref={modalRef}
          className="bg-[#0f172a] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50 backdrop-blur sticky top-0 z-10">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {content.title}
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Wiki Information
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/10 group"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto custom-scrollbar">
            <div
              className="wiki-content"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />

            {/* Footer Source */}
            <div className="mt-8 mb-6 text-center">
              <a
                href="https://wiki.idleclans.com/index.php/Main_Page"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                Source: Idle Clans Wiki
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return modalContent ? createPortal(modalContent, document.body) : null;
}
