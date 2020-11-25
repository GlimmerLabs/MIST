import React, { useState } from "react";
import { Line, Group, Image } from "react-konva";
import useImage from 'use-image';
 
function Edge(props) {
 
 const [hovered, setHovered] = useState(false);
 const [trashHovered, setTrashHovered] = useState(false);
 const [image] = useImage(require('./trash.png'));
 
 function Trashcan() {
    return <Image
        image={image}
        x={props.sourceX + (props.sinkX - props.sourceX) * (3/5) - 7}
        y={props.sourceY + (props.sinkY - props.sourceY) * (3/5) - 7}
        width={14} height={14}
        shadowColor={trashHovered ? "red" : props.hoverShadowColor}
        shadowBlur={5}
        visible={hovered}
        onMouseEnter={() => {
            setTrashHovered(true);
        }}
        onMouseLeave={() => {
            setTrashHovered(false);
            setHovered(false);
        }}
        onClick={() => props.removeLine(props.index)}
        />;
    }
 
    return (
        <Group
        onTap={() => {setHovered(preHovered => !preHovered)}}
        onMouseEnter={(e) => {
            setHovered(true);
        }}
        onMouseLeave={(e) => {
            setHovered(false);
        }}
        >
        <Line
        points={[
            props.sourceX,
            props.sourceY,
            props.sinkX,
            props.sinkY
        ]}
        pointerLength={0}
        pointerWidth={0}
        stroke={props.fill}
        shadowColor={trashHovered ? "red" : props.hoverShadowColor}
        shadowBlur={5}
        shadowEnabled={hovered}
        strokeWidth={3}
        />
        <Trashcan/>
        </Group>
        )
    }
    export default Edge