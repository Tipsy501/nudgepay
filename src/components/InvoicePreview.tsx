/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvoiceData, CURRENCIES } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  isSmall?: boolean;
}

export default function InvoicePreview({ data, isSmall = false }: InvoicePreviewProps) {
  const predefinedCurrency = CURRENCIES.find(c => c.code === data.currency);
  const currencySymbol = predefinedCurrency ? predefinedCurrency.symbol : data.currency || '$';
  
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;

  const containerClasses = isSmall 
    ? "bg-white p-6 sm:p-8 min-h-[700px] flex flex-col font-sans text-slate-900 border border-gray-100"
    : "bg-white p-12 sm:p-16 min-h-[1123px] flex flex-col font-sans text-slate-900"; // A4 is roughly 794x1123 at 96dpi

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className={`font-black tracking-tighter text-slate-900 ${isSmall ? 'text-xl' : 'text-3xl'}`}>
              {data.senderName || 'SENDER NAME'}
            </h2>
            <div className={`h-1 bg-slate-900 ${isSmall ? 'w-8' : 'w-16'}`}></div>
          </div>
          <p className={`text-slate-400 font-bold uppercase tracking-[0.1em] whitespace-pre-wrap leading-relaxed ${isSmall ? 'text-[8px] max-w-[180px]' : 'text-[10px] max-w-[280px]'}`}>
            {data.senderAddress || 'Sender Address Details'}
          </p>
        </div>

        <div className="text-right space-y-6">
          <div>
            <h1 className={`font-black text-slate-900 tracking-tighter leading-none mb-1 ${isSmall ? 'text-2xl' : 'text-5xl'}`}>INVOICE</h1>
            <p className={`font-black text-slate-300 uppercase tracking-[0.2em] ${isSmall ? 'text-[8px]' : 'text-[12px]'}`}>
              REF #{data.invoiceNumber || '000'}
            </p>
          </div>
          <div className="space-y-1 flex flex-col items-end">
            <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest">Transaction Date</p>
            <p className={`font-bold text-slate-900 ${isSmall ? 'text-[10px]' : 'text-sm'}`}>{data.invoiceDate || 'YYYY-MM-DD'}</p>
          </div>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className={`grid grid-cols-2 gap-8 mb-12 py-8 border-y border-slate-50 ${isSmall ? 'py-4' : 'py-10'}`}>
        <div>
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Billed To</p>
          <p className={`font-black text-slate-900 mb-1 ${isSmall ? 'text-xs' : 'text-lg'}`}>{data.clientName || 'Client Name'}</p>
          <p className={`text-slate-400 font-bold uppercase tracking-tight ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}>{data.clientEmail || 'client@email.com'}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Action Required By</p>
          <p className={`font-black text-slate-900 ${isSmall ? 'text-xs' : 'text-lg'}`}>{data.dueDate || 'YYYY-MM-DD'}</p>
          <p className={`text-slate-300 font-medium uppercase tracking-widest ${isSmall ? 'text-[7px]' : 'text-[8px]'}`}>Net Terms Applies</p>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] pb-3 border-b border-slate-100 mb-6">
          <div className="col-span-8 text-left">Services Provided</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-3 text-right">Amount Due</div>
        </div>
        
        <div className="space-y-6">
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start group">
              <div className="col-span-8 space-y-1">
                <p className={`font-black text-slate-800 uppercase tracking-tight ${isSmall ? 'text-[10px]' : 'text-[12px]'}`}>
                  {item.description || 'New service engagement'}
                </p>
                <p className={`text-slate-400 font-medium italic ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}>
                  Fixed Unit Price: {currencySymbol} {item.unitPrice.toLocaleString()}
                </p>
              </div>
              <div className={`col-span-1 text-center font-bold text-slate-600 self-center ${isSmall ? 'text-[10px]' : 'text-[11px]'}`}>
                {item.quantity}
              </div>
              <div className={`col-span-3 text-right font-black text-slate-900 self-center ${isSmall ? 'text-[11px]' : 'text-[14px]'}`}>
                {currencySymbol} {(item.quantity * item.unitPrice).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals & Terms */}
      <div className={`mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start gap-12 ${isSmall ? 'mt-8 pt-6' : ''}`}>
        <div className="flex-1 max-w-sm">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Terms & Acknowledgements</p>
          <p className={`text-slate-400 font-medium leading-relaxed italic ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>
            {data.terms || 'Standard payment terms apply. Interest may accrue on overdue payments.'}
          </p>
        </div>

        <div className={`w-full ${isSmall ? 'md:w-48' : 'md:w-72'}`}>
          <div className="space-y-2 mb-6 text-right">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              <span>Gross Subtotal</span>
              <span className="text-slate-500">{currencySymbol} {subtotal.toLocaleString()}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Value Added Tax ({data.taxRate}%)</span>
                <span className="text-slate-500">{currencySymbol} {taxAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className={`p-6 bg-slate-900 rounded-2xl text-white flex justify-between items-center shadow-[var(--shadow-hex)] ${isSmall ? 'p-4' : ''}`}>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Final Total Due</span>
            <span className={`font-black tracking-tighter ${isSmall ? 'text-lg' : 'text-3xl'}`}>
              {currencySymbol} {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-slate-50 text-center">
        <p className={`font-black text-slate-200 uppercase tracking-[0.4em] ${isSmall ? 'text-[6px]' : 'text-[8px]'}`}>
          Document authenticated & secured via NudgePay
        </p>
      </div>
    </div>
  );
}
