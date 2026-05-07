/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Plus, 
  Trash2, 
  Heart, 
  Coins, 
  PlusCircle, 
  FileText, 
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Menu,
  X
} from 'lucide-react';
import { InvoiceData, InvoiceItem, CURRENCIES } from './types';
import { generatePDF } from './utils/pdf';

// Components
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import AdPlaceholder from './components/AdPlaceholder';
import DonationModal from './components/DonationModal';
import PreviewModal from './components/PreviewModal';

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    senderName: '',
    senderAddress: '',
    clientName: '',
    clientEmail: '',
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { id: '1', description: 'Design Services', quantity: 1, unitPrice: 500 }
    ],
    taxRate: 0,
    terms: 'Please pay within 7 days of receiving this invoice. Thank you for your business!',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const modalPreviewRef = useRef<HTMLDivElement>(null);
  const hiddenCaptureRef = useRef<HTMLDivElement>(null);

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleDownload = async (ref: React.RefObject<HTMLDivElement | null>) => {
    // Prefer the explicitly passed ref, but fallback to hidden capture if available
    const targetRef = ref.current || hiddenCaptureRef.current;
    if (!targetRef) {
      console.warn('No target element found for PDF generation');
      return;
    }
    
    setIsExporting(true);
    try {
      await generatePDF(targetRef, `Invoice-${invoiceData.invoiceNumber || 'Draft'}.pdf`);
      // Show donation modal after successful download
      if (showPreviewModal) setShowPreviewModal(false);
      
      // Auto-open donation modal once per session
      const hasShownDonation = sessionStorage.getItem('nudgepay_donation_shown');
      if (!hasShownDonation) {
        setTimeout(() => {
          setShowDonationModal(true);
          sessionStorage.setItem('nudgepay_donation_shown', 'true');
        }, 1500);
      }
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Banner Ad */}
      <div className="w-full bg-white border-b border-gray-200 py-3 px-4 shrink-0 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <span className="text-[10px] text-gray-300 mb-1 uppercase tracking-widest font-bold">Advertisement</span>
          <AdPlaceholder type="leaderboard" label="Sponsored" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="h-14 sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">NudgePay</span>
              <span className="hidden sm:inline-block text-[10px] text-gray-400 font-bold ml-2 px-2 py-0.5 border border-gray-100 rounded-full uppercase">Free Generator</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button 
                onClick={() => setShowDonationModal(true)}
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Heart className="w-4 h-4 fill-current" />
                Support NudgePay
              </button>
              <button
                onClick={() => handleDownload(hiddenCaptureRef)}
                disabled={isExporting}
                className={`bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all hover:bg-slate-800 disabled:opacity-50`}
              >
                {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                Download PDF
              </button>
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-slate-600"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 z-30 bg-white pt-24 px-6"
          >
            <div className="flex flex-col gap-8 text-xl font-bold tracking-tight">
              <button 
                onClick={() => {
                  setShowDonationModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-pink-600 p-4 bg-pink-50 rounded-2xl"
              >
                <Heart className="w-6 h-6 fill-current" />
                Support NudgePay
              </button>
              <button
                onClick={() => {
                  handleDownload(hiddenCaptureRef);
                  setIsMobileMenuOpen(false);
                }}
                className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl"
              >
                <Download className="w-6 h-6" />
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Professional Invoice</h1>
              <p className="text-slate-500 font-medium mt-1">Free, simple, and global invoicing for freelancers.</p>
            </header>

            <section aria-labelledby="invoice-form-title" className="space-y-6">
              <h2 id="invoice-form-title" className="sr-only">Invoice Information Form</h2>
              <InvoiceForm 
                data={invoiceData} 
                onChange={setInvoiceData} 
              />
            </section>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                id="preview-btn"
                onClick={() => setShowPreviewModal(true)}
                className="flex-1 group flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-6 sm:px-8 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-bold text-base sm:text-lg transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                Preview
              </button>
              <button
                id="main-download-btn"
                onClick={() => handleDownload(hiddenCaptureRef)}
                disabled={isExporting}
                className={`flex-[1.5] group flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-6 sm:px-8 rounded-2xl text-white font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 ${isExporting ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700'}`}
              >
                {isExporting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                )}
                {isExporting ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>

            {/* SEO Content Section */}
            <section className="pt-12 pb-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Why use NudgePay?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Free & No Registration</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Create and download as many invoices as you need without creating an account or paying a cent.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Secure & Private</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your data never leaves your browser. All PDF generation happens locally, ensuring your client details stay private.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Ad */}
            <div className="pt-4">
              <AdPlaceholder type="rectangle" label="Advertisement" />
            </div>
          </div>

          {/* Preview Side */}
          <div className="mt-8 sm:mt-12 lg:mt-0 lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-slate-700 rounded-2xl border border-slate-600 shadow-2xl relative overflow-hidden group flex flex-col h-[600px] sm:h-[700px] lg:h-[800px]">
              {/* Viewer Toolbar */}
              <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-600 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-500 rounded text-white">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden xs:block">
                    {invoiceData.invoiceNumber || 'Draft'}.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-slate-900 rounded text-[9px] font-black text-slate-400 uppercase">
                    100%
                  </div>
                  <button 
                    onClick={() => setShowPreviewModal(true)}
                    className="p-1 px-2 hover:bg-slate-600 rounded text-[10px] font-bold text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View More</span>
                  </button>
                </div>
              </div>
              
              {/* Viewer Body */}
              <div className="flex-1 overflow-auto bg-slate-900/50 p-4 sm:p-8 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent flex justify-center">
                <div 
                  ref={previewRef}
                  className="bg-white shadow-2xl origin-top transition-transform transform scale-[0.4] xs:scale-[0.5] sm:scale-[0.7] lg:scale-[0.5] xl:scale-[0.65] 2xl:scale-[0.8]"
                >
                  <InvoicePreview data={invoiceData} isSmall />
                </div>
              </div>
              
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <button 
                  onClick={() => setShowPreviewModal(true)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold py-2 px-6 rounded-full hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
                 >
                   Open Full Screen
                 </button>
              </div>
            </div>

            {/* Sidebar Ad (Desktop) */}
            <div className="hidden lg:block">
              <AdPlaceholder type="vertical" label="Sponsored" />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-gray-200 bg-white px-4 sm:px-6 py-8 md:py-10 flex flex-col items-center gap-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-slate-400 font-medium text-center md:text-left">© {new Date().getFullYear()} NudgePay — Simple invoices. Global payments.</p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center md:text-left">Developed by Topzero Group</p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6">
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <a href="/pages/free-invoice-generator.html" className="hover:text-slate-600 transition-colors">Free Invoice Generator</a>
              <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full"></span>
              <a href="/pages/create-invoice-online.html" className="hover:text-slate-600 transition-colors">Create Invoice</a>
              <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full"></span>
              <a href="/pages/about.html" className="hover:text-slate-600 transition-colors">About</a>
            </nav>

            <div className="flex items-center gap-4 px-6 border-slate-100 sm:border-l sm:border-r">
              <a 
                href="https://twitter.com/nudgepayments" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-400 hover:bg-blue-50 transition-all"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/topzerogroup/nudgepay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="View source on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/topzerogroup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/nudgepay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-all"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/nudgepay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            <button 
              onClick={() => setShowDonationModal(true)}
              className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-6 py-2.5 rounded-full text-xs font-bold transition-all border border-pink-100 shadow-sm"
            >
              <Heart className="w-4 h-4 fill-current" />
              Support this tool
            </button>
          </div>
        </div>
      </footer>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        invoiceData={invoiceData}
        previewRef={modalPreviewRef}
        onDownload={() => handleDownload(modalPreviewRef)}
        isExporting={isExporting}
      />

      {/* Hidden Capture Container - Always full size, off-screen */}
      <div 
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', background: 'white' }}
      >
        <div ref={hiddenCaptureRef} id="invoice-preview">
          <InvoicePreview data={invoiceData} />
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal 
        isOpen={showDonationModal} 
        onClose={() => setShowDonationModal(false)} 
      />
    </div>
  );
}

