"use client"; // Uses hover state for tooltip

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  greeting: string;
}

export function WhatsAppButton({ phone, greeting }: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
    >
      <MessageCircle size={28} />
    </a>
  );
}
