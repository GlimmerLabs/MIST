import React, {useContext} from "react";
import MISTImage from "./MISTImage";
import {nodeContext} from "../globals/globals-nodes-dimensions.js";

function RenderBox(props) {
  const nodeDimensions = useContext(nodeContext);
  
  return (
      <MISTImage //Mini image that can be seen at the bottom right of the node
        x={(props.type === "val")?
          props.x+nodeDimensions.valueImageBoxOffset+nodeDimensions.imageBoxSideLength/1.5
          : props.x+nodeDimensions.functionImageBoxOffset+nodeDimensions.imageBoxSideLength/1.5
        }
        y={(props.type === "val")?
          props.y+nodeDimensions.valueImageBoxOffset+nodeDimensions.imageBoxSideLength/1.5
          : props.y+nodeDimensions.functionImageBoxOffset+nodeDimensions.imageBoxSideLength/1.5
        }
        width={nodeDimensions.renderSideLength}
        height={nodeDimensions.renderSideLength}
        renderFunction={props.renderFunction}
        automated={true}
      />
  );
}

export default RenderBox;
