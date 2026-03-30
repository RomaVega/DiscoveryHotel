import React from "react";

interface StatsStripItem {
  value: React.ReactNode;
  label: React.ReactNode;
}

interface StatsStripProps {
  items: [StatsStripItem, StatsStripItem, StatsStripItem];
}

export function StatsStrip({ items }: StatsStripProps) {
  return (
    <div className="bg-cta-teal py-10 px-6">
      <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/15">
        {items.map((item, i) => (
          <div key={i} className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {item.label}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
