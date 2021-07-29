//import { width, functionWidth, valueWidth } from "./globals.js";

import React, { createContext } from "react";

export const nodeContext = createContext();

export function NodeContextProvider(props) {
  // +----------------+------------------------------------------------
  // | Function Nodes |
  // +----------------+

  const functionTrashX = (props.functionWidth * 4) / 5;

  const functionTrashY = (-props.functionWidth * 1) / 20;

  // Horizontal offset of an outlet
  const outletXOffset = props.functionWidth / 20;

  // Vertical space between outlets
  const outletYOffset = props.functionWidth / 4;

  // Offset of the first outlet in relation to a node group
  const outletStartY = (props.functionWidth - 2 * outletYOffset) / 2;

  // Offset of the image render box in relation to the function group (Konva <Group/>).
  const functionImageBoxOffset = (props.functionWidth * 6) / 7;

  // +-------------+---------------------------------------------------
  // | Value Nodes |
  // +-------------+

  const valueOffset = props.valueWidth / 2;

  const valueSideLength = valueOffset * 1.414; // 1.414 === √2

  const valueTrashX = (props.valueWidth * 1) / 20;

  const valueTrashY = (props.valueWidth * 1) / 21;

  // Offset of the image render box in relation to the value group.
  const valueImageBoxOffset = (props.valueWidth * 2) / 3;

  // +-----------+-----------------------------------------------------
  // | All Nodes |
  // +-----------+

  // side length of the image render box when not expanded
  const imageBoxSideLength = props.width / 80;

  // side length of the image render box when expanded
  const renderSideLength = props.width / 24;

  return (
    <nodeContext.Provider
      value={{
        // function nodes
        outletXOffset: outletXOffset,
        outletYOffset: outletYOffset,
        outletStartY: outletStartY,
        functionTrashX: functionTrashX,
        functionTrashY: functionTrashY,
        functionImageBoxOffset: functionImageBoxOffset,
        // value nodes
        valueSideLength: valueSideLength,
        valueOffset: valueOffset,
        valueTrashX: valueTrashX,
        valueTrashY: valueTrashY,
        valueImageBoxOffset: valueImageBoxOffset,
        // all nodes
        imageBoxSideLength: imageBoxSideLength,
        renderSideLength: renderSideLength,
      }}
    >
      {props.children}
    </nodeContext.Provider>
  );
}
