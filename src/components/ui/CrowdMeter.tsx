import React from 'react';
import clsx from 'clsx';
import { Activity } from 'lucide-react';

interface CrowdMeterProps {
  status: 'clear' | 'moderate' | 'high' | 'critical';
}

export const CrowdMeter: React.FC<CrowdMeterProps> = ({ status }) => {
  const config = {
    clear: {
      text: 'Gates clear',
      bg: 'bg-green-100',
      text_color: 'text-green-700',
      border: 'border-green-200',
      icon_color: 'text-green-500'
    },
    moderate: {
      text: 'Moderate crowds',
      bg: 'bg-amber-100',
      text_color: 'text-amber-700',
      border: 'border-amber-200',
      icon_color: 'text-amber-500'
    },
    high: {
      text: 'High density — Expect delays',
      bg: 'bg-red-100',
      text_color: 'text-red-700',
      border: 'border-red-200',
      icon_color: 'text-red-500'
    },
    critical: {
      text: 'Critical density — use Gate C',
      bg: 'bg-red-600',
      text_color: 'text-white',
      border: 'border-red-700',
      icon_color: 'text-white'
    }
  };

  const current = config[status];

  return (
    <div className={clsx('flex items-center space-x-3 p-4 rounded-2xl border shadow-sm transition-colors duration-300', current.bg, current.text_color, current.border)}>
      <div className={clsx('bg-white/50 p-2 rounded-full', current.icon_color)}>
        <Activity size={24} />
      </div>
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wide opacity-80">Live Crowd Status</h3>
        <p className="font-medium text-lg">{current.text}</p>
      </div>
    </div>
  );
};
