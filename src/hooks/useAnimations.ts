"use client";
import { useEffect } from "react";

export function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("obs-show");
            // Optional: uncomment below if animations should only play once
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const elements = document.querySelectorAll(".obs-hide");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
