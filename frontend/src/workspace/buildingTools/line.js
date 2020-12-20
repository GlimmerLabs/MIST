import React, { useState, useContext } from "react";
import { Line, Group, Image } from "react-konva";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions";

export default function Edge(props) {
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const nodeDimensions = useContext(nodeContext);
  const sinkX = props.sinkX - (props.outletIndex == null ? 0 : nodeDimensions.outletXOffset * 2);
  const sinkY = props.sinkY +
  (props.outletIndex == null ? 0 : nodeDimensions.outletStartY +
  props.outletIndex * nodeDimensions.outletYOffset);

  function Trashcan() {
    return (
      <Image
        image={image}
        x={props.sourceX + (sinkX - props.sourceX) * (3 / 5) - 7}
        y={props.sourceY + (sinkY - props.sourceY) * (3 / 5) - 7}
        width={14}
        height={14}
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
        onTap={() => props.removeLine(props.index)}
      />
    );
  }

  return (
    <Group
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
          sinkX,
          sinkY,
        ]}
        pointerLength={0}
        pointerWidth={0}
        stroke={props.fill}
        shadowColor={trashHovered ?  props.hoverShadowColor : "red"}
        shadowBlur={5}
        shadowEnabled={hovered}
        strokeWidth={3}
        onTap={() => {
          setHovered(prevHovered => !prevHovered);
        }}
        onDblTap={() => props.removeLine(props.index)}
      />
      <Trashcan />
    </Group>
  );
}
