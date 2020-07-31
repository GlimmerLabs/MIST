import React, { useState, useContext, useEffect } from "react";
import { Rect, Group, Text } from "react-konva";
import gui from "./mistgui-globals.js";
import "../design/styleSheets/FunBar.css";
import { Spring, animated } from "react-spring/renderprops-konva";
import PopupCanvas from "./PopupCanvas";
import { funBarContext } from "./globals-funbar-dimensions";
import { globalContext } from "./global-context";
import { fontContext } from "./globals-fonts";

function FunBar(props) {
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const funbarDimensions = useContext(funBarContext);
  const funBarFontSize = useContext(fontContext).funBarFontSize;


  const [functionButtonHovered, setFunctionButtonHovered] = useState(false);
  const [imageButtonClicked, setImageButtonClicked] = useState(false);
  const [imageButtonHovered, setImageButtonHovered] = useState(false);

  return (
    <Group y={funbarDimensions.funbarY}>
      {/* <Rect width={50} height={50} fill={'pink'}/>
      <Text y={100} fill={'blue'} text={funbarDimensions.funbarY}/> */}
      <BarBase {...props} />
      <FunctionButton {...props} />
      <ImageButton {...props} />
    </Group>
  );

  function BarBase(props) {
    return (
      <Group>
        <Rect // Blue bar at bottom of workspace
          x={0}
          y={0}
          width={width}
          height={funBarHeight}
          fill={props.bg}
        />
        <Rect // Render function white background
          x={funbarDimensions.margin}
          y={funbarDimensions.margin}
          width={gui.funBarTextAreaWidth}
          height={funbarDimensions.rfTextAreaHeight}
          fill={props.functionBoxBg}
        />
        <Text // Render function text display
          text={props.renderFunction.renderFunction}
          x={gui.funBarTextOffset}
          y={gui.funBarTextOffset}
          width={gui.funBarTextAreaWidth - gui.funBarTextOffset}
          height={funbarDimensions.rfTextAreaHeight}
          verticalAlign={"middle"}
          fill={props.functionTextColor}
          fontFamily={"Courier New"}
          fontSize={gui.funBarDisplayFontSize}
        />
        <Text // "Save as..." display in blue bar
          text={"Save as..."}
          x={gui.funBarTextAreaWidth + 2 * gui.funBarOffset}
          y={gui.funBarHeight / 2 - funBarFontSize / 2}
          width={gui.funBarWidth * (3 / 25)}
          fill={"white"}
          fontSize={funBarFontSize}
        />
      </Group>
    );
  }

  function FunctionButton(props) {

    return (
      <Group // Function Button on blue bar
        x={funbarDimensions.functionButtonX}
        y={funbarDimensions.margin}
      >
        <Spring // animates function button fill
          native
          from={{
            fill: props.renderFunction.isRenderable ? "orange" : "#f79f6a",
          }}
          to={{
            fill: props.renderFunction.isRenderable
              ? functionButtonHovered
                ? "white"
                : "orange"
              : "#f79f6a",
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              x={0}
              y={0}
              width={funbarDimensions.functionButtonWidth}
              height={funbarDimensions.functionButtonHeight}
              stroke={"#424874"}
              cornerRadius={8}
            />
          )}
        </Spring>
        <Text // function button
          text={"Function"}
          x={0}
          width={funbarDimensions.functionButtonWidth}
          height={funbarDimensions.functionButtonHeight}
          align={"center"}
          verticalAlign={"middle"}
          fill={!functionButtonHovered ? "white" : "grey"}
          fontSize={gui.funBarFontSize}
          onMouseOver={() => {
            setFunctionButtonHovered(true);
          }}
          onMouseOut={() => {
            setFunctionButtonHovered(false);
          }}
        />
      </Group>
    );
  }

  function ImageButton(props) {

    function closePortal() {
      setImageButtonClicked(false);
    }

    return (
      <Group // Image Button on blue bar
        x={funbarDimensions.imageButtonX}
        y={funbarDimensions.margin}
      >
        <Spring // animates image button fill
          native
          from={{
            fill: props.renderFunction.isRenderable ? "orange" : "#f79f6a",
          }}
          to={{
            fill: props.renderFunction.isRenderable
              ? imageButtonHovered
                ? "white"
                : "orange"
              : "#f79f6a",
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              width={funbarDimensions.imageButtonWidth}
              height={funbarDimensions.imageButtonHeight}
              stroke={"#424874"}
              cornerRadius={8}
            />
          )}
        </Spring>
        <Text
          text={"Image"}
          width={funbarDimensions.imageButtonWidth}
          height={funbarDimensions.imageButtonHeight}
          align={"center"}
          verticalAlign={"middle"}
          fill={imageButtonHovered ? "gray" : "white"}
          fontSize={gui.funBarFontSize}
          onClick={() => {
            if (props.renderFunction.isRenderable) {
              setImageButtonClicked(true);
              setImageButtonHovered(false);
            }
          }}
          onMouseOver={() => {
            setImageButtonHovered(true);
          }}
          onMouseOut={() => {
            setImageButtonHovered(false);
          }}
        />
        {imageButtonClicked && (
          <Group>
          <PopupCanvas
            {...props}
            x={-funbarDimensions.imageButtonX}
            y={-(height - funBarHeight - funbarDimensions.margin)}
            closePortal={closePortal}
          />
          </Group>
        )}
      </Group>
    );
  }
}

export default FunBar;
