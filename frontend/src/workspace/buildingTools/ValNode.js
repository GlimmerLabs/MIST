/**
 * The value nodes in the workspace for MIST.
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
   - outletClicked : function; Listens to clicks on the outlets
   - dblClickHandler : function; Listens to double clicks on the function for generation of 
                       temporary line 
   - removeNode : function; removes node from the workspace

   3. The dragBoundFunc attribute on the group helps keep the value node within the 
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
import { Rect, Group, Text, Image, Circle } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "../globals/mistgui-globals.js";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions.js";
import { globalContext } from "../globals/global-context";
import { fontContext } from "../globals/globals-fonts";
import { Html } from "react-konva-utils";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function ValNode(props) {
  const name = props.name;
  const x = props.x;
  const y = props.y;
  const index = props.index;
  const rep = gui.values[name].rep;
  const [renderFunction, setRenderFunction] = useState(gui.values[name].rep);
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const groupRef = useRef(null);
  const [formValue, setFormValue] = useState("");
  const nodeDimensions = useContext(nodeContext);
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const menuHeight = useContext(globalContext).menuHeight;
  const valueWidth = useContext(globalContext).valueWidth;
  const fonts = useContext(fontContext);
  const [focused, setFocused] = useState(false);
  const isTime = gui.values[name].rep.includes("t.");
  const isMouse = gui.values[name].rep.includes("m.");
  const isConst = gui.values[name].rep === "#";
  
  // +----------------------------+------------------------------------
  // | Trashcan                   |
  // +----------------------------+

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.functionTrashX - valueWidth * 2/3}
        y={nodeDimensions.functionTrashY}
        width={valueWidth/3}
        height={valueWidth/3}
        shadowColor={trashHovered ? "red" : "cyan"}
        shadowBlur={5}
        visible={hovered || !props.draggable}
        onMouseEnter={() => {
          setTrashHovered(true);
        }}
        onMouseLeave={() => {
          setTrashHovered(false);
          setHovered(false);
        }}
        onClick={() => props.removeNode(props.index)}
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
  // | Entire Value Group                     |
  // +----------------------------------------+

  return (
    <Group
      x={x}
      y={y}
      ref={groupRef}
      draggable={props.draggable}
      // helps keep the function nodes in the designated workspace area
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > width - valueWidth) {
          pos.x = width - valueWidth;
        }
        if (pos.y < menuHeight) {
          pos.y = menuHeight;
        }
        if (pos.y > height - funBarHeight - valueWidth) {
          pos.y = height - funBarHeight - valueWidth;
        }
        if (pos.x > width - 270 - valueWidth &&
          pos.y > height-width/7-45 - valueWidth){
            pos.x = width - 270 - valueWidth
          }
        return pos;
      }}
      onDragStart={(e) => {
        e.target.setAttrs({
          shadowOffset: {
            x: 15,
            y: 15,
          },
          scaleX: 1.1,
          scaleY: 1.1,
        });
        props.offRenderBox();
      }}
      onDragEnd={(e) => {
        e.target.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        });
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
          "val",
          e.currentTarget.x(),
          e.currentTarget.y()
        );
        // Updates the x & y coordinates only when the custom node is being dragged
        if(rep === '#'){
          props.updateNodePosition(
            index,
            e.currentTarget.x(),
            e.currentTarget.y()
          );
        }
      }}
      onClick={(e) => {
        props.clickHandler(index);
        props.onImageBox();
      }}
      onTap={() => { 
        props.tapHandler(index);
        props.onImageBox();
      }}
      onDblTap={() => { 
        props.removeNode(index);
        props.onImageBox();
      }}
      onTap={() => { props.tapHandler(index); }}
      onDblTap={() => { props.removeNode(index)}}
    >
      <Group
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
      >
        <Rect
          x={nodeDimensions.valueOffset}
          y={0}
          width={nodeDimensions.valueSideLength}
          height={nodeDimensions.valueSideLength}
          fill={gui.values[name].color}
          cornerRadius={props.imageShowing? 30:10}
          lineJoin={"round"}
          rotation={45}
          strokeWidth={nodeDimensions.functionStrokeWidth}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          stroke={isConst || isTime || isMouse ? "black" : gui.values[name].color}
          strokeWidth={isConst ? valueWidth / 30 : isTime ? valueWidth / 20 : isMouse ? valueWidth / 20 : 0}
          dash={isConst ? [valueWidth /1, 0] : isTime ? [valueWidth / 5, valueWidth / 5] : isMouse ? [valueWidth / 10, valueWidth / 10] : [valueWidth/1,0]}
          // stroke={props.draggable ? gui.values[name].color : 'black'}
          _useStrictMode
        />
        {rep === "#" ?  (
          <Html

          transform={true}
          groupProps={{
            position: {
              x: (nodeDimensions.valueOffset /1.5) - props.x, // I know that it looks weird to have this be undoing the form's
              y: (nodeDimensions.valueOffset /1.5) - props.y, // position values but I swear, the form won't move otherwise.
            },
          }}
        >
          <form
            id="form#"
            style={{
              position: "absolute",
              left: props.x, // again, I know it's counterintuitive but if you're going
              top: props.y,  // to try and fix this, make sure you have it tracked!!
            }}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              if (parseFloat(formValue) !== null) {
                setRenderFunction(formValue);
                props.updateHashValue(index, formValue);
                //setSubmitted(true);
              } else {
                console.log("Invalid Number");
              }
              return false;
            }}
          >
            <label>
              <input
                type="text"
                placeholder="#"
                onFocus={() => {setFocused(true)}}
                onBlur={() => {
                  setFocused(false);
                }}
                onSubmit={() => {setFocused(false)}} // for use when it's an <input> component.
                style={{
                  // resize: "none",              // these were for experimenting with a textarea input
                  // overflow: "auto",
                  // overflowWrap: "break-word",
                  width: focused? "auto" : 0.33 * valueWidth, //(formValue.length < 2) ? (0.33 * valueWidth) : (focused? "auto" : 0.66 * valueWidth),
                  height: (focused? "auto" : 0.29 * valueWidth),
                  backgroundColor: gui.valueConstantColor,
                  border: "none",
                }}
                onChange={(e) => {
                  setFormValue(e.target.value);
                }}
              />
            </label>
          </form>
          {/* <div></div> */}
        </Html>
        ) : (
          <Text
            text={renderFunction}
            fontFamily={fonts.globalFont}
            fill={"black"}
            fontSize={fonts.valueFontSize}
            x={0}
            y={0}
            width={valueWidth}
            height={valueWidth}
            align={"center"}
            verticalAlign={"middle"}
            _useStrictMode
          />
        )}
        <Trashcan />
      </Group>
      <Rect
        onTap={() => {
          props.toggleRenderBox();
        }}
        onClick={() => {
          props.toggleRenderBox();
        }}
        name={"renderBox"}
        x={nodeDimensions.valueImageBoxOffset}
        y={nodeDimensions.valueImageBoxOffset}
        width={nodeDimensions.imageBoxSideLength}
        height={nodeDimensions.imageBoxSideLength}
        fill={props.renderBoxOn? "red" : gui.imageBoxColor}
        shadowColor={"gray"}
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        expanded={false}
        visible={typeof props.renderFunction === "string"} //double check this after merge
      />
      <Circle
        x={valueWidth}
        y={valueWidth/2}
        radius={valueWidth/8}
        fill={"#B3B3B3"}
        onDblClick={(e) => {
          // Generates the temporary line when double clicked
          props.dblClickHandler(index);
        }}
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
  // | Entire Value Group                     |
  // +----------------------------------------+----------------------
}

export default ValNode;
