import React from 'react';

export default function RiskBadge({ level = 'Low', size = 'md' }) {
  const normalized = (level || 'Low').toLowerCase();
  
  const styles = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
    high: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
    critical: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
  };

  const dots = {
    low: 'bg-emerald-500',
    moderate: 'bg-amber-500',
    high: 'bg-rose-500',
    critical: 'bg-purple-500 animate-pulse',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  };

  const currentStyle = styles[normalized] || styles.low;
  const dotColor = dots[normalized] || dots.low;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ring-1 ${currentStyle} ${sizeClasses[size] || sizeClasses.md}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{level}</span>
    </span>
  );
}
