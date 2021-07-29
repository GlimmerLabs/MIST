import React, { createContext } from "react";

export const funBarContext = createContext();

export function FunBarDimensions(props) {
  const funbarY = props.height - props.funBarHeight - 15;

  const margin = props.width * 0.02;

  const rfTextAreaWidth = props.width * 0.6;
  const rfTextAreaHeight = props.funBarHeight * 0.5;

  const imageButtonX = margin + rfTextAreaWidth + margin;
  const imageButtonWidth = (props.width - 12 * margin - rfTextAreaWidth);
  const imageButtonHeight = props.funBarHeight * 0.5;

  const imagePlaceX = margin + imageButtonX + imageButtonWidth;

  return(
      <funBarContext.Provider
        value={{
            funbarY: funbarY,
            margin: margin,
            rfTextAreaWidth: rfTextAreaWidth,
            rfTextAreaHeight: rfTextAreaHeight,
            imageButtonX: imageButtonX,
            imageButtonWidth: imageButtonWidth,
            imageButtonHeight: imageButtonHeight,
            imagePlaceX: imagePlaceX,
        }}
        >
            {props.children}
        </funBarContext.Provider>
  )
}
