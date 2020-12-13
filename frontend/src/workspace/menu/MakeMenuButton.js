/**
 * This file creates the Menu Bar and calls subsequent create nodes files.
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

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState } from "react";
import { Group, Text } from "react-konva";
import gui from "../globals/mistgui-globals.js";
import { Spring, animated } from "react-spring/renderprops-konva";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

/**
 * Makes one of those "Reset Workspace", "Open Workspace", and "Save Workspace" buttons
 * @param {*} props
 */
function MakeMenuButton(props) {
  const [hovered, setHover] = useState(false);

  return (
    <Group
      x={props.x}
      y={props.y}
      onClick={props.handleClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Spring // animates the fill color change
        from={{ fill: props.buttonColor }}
        to={{ fill: hovered ? "orange" : props.buttonColor }}
      >
        {(props) => (
          <animated.Rect // rectangle of the button
            {...props}
            x={5}
            y={0}
            width={gui.menuCornerWidth - 2 * gui.menuOffset}
            height={gui.menuControlHeight}
            shadowColor={"black"}
            shadowEnabled={false}
            cornerRadius={15}
          />
        )}
      </Spring>
      <Text
        x={0}
        y={gui.menuTextOffset}
        width={gui.menuCornerWidth - 2 * gui.menuOffset}
        height={gui.menuControlHeight}
        text={props.text}
        align={"center"}
        fill={"white"}
        fontFamily={gui.globalFont}
        fontSize={gui.menuFontSize}
      />
    </Group>
  );
}

export default MakeMenuButton;
