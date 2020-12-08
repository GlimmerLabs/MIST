import React, { useState, useContext } from "react";
import { Line, Group, Image, Transformer, Text, Transformer } from "react-konva";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions";

export default function Comment(props) {


  return (
      <Group>
           <Text 
           text="some text" 
            x={50}
            y={80}
            fontSize={20}
            draggable={true}
            width={200}
      />
    </Group>
  );
}

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
