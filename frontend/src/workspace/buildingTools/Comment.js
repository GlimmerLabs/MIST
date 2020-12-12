import React, { useState, useContext } from "react";
import { Group, Text } from "react-konva";
import useImage from "use-image";
import { nodeContext } from "../globals/globals-nodes-dimensions";
import { globalContext } from "../globals/global-context";
import PropTypes from "prop-types";
import Portal from "./Portal";
import EdiText from "react-editext";

function Comment(props) {
  const name = props.name;
  const index = props.index;
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const menuHeight = useContext(globalContext).menuHeight;
  const functionWidth = useContext(globalContext).functionWidth;

  /* Props */
  const comment = props.comment;
  const x = props.x;
  const y = props.y;
  const update = props.update;

  /* This is the editor we use when we click to edit */
  const Editor = (
    <Portal portalTo="workspaceContainer" >
      <div
        style={{
          position: "absolute",
          left: x,
          top: y
        }}
      >
        <EdiText
          type="textarea"
          value={comment}
          onSave={(val) => { setEditing(false); update({ comment: val }) }}
          onCancel={() => setEditing(false)}
          editing
        />
      </div>
    </Portal>);

  /* This is the comment we view */
  const View = (
    <Text
      text={comment}
      x={x}
      y={y}
      fontSize={20}
      draggable={true}
      width={200}
    />
  );

  /* States */
  const [editing, setEditing] = useState(false);

  const toggleEditMode = () => setEditing(prev => !prev);

  const display = () => editing ? Editor : View;

  return (
    <Group
      onDblClick={toggleEditMode}
      onDragEnd={e => update(e.target.getAbsolutePosition())}
    >
      {display()}
    </Group >
  );
}

Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired
}

export default Comment;
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