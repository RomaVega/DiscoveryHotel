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
    <div className="bg-deep-teal px-6 py-6 sm:py-10">
      {/* Mobile: label/value rows — three columns cannot hold a Russian word at this width.
          sm and up: the original three-up centred grid. */}
      <div className="max-w-3xl mx-auto divide-y divide-white/15 sm:grid sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-5 py-3 first:pt-0 last:pb-0 sm:block sm:min-w-0 sm:px-6 sm:py-0 sm:text-center"
          >
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/80 shrink-0 sm:mb-1.5">
              {item.label}
            </p>
            <p className="font-serif text-lg font-light text-white text-right break-words sm:text-xl md:text-2xl sm:text-center">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
