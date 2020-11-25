import React, { useState, useContext } from "react";
import Portal from "../buildingtools/Portal";
import { Rect, Group, Text } from "react-konva";
import gui from "../globals/mistgui-globals.js";
import { globalContext } from "../globals/global-context";
import { popupContext } from "../globals/globals-popup_canvas-dimensions";
import MISTImage from "../buildingtools/MISTImage";
import "../../design/styleSheets/FunBar.css";
import { Modal } from "react-bootstrap";
import { imageExists, saveImage, saveImage2 } from '../http.workspace';


function PopupCanvas(props) {
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const popupDimensions = useContext(popupContext);
  const [imageName, setImageName] = useState("");

  return (
    <Modal show={props.show}>
      <Background {...props} />
      {PortalTextBox(props)}
      <PortalImage {...props} />
      <PortalFunction {...props} />
      <Buttons {...props} />
    </Modal>
  );

  function Background(props) {
    return (
      <div
        style={{
          position: "absolute",
          alignSelf: 'center',
          top: props.top + popupDimensions.canvasY,
          width: popupDimensions.canvasWidth,
          height: popupDimensions.canvasHeight,
          backgroundColor: "white",
          opacity: "0.85",
          borderRadius: 30,
        }}
      />
    );
  }

  function PortalTextBox(props) {
    return (
      <div // Text box: "Enter Name of Image"
        style={{
          position: "absolute",
          alignSelf: 'center',
          top: props.top + popupDimensions.textfieldY,
          fontSize: gui.popTextFontSize,
          fontFamily: gui.functionFont,
          width: popupDimensions.textfieldWidth,
          height: popupDimensions.textfieldHeight,
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <input
          type={"text"}
          placeholder={"Enter Name Of Image"}
          value={imageName}
          style={{
            width: popupDimensions.textfieldWidth,
            height: popupDimensions.textfieldHeight,
            border: "2px solid #008CBA",
            textAlign: "center",
          }}
          onChange={(e) => setImageName(e.target.value)}
        />
      </div>
    );
  }

  function PortalImage(props) {
    return (
      <div style={{
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: props.top + popupDimensions.imageY,
      }}>
        <MISTImage
          x={-popupDimensions.imageWidth / 2}
          y={0}
          width={popupDimensions.imageWidth}
          height={popupDimensions.imageHeight}
          renderFunction={props.renderFunction.renderFunction}
          automated={true}
        />
      </div>
    );
  }

  function PortalFunction(props) {
    return (
      <div
        style={{
          position: "absolute",
          alignSelf: 'center',
          top: props.top + popupDimensions.rfTextY,
          fontSize: 20,
          textAlign: "center",
          verticalAlign: "middle",
          width: popupDimensions.rfTextWidth,
          height: popupDimensions.rfTextHeight,
          overflow: "auto",
          fill: "#FFF",
          stroke: "#000",
        }}
      >
        <p
          style={{
            width: popupDimensions.rfTextWidth,
            height: popupDimensions.rfTextHeight,
            verticalAlign: "middle",
          }}
        >
          {props.renderFunction.renderFunction}
        </p>
      </div>
    );
  }

  function Buttons(props) {

    async function SaveImage() {
      if (imageName === "") {
        alert('Please enter a title for your image.');
      } else {
        saveImage2(imageName, props.renderFunction.renderFunction);
      }
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: popupDimensions.buttonY,
          alignSelf: 'center',
          width: popupDimensions.imageWidth,
          height: popupDimensions.buttonHeight,
          backgroundcolor: 'green'
        }}>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: 0,
            width: popupDimensions.buttonWidth,
            height: popupDimensions.buttonHeight,
            backgroundColor: 'white',
            border: "2px solid #008CBA",
            textAlign: 'center',
          }}
          onClick={props.closePortal}>
          Exit
          </div>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: popupDimensions.buttonWidth + popupDimensions.buttonMargin,
            width: popupDimensions.buttonWidth,
            height: popupDimensions.buttonHeight,
            backgroundColor: 'white',
            border: "2px solid #008CBA",
            textAlign: 'center',
          }}
        //onClick={}
        >
          Download
          </div>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: (popupDimensions.buttonWidth + popupDimensions.buttonMargin) * 2,
            width: popupDimensions.buttonWidth,
            height: popupDimensions.buttonHeight,
            backgroundColor: 'white',
            border: "2px solid #008CBA",
            textAlign: 'center',
          }}
          onClick={SaveImage}
        >
          Save
          </div>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: (popupDimensions.buttonWidth + popupDimensions.buttonMargin) * 3,
            width: popupDimensions.buttonWidth,
            height: popupDimensions.buttonHeight,
            backgroundColor: 'white',
            border: "2px solid #008CBA",
            textAlign: 'center',
          }}
        //onClick={}
        >
          Expert
          </div>
      </div>
    )
  }
}



/**
 * removeOuterWhiteSpace takes a string and removes white space at the beginning and end
 * of the string, but not the white space in the middle of the string.
 * returns a string
 */
var removeOuterWhiteSpace = function (string) {
  string = string.replace(/^ */, "");
  string = string.replace(/ *$/, "");
  return string;
};

export default PopupCanvas;
