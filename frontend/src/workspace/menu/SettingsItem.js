import React, { useContext } from "react";
import { Group, Image, Rect, Text } from "react-konva";
import useImage from "use-image";
import { menuContext } from "../globals/globals-menu-dimensions";
import { globalContext } from "../globals/global-context.js";
import { Spring, animated } from "react-spring/renderprops-konva";

function SettingItem(props) {
  const menuDimensions = useContext(menuContext);
  const global = useContext(globalContext);
  const [image] = useImage(require("./" + props.name + ".png"));

  function Button() {
    return (
      <Image
        image={image}
        x={(props.width - props.height * 0.8)/2}
        width={props.height * 0.8}
        height={props.height * 0.8}
        scaleX={108 / props.width}
        scaleY={108 / props.width}
      />
    );
  }

  return (
    <Group
      x={props.x}
      y={props.y}
      visible={props.tabs.settingsOpen}
      onClick={props.handler}
      onTap={props.handler}
    >
      <Button/>
      <Text
        y={props.height * 0.9}
        width={props.width}
        height={props.height * 0.1}
        text={props.name}
        fontSize={9}
        align={"center"}
        verticalAlign={"middle"}
        fill={props.theme === "dark" ? "white" : "black"}
      />
    </Group>
  );
}

export default SettingItem;
