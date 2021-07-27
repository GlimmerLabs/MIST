import React, { useState, useRef, useContext, Component } from "react";
import { Rect, Group, Text, Shape, Image, Circle } from "react-konva";
import Konva from "konva";
import gui from "../globals/mistgui-globals.js";
import { globalContext } from "../globals/global-context";
import { fontContext } from "../globals/globals-fonts";


function FuncBracket(props) {
    const [x, setX] = useState(props.x);
    const [y, setY] = useState(props.y);
    const [hovered, setHovered] = useState(false);
    const maxInputs = 6;

    const [state, setState] = useState({
        code: "trial",
        numChildren: 0,
        children: [null, null, null],

    });

    


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
                fill="#FFFFFF"
                draggable={false}
                stroke="black"
            />

            <Rect
                // sidebar part
                x={0}
                y={headerHeight}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                height={(state.numChildren + (hovered ? 1 : 0)) * inputWidth}
                width={funcWidth / 5}
                fill="#FFFFFF"
                draggable={false}
                stroke="black"
            />


            <Rect
                // footer part
                x={0}
                y={headerHeight + (state.numChildren + (hovered ? 1 : 0)) * inputWidth}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                height={footerHeight}
                width={funcWidth}
                fill="#FFFFFF"
                draggable={false}
                stroke="black"
            />

            <Text
                height={headerHeight}
                // offsetX={funcWidth / 2}
                // offsetY={totHeight / 2}
                text={x + "," + y}
                draggable={false}
            />


        </Group>
    );


}

export default FuncBracket;