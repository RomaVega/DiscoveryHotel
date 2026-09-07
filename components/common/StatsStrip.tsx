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
    <div className="bg-deep-teal py-10 px-6">
      <div className="max-w-3xl mx-auto grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0 sm:divide-x divide-white/15">
        {items.map((item, i) => (
          <div key={i} className="min-w-0 text-center px-6 py-4 first:pt-0 last:pb-0 sm:py-0">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/80 mb-1.5">
              {item.label}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white break-words">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
