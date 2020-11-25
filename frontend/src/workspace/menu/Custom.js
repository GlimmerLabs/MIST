import React, { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";
import { globalContext } from "../globals/global-context.js";
import { menuContext } from "../globals/globals-menu-dimensions";
import { fontContext } from "../globals/globals-fonts";
import { MIST } from "../mist/mist";

function Custom(props) {
  const global = useContext(globalContext);
  const menuDimensions = useContext(menuContext);
  const fonts = useContext(fontContext);
  const valuesOpen = props.menuTabs.valuesOpen;
  const functionsOpen = props.menuTabs.functionsOpen;
  const customOpen = props.menuTabs.customOpen;
  const savedOpen = props.menuTabs.savedOpen;
  const settingsOpen = props.menuTabs.settingsOpen;
  const [formValue, setFormValue] = useState("Enter a MIST expression");
  const vis = props.menuTabs.customOpen;
  const padx = global.width * 0.01;
  const pady = global.width * 0.01;
  const formStyle = useSpring({
    from: {
      position: "absolute",
      top: menuDimensions.menuTabHeight + 2,
      left: valuesOpen || functionsOpen
        ? global.width
        : customOpen
        ? 0
        : -global.width,
    },
    to: {
      position: "absolute",
      top: menuDimensions.menuTabHeight + 2,
      left: valuesOpen || functionsOpen
      ? global.width
      : customOpen
      ? 0
      : -global.width,
    },
  });

  return (
    <div
      style={{
        top: pady,
        left: padx,
        position: "absolute",
        opacity: vis ? 1 : 0,
      }}
    >
      <animated.form
        id="form"
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          try {
            props.createLayout(MIST.parse(formValue, ""));
          } catch (err) {
            //document.getElementById("input").style.borderColor = "red";
            console.log("invalid function");
          }
          return false;
        }}
      >
        <input
          id={"input"}
          style={{
            width: global.width - 2 * padx,
            height: menuDimensions.mainMenuHeight - 2 * pady,
            backgroundColor: props.bgColor,
            border: "none",
          }}
          id="textbox"
          type="text"
          placeholder={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
      </animated.form>
    </div>
  );
}

export default Custom;
