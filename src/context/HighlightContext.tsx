import React, { createContext, useContext, useState } from 'react';

interface HighlightContextProps {
  highlightedComponent: string;
  setHighlightedComponent: React.Dispatch<React.SetStateAction<string>>;
  triggerSidebarTutorial: () => void;
}

const HighlightContext = createContext<HighlightContextProps | undefined>(
  undefined,
);

export const HighlightProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [highlightedComponent, setHighlightedComponent] = useState<string>('');
  const [, setSidebarTutorial] = useState<boolean>(false);

  const triggerSidebarTutorial = () => {
    setSidebarTutorial(true);
  };

  return (
    <HighlightContext.Provider
      value={{
        highlightedComponent,
        setHighlightedComponent,
        triggerSidebarTutorial,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};
