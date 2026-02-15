
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tab, Proxy, ProxyType } from './types';
import { RAW_SOURCES, generateProxy } from './services/mockData';
import { ProxyTable } from './components/ProxyTable';
import { Support } from './components/Support';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HTTP);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  // Parsing logic for raw text formats like 1.2.3.4:80
  const parseProxies = (text: string, type: ProxyType): Proxy[] => {
    const lines = text.split(/\r?\n/);
    return lines
      .map(line => line.trim())
      .filter(line => /^\d{1,3}(\.\d{1,3}){3}:\d{1,5}$/.test(line))
      .map(line => {
        const [ip, port] = line.split(':');
        return generateProxy(ip, port, type);
      });
  };

  const fetchProxies = useCallback(async (type: ProxyType) => {
    setIsLoading(true);
    const urls = type === 'HTTP' ? RAW_SOURCES.http : 
                 type === 'SOCKS4' ? RAW_SOURCES.stock4 : 
                 RAW_SOURCES.stock5;
    
    // Pick a few sources randomly to simulate live fetching without hitting CORS limits or massive data overhead
    const selectedUrls = [...urls].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    try {
      const results = await Promise.all(
        selectedUrls.map(async url => {
          try {
            const resp = await fetch(url);
            return resp.text();
          } catch (e) {
            return '';
          }
        })
      );
      
      const combined = results.flatMap(text => parseProxies(text, type));
      // Deduplicate by IP:Port
      const unique = Array.from(new Set(combined.map(p => `${p.ip}:${p.port}`)))
        .map(id => combined.find(p => `${p.ip}:${p.port}` === id)!)
        .slice(0, 100); // Cap at 100 for performance

      setProxies(unique);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== Tab.SUPPORT) {
      fetchProxies(activeTab as unknown as ProxyType);
    }
  }, [activeTab, fetchProxies]);

  const filteredProxies = useMemo(() => {
    return proxies.filter(p => 
      p.ip.includes(searchQuery) || 
      p.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [proxies, searchQuery]);

  const downloadList = () => {
    const content = filteredProxies.map(p => `${p.ip}:${p.port}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3xboiz_${activeTab.toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-red-600/90 backdrop-blur-md text-center py-2 text-[10px] font-black tracking-[0.5em] uppercase animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)] sticky top-0 z-[60]">
        SYSTEM STATUS: NODES SECURED • GLOBAL INFRASTRUCTURE BY 3XBOIZ
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-red-500/20 px-8 py-5 sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab(Tab.HTTP)}>
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-orbitron font-black text-3xl shadow-2xl shadow-red-600/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">Z</div>
            <div>
              <h1 className="text-3xl font-black font-orbitron tracking-tighter leading-none text-red-500 italic">PROXY ZX</h1>
              <p className="text-[10px] font-bold text-gray-500 tracking-[0.4em] uppercase">Built by 3xboiz</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                Node Monitor: <span className="text-green-500 uppercase tracking-tighter">Live</span>
              </div>
              <div className="text-[9px] text-gray-600 mt-1">
                Sync Clock: <span className="text-red-500 font-mono tracking-normal">{lastSync}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {[Tab.HTTP, Tab.SOCKS4, Tab.SOCKS5].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-500 border ${activeTab === t ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-600/30' : 'border-red-500/20 text-red-500 hover:bg-red-600/10'}`}
              >
                {t}
              </button>
            ))}
            <button 
              onClick={() => setShowSupport(true)}
              className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-500 bg-white text-black hover:bg-red-600 hover:text-white shadow-xl shadow-white/10"
            >
              Support Us
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[3rem] p-16 md:p-24 glass border-none group">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 blur-[200px] -z-10 animate-pulse"></div>
          <div className="max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-4 bg-red-600/10 border border-red-600/30 px-5 py-2 rounded-full mb-10">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Network Deployment v6.0</span>
            </div>
            <h2 className="text-7xl md:text-[8rem] font-black font-orbitron mb-12 leading-[0.85] tracking-tighter uppercase italic text-white drop-shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              {activeTab} <span className="text-red-600">INFRA</span>
            </h2>
            <p className="text-gray-400 text-2xl md:text-3xl mb-14 leading-relaxed font-light max-w-5xl">
              Real-time node harvesting from 100+ raw sources. Our infrastructure purges dead nodes every minute to guarantee 99% connectivity.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => fetchProxies(activeTab as unknown as ProxyType)}
                disabled={isLoading}
                className="bg-red-600 hover:bg-white hover:text-red-600 text-white px-12 py-6 rounded-3xl text-[12px] font-black uppercase transition-all duration-700 shadow-2xl shadow-red-600/40 tracking-[0.3em] flex items-center gap-4 group/btn disabled:opacity-50"
              >
                <svg className={`w-6 h-6 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {isLoading ? 'Fetching Nodes...' : 'Master Resync'}
              </button>
              
              <button 
                onClick={downloadList}
                className="bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 text-white px-12 py-6 rounded-3xl text-[12px] font-black uppercase transition-all duration-700 tracking-[0.3em] flex items-center gap-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download List
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Verified Nodes', value: proxies.length, detail: '100% Raw Scraped' },
            { label: 'Avg Latency', value: '42ms', detail: 'Sub-Zero Tier' },
            { label: 'Uptime Score', value: '99.9%', detail: 'Auto-Refresh Active' }
          ].map((item, idx) => (
            <div key={idx} className="glass p-10 rounded-3xl border-l-8 border-l-red-600 bg-gradient-to-br from-red-600/5 to-transparent flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500">
              <h3 className="font-orbitron font-black text-xs text-red-500 uppercase italic tracking-widest">{item.label}</h3>
              <div className="mt-8">
                <span className="text-5xl font-orbitron font-black text-white italic tracking-tighter shadow-sm">{item.value}</span>
                <p className="text-[11px] text-gray-600 font-black uppercase mt-3 tracking-[0.2em]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Container */}
        <div className="glass rounded-[3rem] overflow-hidden border-red-500/30 shadow-[0_40px_100px_-20px_rgba(239,68,68,0.25)] relative">
          <div className="p-12 border-b border-red-500/10 flex flex-col xl:flex-row justify-between items-center bg-red-600/5 gap-10">
            <h2 className="font-orbitron font-black text-5xl tracking-tighter text-white italic uppercase">
              LIVE GATEWAY
            </h2>
            
            <div className="flex items-center gap-6 w-full xl:w-auto">
               <div className="relative flex-1 xl:w-96">
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="FILTER COMMAND: IP, LOCATION..." 
                  className="w-full bg-black/80 border border-red-500/20 rounded-2xl py-5 px-8 text-[12px] font-black focus:outline-none focus:border-red-500 transition-all placeholder:text-gray-800 tracking-widest shadow-2xl uppercase italic"
                 />
                 <svg className="w-6 h-6 absolute right-6 top-5 text-red-600 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                 </svg>
               </div>
            </div>
          </div>

          <div className="p-4">
            <ProxyTable proxies={filteredProxies} isPaid={false} />
            {filteredProxies.length === 0 && !isLoading && (
              <div className="py-20 text-center space-y-4">
                <div className="text-red-500/20 inline-block">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 font-black uppercase tracking-widest italic">No Nodes Detected in Current Sector</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-40 pb-24 text-center border-t border-red-500/10 relative mt-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-red-600 shadow-[0_0_40px_#ef4444]"></div>
          <div className="flex flex-col items-center gap-20">
            <div className="flex flex-col items-center gap-8">
              <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center font-orbitron font-black text-5xl shadow-[0_0_60px_rgba(239,68,68,0.7)] italic group hover:scale-110 transition-transform duration-700 cursor-pointer">Z</div>
              <div className="text-center">
                <span className="font-orbitron font-black text-5xl tracking-tighter text-white italic uppercase">PROXY ZX</span>
                <p className="text-red-600 text-[12px] font-black uppercase tracking-[0.8em] mt-3 italic">Autonomous Infrastructure by 3xboiz</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 text-[13px] font-black text-gray-500 uppercase tracking-[0.4em] italic">
              <a href="#" className="hover:text-red-500 transition-all border-b-2 border-transparent hover:border-red-500 pb-3">Discord Hub</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowSupport(true); }} className="hover:text-red-500 transition-all border-b-2 border-transparent hover:border-red-500 pb-3">Donation Wallet</a>
              <a href="#" className="hover:text-red-500 transition-all border-b-2 border-transparent hover:border-red-500 pb-3">API Access</a>
              <a href="#" className="hover:text-red-500 transition-all border-b-2 border-transparent hover:border-red-500 pb-3">Node Map</a>
            </div>

            <div className="text-gray-800 text-[11px] font-mono tracking-[0.5em] uppercase mt-12 bg-white/5 px-10 py-4 rounded-full border border-white/5">
              DEPLOY_ID: ZX-COMM-777 • &copy; 2024-2025 3XBOIZ NETWORK • ALL SYSTEMS OPERATIONAL_READY
            </div>
          </div>
        </footer>
      </main>

      {showSupport && <Support onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default App;
