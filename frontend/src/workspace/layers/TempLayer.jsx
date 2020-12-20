/**
 * This is the layer for the temporary line.
 *
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
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

TempLayer.propTypes = {
  tempLine: PropTypes.oneOfType([
    PropTypes.shape({
      sourceX: PropTypes.number.isRequired,
      sourceY: PropTypes.number.isRequired,
      sinkX: PropTypes.number.isRequired,
      sinkY: PropTypes.number.isRequired,
      fill: PropTypes.string.isRequired
    })
  ])
}

export default TempLayer;