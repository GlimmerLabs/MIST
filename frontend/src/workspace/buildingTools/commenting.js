import React, { useState, useContext } from "react";
import { Line, Group, Image, Text } from "react-konva";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions";
import { globalContext } from "../globals/global-context";
export default function Comment(props) {
  const name = props.name;
  const index = props.index;
  const x = props.x;
  const y = props.y;
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const menuHeight = useContext(globalContext).menuHeight;
  const functionWidth = useContext(globalContext).functionWidth;



  return (
      <Group>
           <Text 
           text="Write Comment" 
            x={300}
            y={300}
            fontSize={20}
            draggable={true}
            width={200}
      />
    </Group>
  );
}
/*
function TransformText(){

      function BoundBoxFun(oldBox, newBox){
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }
    return(
        <Transformer
        node= {"textNode"}
        enabledAnchors = {['middle-left', 'middle-right']}
        boundBoxFunc={BoundBoxFun}/>
    )
}
*/