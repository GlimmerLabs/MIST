import React, { createContext } from "react";
import gui from "./mistgui-globals";

export const menuContext1 = createContext();

export function MenuContextProvider1(props) {
  const width = props.width;
  const menuHeight = props.menuHeight;
  const functionWidth = props.functionWidth;
  const valueWidth = props.valueWidth;

  const customTabOffsetX = (width * 1) / 15;

  const formX = 5;

  const formY = menuHeight / 5;

  const formHeight = (menuHeight * 3) / 5;

  const formWidth = width / 4;

  const customTabPoints = {
    topLeft: { x: customTabOffsetX - width, y: 0 },
    topRight: { x: customTabOffsetX + 30, y: 0 },
    point: { x: customTabOffsetX, y: menuHeight / 2 },
    bottomRight: { x: customTabOffsetX - 30, y: menuHeight },
    bottomLeft: { x: customTabOffsetX - width, y: menuHeight },
  };

  // +-----------------+-----------------------------------------------
  // | Value Tab Arrow |
  // +-----------------+

  const valueTabOffsetX = (width * 2) / 15;

  const valueListStartX = 20 + customTabOffsetX;

  const valueMargin = 5;

  const valueListLength = gui.valNames.length * (valueWidth + valueMargin);

  const valueTabPoints = {
    topLeft: { x: valueTabOffsetX - width, y: 0 },
    topRight: { x: valueTabOffsetX + 30, y: 0 },
    point: { x: valueTabOffsetX, y: menuHeight / 2 },
    bottomRight: { x: valueTabOffsetX - 30, y: menuHeight },
    bottomLeft: { x: valueTabOffsetX - width, y: menuHeight },
  };

  // +--------------------+--------------------------------------------
  // | Function Tab Arrow |
  // +--------------------+

  const functionTabOffsetX = (width * 3) / 15;

  const functionListStartX = 20 + valueTabOffsetX;

  const functionMargin = 5;

  const functionListLength =
    gui.funNames.length * (functionWidth + functionMargin);

  const functionTabPoints = {
    topLeft: { x: functionTabOffsetX - width, y: 0 },
    topRight: { x: functionTabOffsetX + 30, y: 0 },
    point: { x: functionTabOffsetX, y: menuHeight / 2 },
    bottomRight: { x: functionTabOffsetX - 30, y: menuHeight },
    bottomLeft: { x: functionTabOffsetX - width, y: menuHeight },
  };

  // +-----------------+-----------------------------------------------
  // | Saved Tab Arrow |
  // +-----------------+

  const savedTabOffsetX = (width * 4) / 15;

  const savedTabPoints = {
    topLeft: { x: savedTabOffsetX - width, y: 0 },
    topRight: { x: savedTabOffsetX + 30, y: 0 },
    point: { x: savedTabOffsetX, y: menuHeight / 2 },
    bottomRight: { x: savedTabOffsetX - 30, y: menuHeight },
    bottomLeft: { x: savedTabOffsetX - width, y: menuHeight },
  };

  return (
    <menuContext1.Provider
      value={{
        //form
        formX: formX,
        formY: formY,
        formHeight: formHeight,
        formWidth: formWidth,
        // values
        valueTabOffsetX: valueTabOffsetX,
        valueListStartX: valueListStartX,
        valueTabPoints: valueTabPoints,
        valueMargin: valueMargin,
        valueListLength: valueListLength,
        // functions
        functionTabOffsetX: functionTabOffsetX,
        functionListStartX: functionListStartX,
        functionTabPoints: functionTabPoints,
        functionMargin: functionMargin,
        functionListLength: functionListLength,
        // custom
        customTabOffsetX: customTabOffsetX,
        customTabPoints: customTabPoints,
        // save
        savedTabOffsetX: savedTabOffsetX,
        savedTabPoints: savedTabPoints,
      }}
    >
      {props.children}
    </menuContext1.Provider>
  );
}
