/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Coffee, ExternalLink } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<string>('3');
  const [isCustom, setIsCustom] = useState(false);
  const [isPaypalLoading, setIsPaypalLoading] = useState(true);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let paypalButtons: any = null;

    if (isOpen && window.paypal && paypalContainerRef.current) {
      setIsPaypalLoading(true);
      // Clear previous buttons if any
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }

      paypalButtons = window.paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          const value = isCustom ? selectedAmount : selectedAmount;
          return actions.order.create({
            purchase_units: [{
              description: "Support NudgePay Project",
              amount: {
                currency_code: "USD",
                value: value || "1.00"
              }
            }]
          });
        },
        onApprove: async (_data: any, actions: any) => {
          await actions.order.capture();
          alert("Thank you so much for your support! ❤️");
          onClose();
        },
        onInit: () => {
          setIsPaypalLoading(false);
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          setIsPaypalLoading(false);
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }
      });

      if (paypalButtons) {
        paypalButtons.render(paypalContainerRef.current);
      }
    }

    return () => {
      if (paypalButtons && paypalButtons.close) {
        // Standard cleanup
      }
    };
  }, [isOpen, selectedAmount, isCustom, onClose]);

  const amounts = ['1', '3', '5'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] max-h-[85vh] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[201] border border-slate-100 flex flex-col overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 hover:bg-slate-50 rounded-full transition-all z-20 bg-white/90 backdrop-blur-md text-slate-400 hover:text-slate-600 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 pt-12 sm:pt-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center"
              >
                <motion.div variants={itemVariants} className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 text-pink-500 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 rotate-6 shadow-sm ring-4 ring-pink-50/50 shrink-0">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                </motion.div>
                
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center tracking-tight px-4 sm:px-6">
                  Support <span className="text-pink-500">NudgePay</span> ❤️
                </motion.h2>
                <motion.p variants={itemVariants} className="text-sm text-slate-500 text-center mb-8 sm:mb-10 leading-relaxed px-4 font-medium max-w-[300px]">
                  Join us in keeping NudgePay free and professional for everyone.
                </motion.p>

                <motion.div variants={itemVariants} className="w-full space-y-6 sm:space-y-8">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Choose an amount</label>
                    <div className="grid grid-cols-3 gap-3">
                      {amounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setSelectedAmount(amt);
                            setIsCustom(false);
                          }}
                          className={`py-4 rounded-2xl font-bold text-lg transition-all border-2 ${
                            selectedAmount === amt && !isCustom 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' 
                              : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Or enter custom amount</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                      <input
                        type="number"
                        placeholder="Other..."
                        value={isCustom ? selectedAmount : ''}
                        onChange={(e) => {
                          setSelectedAmount(e.target.value);
                          setIsCustom(true);
                        }}
                        className={`w-full py-4 pl-10 pr-6 rounded-2xl font-bold border-2 transition-all outline-none ${
                          isCustom 
                            ? 'border-slate-900 bg-white ring-4 ring-slate-900/5' 
                            : 'border-slate-100 bg-slate-50 focus:border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-6 space-y-6">
                    <div className="relative min-h-[150px]">
                      {isPaypalLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
                          <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waking up PayPal...</span>
                        </div>
                      )}
                      <div id="paypal-button-container" ref={paypalContainerRef}></div>
                    </div>
                    
                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>

                    <a 
                      href="https://paypal.me/topzerogroup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-50 hover:border-slate-200 transition-all group"
                    >
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-5 grayscale group-hover:grayscale-0 transition-all" />
                      Direct PayPal.me
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </a>
                  </div>
                </motion.div>

                <motion.p variants={itemVariants} className="mt-12 mb-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] text-center">
                  Secure Cloud Transaction
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
