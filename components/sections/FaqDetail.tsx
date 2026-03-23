"use client"; // Uses useState for accordion and useLanguage

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/common/FadeIn";
import type { FaqPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { ChevronDown } from "lucide-react";

interface FaqDetailProps {
  data: FaqPageData;
}

export function FaqDetail({ data }: FaqDetailProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-3xl mx-auto px-6">
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="bg-ivory shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-sans font-semibold text-charcoal text-sm pr-4">
                    {t(item.question)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-stone shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-stone text-sm leading-relaxed">
                        {t(item.answer)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
