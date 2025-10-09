"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpFromDot } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="secondary"
      size="icon"
      className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full bg-background border border-border hover:bg-accent transition-colors"
      aria-label="Back to top"
    >
      <ArrowUpFromDot className="h-5 w-5" />
    </Button>
  );
}
