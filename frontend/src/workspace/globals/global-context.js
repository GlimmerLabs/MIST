import React, { createContext } from "react";

export const globalContext = createContext();

export function GlobalContextProvider(props) {
    

    return (
      <globalContext.Provider
      value={{
          width: props.width,
          height: props.height,
          menuHeight: props.menuHeight,
          funBarHeight: props.funBarHeight,
          functionWidth: props.functionWidth,
          valueWidth: props.valueWidth,
        }}>
        {props.children}
      </globalContext.Provider>
    );
  }