import React, { createContext } from "react";

export const funBarContext = createContext();

export function FunBarDimensions(props) {
  const funbarY = props.height - props.funBarHeight;

  const margin = props.width * 0.02;

  const rfTextAreaWidth = props.width * 0.7;
  const rfTextAreaHeight = props.funBarHeight * 0.5;

  const functionButtonX = margin + rfTextAreaWidth + margin;
  const functionButtonWidth = (props.width - 4 * margin - rfTextAreaWidth) / 2;
  const functionButtonHeight = props.funBarHeight * 0.5;

  const imageButtonX = functionButtonX + functionButtonWidth + margin;
  const imageButtonWidth = functionButtonWidth;
  const imageButtonHeight = props.funBarHeight * 0.5;

  return(
      <funBarContext.Provider
        value={{
            funbarY: funbarY,
            margin: margin,
            rfTextAreaWidth: rfTextAreaWidth,
            rfTextAreaHeight: rfTextAreaHeight,
            functionButtonX: functionButtonX,
            functionButtonWidth: functionButtonWidth,
            functionButtonHeight: functionButtonHeight,
            imageButtonX: imageButtonX,
            imageButtonWidth: imageButtonWidth,
            imageButtonHeight: imageButtonHeight,
        }}
        >
            {props.children}
        </funBarContext.Provider>
  )
}
