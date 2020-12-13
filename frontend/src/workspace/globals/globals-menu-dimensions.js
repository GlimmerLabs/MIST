import React, { createContext } from "react";

export const menuContext = createContext();

export function MenuContextProvider(props) {

    const totalMenuHeight = props.menuHeight;
    const mainMenuHeight = totalMenuHeight * .73;
    const menuTabHeight = totalMenuHeight * .27;

    const valueMargin = props.valueWidth / 10;
    const functionMargin = props.functionWidth / 10;
    const settingsMargin = functionMargin;

    const settingsWidth = props.width * 0.08;
  
  return (
    <menuContext.Provider
      value={{
        totalMenuHeight: totalMenuHeight,
        mainMenuHeight: mainMenuHeight,
        menuTabHeight: menuTabHeight,
        valueMargin: valueMargin,
        functionMargin: functionMargin,
        settingsMargin: settingsMargin,
        settingsWidth: settingsWidth,
      }}
    >
      {props.children}
    </menuContext.Provider>
  );
}
