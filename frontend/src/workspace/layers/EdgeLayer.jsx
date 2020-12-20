import React from "react";
import { Layer } from "react-konva";
import Edge from "../buildingTools/line";
import PropTypes from "prop-types";

function EdgeLayer(props) {
    const { edges, fill, hoverShadowColor } = props;
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
    fill: PropTypes.string.isRequired,
    hoverShadowColor: PropTypes.string,
    removeLine: PropTypes.func.isRequired
}
export default EdgeLayer;