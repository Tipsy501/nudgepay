/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface AdPlaceholderProps {
  type: 'leaderboard' | 'rectangle' | 'vertical';
  label?: string;
}

export default function AdPlaceholder({ type, label = 'Advertisement' }: AdPlaceholderProps) {
  const styles = {
    leaderboard: 'w-full h-[90px]',
    rectangle: 'w-full h-[250px]',
    vertical: 'w-full h-[400px]',
  };

  return (
    <div className={`${styles[type]} bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all shadow-sm`}>
      <div className="absolute top-0 left-0 px-3 py-1 bg-gray-50 text-[10px] font-black text-slate-300 uppercase tracking-widest rounded-br-xl">
        {label}
      </div>
      
      <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-12 h-12 border-2 border-slate-200 rounded-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-slate-200 rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Integration</span>
      </div>
    </div>
  );
}
