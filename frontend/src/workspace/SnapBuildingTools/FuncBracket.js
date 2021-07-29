import React, { useState, useRef, useContext, Component } from "react";
import { Rect, Group, Text, Shape, Image, Circle } from "react-konva";
import Konva from "konva";
import gui from "../globals/mistgui-globals.js";
import { globalContext } from "../globals/global-context";
import { fontContext } from "../globals/globals-fonts";

// contains the state of the function bracket/root, and also all of the information about how to render the function
function FuncBracket(props) {
    const [x, setX] = useState(props.x);
    const [y, setY] = useState(props.y);
    const [isSnapped, setIsSnapped] = useState(false);
    const [hovered, setHovered] = useState(false);
    const maxInputs = 6;
    const funcColor= "#2C9A22";
    const [topCode, setTopCode] = useState("");
    const [parentID, setParentID] = useState(0);
    // parent needs to keep tra
    const [state, setState] = useState({
        code: "trial",
        numChildren: 0,
        children: [null, null, null],

    });
    // function to keep track of total width of bracket = width of side bar + width of children

    // function to keep track of total height of bracket = sum of childrens heights + header height + footer height

    // function to keep track of the ids of the children (stored in an array)? linked list?

    //function to retrieve children ids 

    //function to check if an input is a value or a function (check if it is a function, if not its a val)

    // if function allocate space for new / added inputs (equal to width * height), else const space designated for value

    // each bracket stores an array of how much space is taken up, when you remove a value its removed from the array and deallocated
    
    // within each "food" element we store the height

    //possibly a pointer list? store pointers to each child rather than actually storing them 



    const inputWidth = 40;
    const funcWidth = 150;
    const headerHeight = 2 * funcWidth / 5;
    const footerHeight = funcWidth / 5;
    // const totHeight = headerHeight + state.numChildren * inputWidth + footerHeight;
    const totHeight = headerHeight + (state.numChildren + hovered ? 1 : 0) * inputWidth + footerHeight
    // setPosX() {
    //     this.x = props.getMousePosX();
    // }
    // setPosY() {
    //     this.x = props.getMousePosY();
    // }

    return (

        // NEW FUNCTION BRACKET THING
        // use a ternary operator to render depending on whether it's snapped into something else or not.
        // if the children are rendered only when it's not snapped, we should have it not rendering layer upon layer of data.
        // (isSnapped? (RENDERED AS INPUT) : (RENDERED AS FUNCTION BRACKET))

        <Group
            draggable={props.draggable}
            x={x}
            y={y}
            offsetX={funcWidth / 2}
            offsetY={totHeight / 2}
            onClick={() => { state.numChildren = (state.numChildren + 1) % maxInputs; }}
            onMouseEnter={() => { 
                setHovered(true); 
            }}
            onMouseLeave={() => {
                setHovered(false);
            }}

        >
            <Rect
                // header part
                x={0}
                y={0}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                height={headerHeight}
                width={funcWidth}
                cornerRadius={[funcWidth/20, funcWidth/20, funcWidth/20, 0]}

                fill={funcColor}
                draggable={false}
                stroke={funcColor}
                strokeWidth={1}
            />

            <Rect
                // sidebar part
                x={0}
                y={headerHeight}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                height={(state.numChildren + (hovered ? 1 : 0)) * inputWidth}
                width={funcWidth / 5}
                // cornerRadius={[0, funcWidth/20, funcWidth/20, funcWidth/20]}

                fill={funcColor}
                draggable={false}
                stroke={funcColor}
                strokeWidth={1}
            />


            <Rect
                // footer part
                x={0}
                y={headerHeight + (state.numChildren + (hovered ? 1 : 0)) * inputWidth}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                height={footerHeight}
                width={funcWidth}
                cornerRadius={[0, funcWidth/20, funcWidth/20, funcWidth/20]}
                fill={funcColor}
                draggable={false}
                stroke={funcColor}
                strokeWidth={1}
            />

            <Text
                height={headerHeight}
                fontStyle={{color: "white"}}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                text={state.code}
                draggable={false}

            />


        </Group>
    );


}

export default FuncBracket;