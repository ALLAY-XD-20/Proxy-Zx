
import React, { useState } from 'react';
import { CRYPTO_ADDRESSES } from '../services/mockData';

interface SupportProps {
  onClose: () => void;
}

export const Support: React.FC<SupportProps> = ({ onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative glass p-10 md:p-14 rounded-[3rem] border-red-500/30 w-full max-w-2xl shadow-[0_0_100px_rgba(239,68,68,0.2)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-transparent to-red-600"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="text-center space-y-6 mb-12">
          <h2 className="text-5xl font-black font-orbitron text-white italic tracking-tighter uppercase leading-none">SUPPORT <span className="text-red-600">3XBOIZ</span></h2>
          <p className="text-gray-400 text-lg leading-relaxed font-light">Your support keeps our proxy infrastructure running at maximum speed. Donate to keep the nodes alive.</p>
        </div>

        <div className="space-y-8">
          {/* Solana */}
          <div className="glass p-8 rounded-[2rem] border-red-500/10 group hover:border-red-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
                  <span className="font-black text-xl italic">S</span>
                </div>
                <div>
                  <h3 className="font-orbitron font-black text-white uppercase italic tracking-widest text-sm">Solana (SOL)</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Instant Activation</p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(CRYPTO_ADDRESSES.sol, 'sol')}
                className={`text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all ${copied === 'sol' ? 'bg-green-500 text-white' : 'bg-red-600 text-white hover:bg-white hover:text-red-600'}`}
              >
                {copied === 'sol' ? 'Copied!' : 'Copy Address'}
              </button>
            </div>
            <p className="text-[11px] text-gray-300 font-mono break-all p-4 bg-black/40 rounded-xl border border-white/5 font-bold tracking-tighter">
              {CRYPTO_ADDRESSES.sol}
            </p>
          </div>

          {/* Litecoin */}
          <div className="glass p-8 rounded-[2rem] border-red-500/10 group hover:border-red-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
                  <span className="font-black text-xl italic">L</span>
                </div>
                <div>
                  <h3 className="font-orbitron font-black text-white uppercase italic tracking-widest text-sm">Litecoin (LTC)</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Stable Network</p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(CRYPTO_ADDRESSES.ltc, 'ltc')}
                className={`text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all ${copied === 'ltc' ? 'bg-green-500 text-white' : 'bg-red-600 text-white hover:bg-white hover:text-red-600'}`}
              >
                {copied === 'ltc' ? 'Copied!' : 'Copy Address'}
              </button>
            </div>
            <p className="text-[11px] text-gray-300 font-mono break-all p-4 bg-black/40 rounded-xl border border-white/5 font-bold tracking-tighter">
              {CRYPTO_ADDRESSES.ltc}
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Infrastructure Powered by 3xboiz Network</p>
        </div>
      </div>
    </div>
  );
};
