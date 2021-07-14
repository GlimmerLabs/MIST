import React, { useState, useContext } from "react";
import { Rect, Group, Text } from "react-konva";
import "../../design/styleSheets/FunBar.css";
import { Spring, animated } from "react-spring/renderprops-konva";
import { funBarContext } from "../globals/globals-funbar-dimensions";
import { fontContext } from "../globals/globals-fonts";
import { Html } from 'react-konva-utils';


function FunBar(props) {
  const funBarDimensions = useContext(funBarContext);
  const funBarFontSize = useContext(fontContext).funBarFontSize;
  const funBarRFFontSize = useContext(fontContext).funBarRFFontSize;
  // only here because props isn't recognized from Spring
  const renderFunction = props.renderFunction;
  const [imageButtonHovered, setImageButtonHovered] = useState(false);

  return (
    <Group y={funBarDimensions.funbarY}>
      <BarBase {...props} />
      
      <ImageButton {...props} />
    </Group>
  );

  function BarBase(props) {
    return (
      <Group>
        
        <Rect // Render function white background
          x={funBarDimensions.margin}
          y={funBarDimensions.margin}
          width={funBarDimensions.rfTextAreaWidth}
          height={funBarDimensions.rfTextAreaHeight}
          fill={props.functionBoxBg}
          cornerRadius={8}
          shadowBlur={5}
          shadowOffset={{ x: 2, y: 3 }}
          shadowOpacity={0.5}
          opacity={renderFunction.isRenderable ? 1 : 0.95}
        />
        
        <Html
          transform={true}
          groupProps={{
            position: {
              x: funBarDimensions.margin,
              y: funBarDimensions.margin,
            },
          }}
          >
          <input
          autocomplete="off"
          type="text"
          id="funbar"
          value={props.renderFunction.renderFunction}
          style={{
            width: funBarDimensions.rfTextAreaWidth,
            height: funBarDimensions.rfTextAreaHeight,
            fontFamily: "Trebuchet MS", //not 100% satisfied with this, but we like it better than Courier
            fontSize: funBarRFFontSize,
            border:"none",
            backgroundColor: "transparent",
          }}
          />
        </Html>


      </Group>
    );
  }

  

  function ImageButton(props) {
    const imageButtonColor = "#f7a731"; //change this because it doesn't match the new theme colors the way it is now

    return (
      <Group // Image Button on blue bar
        x={funBarDimensions.imageButtonX}
        y={funBarDimensions.margin}
      >
        <Spring // animates image button fill
          native
          from={{
            fill: imageButtonColor,
          }}
          to={{
            fill:
              props.renderFunction.isRenderable && imageButtonHovered
                ? "white"
                : imageButtonColor,
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              width={funBarDimensions.imageButtonWidth}
              height={funBarDimensions.imageButtonHeight}
              cornerRadius={8}
              shadowBlur={5}
              shadowOffset={{ x: 2, y: 3 }}
              shadowOpacity={0.5}
              opacity={renderFunction.isRenderable ? 1 : 0.8}
            />
          )}
        </Spring>
        <Text
          text={"Image"}
          width={funBarDimensions.imageButtonWidth}
          height={funBarDimensions.imageButtonHeight}
          align={"center"}
          verticalAlign={"middle"}
          fill={imageButtonHovered ? "gray" : "white"}
          fontSize={funBarFontSize}
          onTap={() => {
            if (props.renderFunction.isRenderable) {
              setImageButtonHovered(false);
              props.openPopupCanvas();
            }
          }}
          onClick={() => {
            if (props.renderFunction.isRenderable) {
              setImageButtonHovered(false);
              props.openPopupCanvas();
            }
          }}
          onMouseOver={() => {
            setImageButtonHovered(true);
          }}
          onMouseOut={() => {
            setImageButtonHovered(false);
          }}
        />
      </Group>
    );
  }
}

//ReactDOM.render(<FunBar />, document.getElementById('root'));

export default FunBar;
