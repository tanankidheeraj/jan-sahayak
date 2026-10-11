"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  largeText: boolean;
  highContrast: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [largeText, setLargeText] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    const savedLarge = localStorage.getItem("jan_sahayak_largetext") === "true";
    const savedContrast = localStorage.getItem("jan_sahayak_contrast") === "true";
    setLargeText(savedLarge);
    setHighContrast(savedContrast);
    
    if (savedLarge) document.body.classList.add("large-text");
    if (savedContrast) document.body.classList.add("high-contrast");
  }, []);

  const toggleLargeText = () => {
    setLargeText((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("large-text");
      } else {
        document.body.classList.remove("large-text");
      }
      localStorage.setItem("jan_sahayak_largetext", String(next));
      return next;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }
      localStorage.setItem("jan_sahayak_contrast", String(next));
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        toggleLargeText,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
