/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, Share2 } from 'lucide-react';
import { InvoiceData } from '../types';
import InvoicePreview from './InvoicePreview';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  isExporting: boolean;
}

export default function PreviewModal({ isOpen, onClose, invoiceData, previewRef, onDownload, isExporting }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 sm:inset-4 md:inset-10 lg:inset-y-10 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[900px] bg-slate-50 sm:rounded-3xl shadow-2xl z-[151] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-white px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">Invoice Preview</h3>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onDownload}
                  disabled={isExporting}
                  className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${isExporting ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {isExporting ? <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span className="hidden xs:inline">Download PDF</span>
                  <span className="xs:hidden">PDF</span>
                </button>
                <button 
                  onClick={onClose}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Document View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-slate-200/50 flex flex-col items-center">
               <div className="w-full max-w-[794px] bg-white shadow-2xl origin-top transition-transform transform scale-[0.5] xs:scale-[0.7] sm:scale-100 my-4 sm:my-0">
                  <div ref={previewRef} className="bg-white">
                    <InvoicePreview data={invoiceData} />
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-8 py-4 border-t border-gray-200 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] shrink-0">
              Document adheres to standard A4 print dimensions
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
