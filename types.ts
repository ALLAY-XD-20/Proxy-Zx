
export type ProxyType = 'HTTP' | 'SOCKS4' | 'SOCKS5';
export type AnonymityLevel = 'Elite' | 'Anonymous' | 'Transparent';
export type ProxyStatus = 'Active' | 'Dead' | 'Slow';

export interface Proxy {
  id: string;
  type: ProxyType;
  ip: string;
  port: string;
  country: string;
  countryCode: string;
  speed: number; // in ms
  quality: number; // 0-100
  anonymity: AnonymityLevel;
  status: ProxyStatus;
}

export enum Tab {
  HTTP = 'HTTP',
  SOCKS4 = 'SOCKS4',
  SOCKS5 = 'SOCKS5',
  SUPPORT = 'SUPPORT'
}

export interface ProxySource {
  type: ProxyType;
  urls: string[];
}
