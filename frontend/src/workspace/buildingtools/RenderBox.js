import React, {useContext} from "react";
import MISTImage from "./MISTImage";
import {nodeContext} from "../globals/globals-nodes-dimensions.js";

function RenderBox(props) {
  const nodeDimensions = useContext(nodeContext);

  return (
    <MISTImage //Mini image that can be seen at the bottom right of the node
      onTap={props.toggleBox}
      onClick={props.toggleBox}
      x={props.x + (props.type === 'fun'
      ? nodeDimensions.functionImageBoxOffset
      : nodeDimensions.valueImageBoxOffset)}
      y={props.y + (props.type === 'fun'
      ? nodeDimensions.functionImageBoxOffset
      : nodeDimensions.valueImageBoxOffset)}
      width={nodeDimensions.renderSideLength}
      height={nodeDimensions.renderSideLength}
      renderFunction={props.renderFunction}
      automated={false}
    />
  );
}

export default RenderBox;
