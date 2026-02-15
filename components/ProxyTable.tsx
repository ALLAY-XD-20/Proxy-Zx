
import React from 'react';
import { Proxy } from '../types';
import { StatusBadge } from './StatusBadge';

interface ProxyTableProps {
  proxies: Proxy[];
  isPaid: boolean;
}

export const ProxyTable: React.FC<ProxyTableProps> = ({ proxies, isPaid }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left text-sm border-collapse min-w-[900px]">
        <thead className="text-gray-500 uppercase text-[11px] font-black tracking-[0.2em] border-b border-red-500/20 italic">
          <tr>
            <th className="px-8 py-6 font-black">Node Type</th>
            <th className="px-8 py-6 font-black">Network Address</th>
            <th className="px-8 py-6 font-black">Port</th>
            <th className="px-8 py-6 font-black">Location</th>
            <th className="px-8 py-6 font-black">Latency</th>
            <th className="px-8 py-6 font-black">Health</th>
            <th className="px-8 py-6 font-black">Security</th>
            <th className="px-8 py-6 font-black text-right">Command</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-red-500/5">
          {proxies.map((proxy) => (
            <tr key={proxy.id} className="hover:bg-red-500/[0.05] transition-all duration-300 group">
              <td className="px-8 py-6">
                <span className={`font-mono font-black px-3 py-1.5 rounded-lg text-[10px] uppercase bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]`}>
                  {proxy.type}
                </span>
              </td>
              <td className="px-8 py-6 font-mono font-black text-gray-200 text-[14px] tracking-tighter">
                {proxy.ip}
              </td>
              <td className="px-8 py-6 text-gray-500 font-mono font-bold">
                {proxy.port}
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://flagcdn.com/w20/${proxy.countryCode.toLowerCase()}.png`} 
                    alt={proxy.country} 
                    className="w-5 h-3.5 rounded-sm opacity-90 shadow-sm"
                  />
                  <span className="text-gray-400 font-black text-[11px] uppercase tracking-tighter truncate max-w-[120px]">{proxy.country}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${proxy.speed < 100 ? 'bg-red-500 animate-pulse' : proxy.speed < 300 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`font-black font-orbitron text-[13px] italic ${proxy.speed < 100 ? 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : proxy.speed < 300 ? 'text-green-400' : 'text-yellow-400'}`}>{proxy.speed}ms</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col gap-1.5">
                  <div className="w-20 bg-white/5 h-1.5 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${proxy.quality > 80 ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-red-900'}`} 
                      style={{ width: `${proxy.quality}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600 font-black italic">{proxy.quality}%</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <StatusBadge status={proxy.status} />
              </td>
              <td className="px-8 py-6 text-right">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${proxy.ip}:${proxy.port}`);
                    const btn = document.activeElement as HTMLElement;
                    const original = btn.innerText;
                    btn.innerText = 'COPIED';
                    setTimeout(() => btn.innerText = original, 1000);
                  }}
                  className="bg-red-600 hover:bg-white text-white hover:text-red-600 text-[10px] font-black py-3 px-6 rounded-xl transition-all duration-500 shadow-xl shadow-red-600/30 uppercase tracking-widest italic group-hover:scale-105 active:scale-95"
                >
                  Grab IP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
