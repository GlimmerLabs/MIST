import React, { useState, useContext } from "react";
import gui from "../globals/mistgui-globals.js";
import { popupContext } from "../globals/globals-popup_canvas-dimensions";
import MISTImage from "../buildingTools/MISTImage";
import "../../design/styleSheets/FunBar.css";
import { Modal } from "react-bootstrap";
import { saveImage } from '../http.workspace';
import PropTypes from "prop-types";

function ImageModal(props) {
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
      const outerWhiteSpaceStrippedImageName = removeOuterWhiteSpace(imageName);
      if (outerWhiteSpaceStrippedImageName === "") {
        alert('Please enter a title for your image.');
      } else {
        saveImage(outerWhiteSpaceStrippedImageName, props.renderFunction.renderFunction);
      }
    }
    const buttons = [
      { buttonName: 'Exit', buttonOnClick: props.handleClose },
      { buttonName: 'Download' },
      { buttonName: 'Save', buttonOnClick: SaveImage },
      { buttonName: 'Expert' }
    ];

    return (
      <div
        style={{
          position: 'absolute',
          top: popupDimensions.buttonY,
          alignSelf: 'center',
          width: popupDimensions.imageWidth,
          height: popupDimensions.buttonHeight,
        }}>
        {buttons.map((button, index) => (
          <div
            style={{
              backgroundColor: 'white',
              border: "2px solid #008CBA",
              cursor: 'pointer',
              height: popupDimensions.buttonHeight,
              left: (popupDimensions.buttonWidth + popupDimensions.buttonMargin) * index,
              key: button.buttonName,
              position: 'absolute',
              textAlign: 'center',
              width: popupDimensions.buttonWidth,
            }}
            onClick={button.buttonOnClick}>
            {button.buttonName}
          </div>
        ))}
      </div>
    )
  }
}

ImageModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  renderFunction: PropTypes.shape({
    isRenderable: PropTypes.bool.isRequired,
    renderFunction: PropTypes.string.isRequired
  }).isRequired,
  show: PropTypes.bool.isRequired
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

export default ImageModal;