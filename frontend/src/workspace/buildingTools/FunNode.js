/**
 * The function nodes in the workspace for MIST.
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

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/* 1. The trashcan function creates a trashcan icon on the top left of the function node. The onClick
      attrribute on that deletes the node from the workspace

   2. Props received from the workspace contain the following:
   - name : String; name of the node
   - key : int; unique key attribute 
   - index : int; index of the ndoe
   - x : int; x coordinate
   - y : int; y coordinate 
   - offsetX : int; to account for the shift in the x-coordinate 
   - offsetY : int; to account for the shift in the y-coordinate
   - numInputs : int; number of lines coming into the node
   - numOutlets : int; number of outlets of the node
   - renderFunction : String; the expression in the node
   - updateNodePosition : function; Updates node position in the workspace
   - updateLinePosition : function; Updates line position in the workspace
   - funClicked : function; Listens to clicks on the node
   - outletClicked : function; Listens to clicks on the outlets
   - dblClickHandler : function; Listens to double clicks on the function for generation of 
                       temporary line 
   - removeNode : function; removes node from the workspace
   - hoverShadowColor : String; changes hover color based on theme

   3. The dragBoundFunc attribute on the group helps keep the function node within the 
      boundaries of the workspace. 

   4. UseStrictMode is a good react-konva practice.
  

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState, useRef, useContext } from "react";
import { Rect, Group, Text, Shape, Image, Circle } from "react-konva";
import Konva from "konva";
import gui from "../globals/mistgui-globals.js";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions.js";
import { globalContext } from "../globals/global-context";
import { fontContext } from "../globals/globals-fonts";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

export default function FunNode(props) {
  const name = props.name;
  const index = props.index;
  const x = props.x;
  const y = props.y;
  const rep = gui.functions[name].rep;
  const numOutlets = props.numOutlets;
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const groupRef = useRef(null);
  const nodeDimensions = useContext(nodeContext);
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const menuHeight = useContext(globalContext).menuHeight;
  const functionWidth = useContext(globalContext).functionWidth;
  const fonts = useContext(fontContext);
  const [onDrag, setOnDrag] = useState(false);
  const bezPoint = width / 50;

  // +----------------------------+------------------------------------
  // | Trashcan                   |
  // +----------------------------+

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.functionTrashX-5}
        y={nodeDimensions.functionTrashY}
        width={functionWidth/3}
        height={functionWidth/3}
        shadowColor={trashHovered ? "red" : "cyan"}
        shadowBlur={5}
        visible={hovered || !props.draggable} //Only visible when hovering over node
        onMouseEnter={() => {
          setTrashHovered(true);
        }}
        onMouseLeave={() => {
          setTrashHovered(false);
          setHovered(false);
        }}
        onClick={() => props.removeNode(props.index)} //Removes the node from the workspace
        // onTouchStart gets around the fact that we are using the 
        // stage to detect onTouchEnd
        onTouchEnd={() => props.removeNode(props.index)}
      />
    );
  }

  // +----------------------------+
  // | Trashcan                   |
  // +----------------------------+------------------------------------

  // +----------------------------------------+------------------------
  // | Entire Function Group                  |
  // +----------------------------------------+

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable={props.draggable}
      // helps keep the function nodes in the designated workspace area
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > width - functionWidth) {
          pos.x = width - functionWidth;
        }
        if (pos.y < menuHeight) {
          pos.y = menuHeight;
        }
        if (pos.y > height - funBarHeight - functionWidth) {
          pos.y = height - funBarHeight - functionWidth;
        }
        return pos;
      }}
      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
          shadowOffset: {
            x: 5,
            y: 5,
          },
          shadowBlur: 6,
          scaleX: 1.1,
          scaleY: 1.1,
        });
        if (props.renderFunction && props.imageShowing) {
          props.toggleBox();
          setOnDrag(true);
        }
      }}
      onDragEnd={(e) => {
        e.target.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
        });
        if (props.renderFunction && onDrag) {
          props.toggleBox();
        }
        // Updates the x & y coordinates once the node has stopped dragging
        props.updateNodePosition(
          index,
          e.currentTarget.x(),
          e.currentTarget.y()
        );
      }}
      onDragMove={(e) => {
        // Updates the line position dynamically while the node is being dragged
        props.updateLinePosition(
          index,
          "fun",
          e.currentTarget.x(),
          e.currentTarget.y()
        );
      }}
      onClick={(e) => {
        if (e.target.attrs.name) {
          props.outletClicked(
            index,
            parseInt(e.target.attrs.name.substring(6)) - 1
          );
        } else {
          props.funClicked(index);
        }
      }}
      onDblClick={() => {
        // Generates the temporary line when double clicked
        props.dblClickHandler(index);
      }}

      onTap={() => props.tapHandler(index)}
      onTouchEnd={(e) => {
        if (e.target.attrs.name) {
          props.outletClicked(
            index,
            parseInt(e.target.attrs.name.substring(6)) - 1
          );
        } else {
          props.funClicked(index);
        }
      }}
    >
      <Group
        onMouseEnter={(e) => {
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1.1,
              scaleY: 1.1,
            });
            return 0;
          });
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1,
              scaleY: 1,
            });
            return 0;
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={functionWidth}
          height={
            props.numOutlets <= 3
              ? functionWidth
              : functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          fill={gui.functions[name].color}
          cornerRadius={10}
          shadowColor={
            hovered ? (trashHovered ? "red" : props.hoverShadowColor) : "black"
          }
          shadowOffset={{ x: hovered ? 0 : 1, y: hovered ? 0 : 1 }}
          shadowBlur={3}
          _useStrictMode
          stroke={props.draggable ? gui.functions[name].color : 'black'}
        />
        <Text
          text={rep}
          fontFamily={fonts.globalFont}
          fill={"white"}
          fontSize={fonts.functionFontSize}
          x={0}
          y={0}
          width={functionWidth}
          height={
            props.numOutlets <= 3
              ? functionWidth
              : functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          align={"center"}
          verticalAlign={"middle"}
          _useStrictMode
        />
        <Trashcan />
      </Group>
      <Rect
        onTap={() => {
          if (props.renderFunction) {
            props.toggleBox();
          }
        }}
        onClick={() => {
          if (props.renderFunction) {
            props.toggleBox();
          }
        }}
        name={"imageBox"}
        x={nodeDimensions.functionImageBoxOffset}
        y={
          props.numOutlets <= 3
            ? nodeDimensions.functionImageBoxOffset
            : nodeDimensions.functionImageBoxOffset +
              (props.numOutlets - 3) * nodeDimensions.outletYOffset
        }
        width={nodeDimensions.imageBoxSideLength}
        height={nodeDimensions.imageBoxSideLength}
        fill={gui.imageBoxColor}
        shadowColor={"gray"}
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        expanded={false}
        visible={typeof props.renderFunction === "string"}
      />
      {name === "rgb"
        ? ["red", "green", "blue"].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -bezPoint,
                  -bezPoint,
                  -bezPoint,
                  bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              key={i} // to silence a warning
              x={nodeDimensions.outletXOffset}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: 0 }}
              fillRadialGradientStartRadius={8}
              fillRadialGradientEndPoint={{ x: -15, y: 0 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[
                0,
                "#B3B3B3",
                0,
                u
              ]}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.07,
                  scaleY: 1.07,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
          ))
        : [...Array(numOutlets)].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -bezPoint,
                  -bezPoint,
                  -bezPoint,
                  bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              x={nodeDimensions.outletXOffset}
              key={i}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: 0 }}
              fillRadialGradientStartRadius={8}
              fillRadialGradientEndPoint={{ x: -15, y: 0 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[
                0,
                '#B3B3B3',
                0,
                gui.functions[name].color,
              ]}
              opacity = {1}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.07,
                  scaleY: 1.07,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onTouchMove={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
            
          ))}
          <Circle
            x={functionWidth*1.1}
            y={functionWidth/2}
            radius={functionWidth/8}
            fill={"#B3B3B3"}
            onDblClick={(e) => {
                // Generates the temporary line when double clicked
                props.dblClickHandler(index);
            }}
            opacity={
              name==="rgb" ? 0:1
            }
            shadowColor={
              hovered ? (trashHovered ? "red" : props.hoverShadowColor) : "black"
            }
            shadowOffset={{ x: hovered ? 0 : 1, y: hovered ? 0 : 1 }}
            shadowBlur={3}
            onMouseEnter={(e) => {
            groupRef.current.children.map((u, i) => {
              u.to({
                duration: 0.5,
                easing: Konva.Easings.ElasticEaseOut,
                scaleX: 1.07,
                scaleY: 1.07,
              });
              return 0;
            });
            setHovered(true);
            }}
            onMouseLeave={(e) => {
              setHovered(false);
              groupRef.current.children.map((u, i) => {
                u.to({
                  duration: 0.5,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                });
                return 0;
              });
            }}
          />
    </Group>
  );
  // +----------------------------------------+
  // | Entire Function Group                  |
  // +----------------------------------------+----------------------
}