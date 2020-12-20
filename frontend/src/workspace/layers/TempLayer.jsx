import React, { useContext } from "react";
import { Layer } from "react-konva";
import Edge from "../buildingTools/line";
import PropTypes from "prop-types";

function TempLayer({ tempLine }) {
    return (<Layer>
        {tempLine && (
            <Edge
                sourceX={tempLine.sourceX}
                sourceY={tempLine.sourceY}
                sinkX={tempLine.sinkX}
                sinkY={tempLine.sinkY}
                fill={tempLine.fill}
                outletIndex={null}
            />
        )}
    </Layer>)
}

// TempLayer.propTypes = {
//     tempLine: PropTypes.oneOfType([
//         PropTypes.bool,
//         PropTypes.shape({
//             sourceX: PropTypes.number.isRequired,
//             sourceY: PropTypes.number.isRequired,
//             sinkX: PropTypes.number.isRequired,
//             sinkY: PropTypes.number.isRequired,
//             fill: PropTypes.string.isRequired
//         })
//     ]).isRequired,
// }

export default TempLayer;