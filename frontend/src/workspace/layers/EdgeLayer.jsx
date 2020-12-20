import React from "react";
import { Layer } from "react-konva";
import Edge from "../buildingTools/line";
import colors from "../globals/globals-themes";
import PropTypes from "prop-types";

function EdgeLayer(props) {
  const { edges, theme } = props;
  const fill = colors.lineFill[theme];
  const hoverShadowColor = colors.nodeHoverShadow[theme];

  return (<Layer>
    {edges.length !== 0 &&
      edges.map((line, index) =>
        line && (<Edge
          index={index}
          key={index}
          sourceX={line.headPosition.x}
          sourceY={line.headPosition.y}
          sinkX={line.tailPosition.x}
          sinkY={line.tailPosition.y}
          removeLine={props.removeLine}
          fill={fill}
          hoverShadowColor={hoverShadowColor}
          outletIndex={line.outletIndex}
        />))}
  </Layer>)
}

const positionPropType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
});

EdgeLayer.propTypes = {
  edges: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.shape({
      headPosition: positionPropType.isRequired,
      tailPosition: positionPropType.isRequired,
      outletIndex: PropTypes.number.isRequired
    })
  ])),
  removeLine: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
}

export default EdgeLayer;