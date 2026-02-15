
import React from 'react';
import { ProxyStatus } from '../types';

interface StatusBadgeProps {
  status: ProxyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    Active: 'bg-green-500/10 text-green-500 border-green-500/20',
    Dead: 'bg-red-500/10 text-red-500 border-red-500/20',
    Slow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};
