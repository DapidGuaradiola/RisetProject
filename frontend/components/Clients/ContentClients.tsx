"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ContentContextType = {
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  activeComment: boolean,
  setActiveComment: (state: boolean) => void,
  isLoading: boolean,
  setIsLoading: (state: boolean) => void,
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export default function ContentClients({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeComment, setActiveComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <ContentContext.Provider value={{ activeIndex, setActiveIndex, activeComment, setActiveComment, isLoading, setIsLoading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
