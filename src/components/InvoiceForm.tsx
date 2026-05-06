/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Trash2, Globe, Calendar, CreditCard, User, Mail, MapPin, Hash, Percent, FileText } from 'lucide-react';
import { InvoiceData, InvoiceItem, CURRENCIES } from '../types';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Sender & Client Section - Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From */}
        <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <User className="w-3.5 h-3.5" />
            Sender Info
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Your Business Name"
                value={data.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-gray-100 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Business Address"
                rows={3}
                value={data.senderAddress}
                onChange={(e) => updateField('senderAddress', e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-none text-sm text-slate-600 focus:ring-0 transition-all placeholder:text-gray-300 resize-none"
              />
            </div>
          </div>
        </section>

        {/* To */}
        <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Globe className="w-3.5 h-3.5" />
            Client Info
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Client Name"
              value={data.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-100 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={data.clientEmail}
              onChange={(e) => updateField('clientEmail', e.target.value)}
              className="w-full px-0 py-2 bg-transparent border-none text-sm text-slate-600 focus:ring-0 transition-all placeholder:text-gray-300"
            />
          </div>
        </section>
      </div>

      {/* Invoice Details Bento Card */}
      <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Hash className="w-3 h-3" /> Invoice #
          </label>
          <input
            type="text"
            value={data.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
            className="w-full py-1 bg-transparent border-b border-gray-50 text-sm font-bold text-slate-700 focus:border-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Date
          </label>
          <input
            type="date"
            value={data.invoiceDate}
            onChange={(e) => updateField('invoiceDate', e.target.value)}
            className="w-full py-1 bg-transparent border-b border-gray-50 text-sm font-bold text-slate-700 focus:border-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Due Date
          </label>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
            className="w-full py-1 bg-transparent border-b border-gray-50 text-sm font-bold text-slate-700 focus:border-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Currency
          </label>
          <div className="relative group">
            <input
              type="text"
              list="currency-list"
              value={data.currency}
              onChange={(e) => updateField('currency', e.target.value)}
              placeholder="USD or $"
              className="w-full py-1 bg-transparent border-b border-gray-50 text-sm font-bold text-slate-700 focus:border-slate-900 focus:outline-none placeholder:text-slate-200"
            />
            <datalist id="currency-list">
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </datalist>
          </div>
        </div>
      </section>

      {/* Items Section Bento Card */}
      <section className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Invoice Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-black uppercase tracking-widest transition-all"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest pb-3 border-b border-gray-50">
            <div className="col-span-7">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-8 md:space-y-4">
            {data.items.map((item) => (
              <div key={item.id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-center border-b border-gray-50 pb-6 md:pb-0 md:border-none">
                <div className="md:col-span-7">
                  <label className="md:hidden text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1 block">Description</label>
                  <input
                    type="text"
                    placeholder="UI/UX Design Phase..."
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-transparent group-hover:border-gray-100 focus:border-slate-900 font-bold text-slate-700 transition-all focus:outline-none placeholder:text-gray-200"
                  />
                </div>
                <div className="grid grid-cols-2 md:contents gap-4 w-full">
                  <div className="md:col-span-2 text-center">
                    <label className="md:hidden text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1 block">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full py-2 bg-slate-50 border-none rounded-xl text-center font-bold text-slate-600 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                  <div className="md:col-span-2 text-center">
                    <label className="md:hidden text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1 block">Unit Price</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full py-2 bg-slate-50 border-none rounded-xl text-center font-bold text-slate-600 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex items-center justify-end pt-2 md:pt-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={data.items.length === 1}
                    className="p-2 text-slate-200 hover:text-red-500 disabled:opacity-0 transition-all bg-slate-50 rounded-lg md:bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax</span>
            <div className="relative">
              <input
                type="number"
                value={data.taxRate}
                onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                className="w-16 py-1 bg-slate-50 border-none rounded text-center font-bold text-slate-600 focus:ring-0"
              />
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">%</span>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>{CURRENCIES.find(c => c.code === data.currency)?.symbol}{(data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Total</span>
              <span className="text-xl font-black text-slate-900">
                {CURRENCIES.find(c => c.code === data.currency)?.symbol}
                {(data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) * (1 + data.taxRate/100)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Notes Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
          <FileText className="w-3.5 h-3.5" />
          Terms & Conditions
        </div>
        <textarea
          placeholder="Payment instructions, bank details, or notes..."
          rows={3}
          value={data.terms}
          onChange={(e) => updateField('terms', e.target.value)}
          className="w-full px-0 py-2 bg-transparent border-none text-sm text-slate-600 focus:ring-0 transition-all placeholder:text-gray-300 resize-none font-medium"
        />
      </section>
    </div>
  );
}
