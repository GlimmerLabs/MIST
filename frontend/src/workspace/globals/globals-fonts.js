import React, { createContext } from "react";

export const fontContext = createContext();
// +--------------+--------------------------------------------------
// | FunBar Fonts |
// +--------------+

export function FontGlobals(props) {
  const globalFont = "Arial";
  const menuFont = "Trebuchet MS";
  const funBarFontSize = props.funBarHeight * 0.25;
  const menuTabFontSize = props.width * 0.013;
  const functionFontSize = props.functionWidth * 0.36;
  const valueFontSize = props.valueWidth * 0.37;
  const funBarRFFontSize = props.funBarHeight * 0.32;

  return (
    <fontContext.Provider
      value={{
        globalFont: globalFont,
        menuFont: menuFont,
        funBarFontSize: funBarFontSize,
        menuTabFontSize: menuTabFontSize,
        functionFontSize: functionFontSize,
        valueFontSize: valueFontSize,
        funBarRFFontSize: funBarRFFontSize
      }}
    >
      {props.children}
    </fontContext.Provider>
  );
}
