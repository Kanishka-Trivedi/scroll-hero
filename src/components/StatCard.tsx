import React from 'react';

export interface StatCardData {
  percentage: number;
  label: string;
  bgColor: string;
  textColor: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardData> = ({
  percentage,
  label,
  bgColor,
  textColor,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`stat rounded-[12px] p-[2vw] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-sm ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
    >
      <div className="text-[3.4vw] font-bold tracking-tight leading-none mb-1 flex items-baseline">
        <span className="stat-number inline-block" data-value={percentage}>
          {percentage}
        </span>
        <span className="font-bold text-[3.4vw] ml-0.5">%</span>
      </div>
      <p className="text-[1.07vw] font-medium leading-tight whitespace-nowrap tracking-tight">
        {label}
      </p>
    </div>
  );
};
