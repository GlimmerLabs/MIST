import React from "react";
import { Layer } from "react-konva";
import FunBar from "../funbar/FunBar";
import colors from "../globals/globals-themes";
import PropTypes from "prop-types";

function FunBarLayer(props) {
  const { renderFunction, theme } = props;
  const backgroundColor = colors.funBarBackground[theme];
  const functionTextColor = (theme === "dark") ? "black" : "black"; // We need to pick different colors in the future.
  const functionBoxBackground = (theme === "dark") ? "darkGray" : "white";
  return (<Layer>
    <FunBar
      bg={backgroundColor}
      functionBoxBg={functionBoxBackground}
      functionTextColor={functionTextColor}
      openImageModal={props.openImageModal}
      renderFunction={renderFunction}
    />
  </Layer>)
}

FunBarLayer.propTypes = {
  theme: PropTypes.number.isRequired,
  renderFunction: PropTypes.shape({
    renderFunction: PropTypes.string.isRequired,
    isRenderable: PropTypes.bool.isRequired
  }).isRequired
}

export default FunBarLayer;