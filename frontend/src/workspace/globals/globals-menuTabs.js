import React, { createContext } from "react";

export const menuTabsContext = createContext();

export function MenuTabsContextProvider(props) {
  return (
    <menuTabsContext.Provider
      value={{
        isValueMenuOpen: props.isValueMenuOpen,
        isFunctionMenuOpen: props.isFunctionMenuOpen,
        isCustomMenuOpen: props.isCustomMenuOpen,
        isSavedMenuOpen: props.isSavedMenuOpen,
        isSettingsMenuOpen: props.isSettingsMenuOpen,
      }}
    >
      {props.children}
    </menuTabsContext.Provider>
  );
}
