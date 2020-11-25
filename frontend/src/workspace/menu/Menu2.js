/**
 * This file creates the Menu Bar and calls subsequent create nodes files.
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

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState, useRef, useContext, useEffect } from "react";
import { Rect, Group, Text, Line } from "react-konva";
import gui from "../globals/mistgui-globals";
import FuncGroup from "./MakeFunction2";
import ValGroup from "./MakeValue2";
import SettingsItem from "./SettingsItem";
import SavedItem from "./SavedItem";
import { globalContext } from "../globals/global-context.js";
import { menuContext } from "../globals/globals-menu-dimensions";
import { fontContext } from "../globals/globals-fonts";
import { UserContext } from "../../pages/components/Contexts/UserContext";
import {
  imageExists,
  saveImage,
  workspaceExists,
  saveWorkspace,
  getWorkspaces,
} from "../http.workspace";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function Menu2(props) {
  const global = useContext(globalContext);
  const menuDimensions = useContext(menuContext);
  const fonts = useContext(fontContext);

  // +--------+--------------------------------------------------------
  // | States |
  // +--------+

  const [valuesOpen, setValuesOpen] = useState(false);
  const [functionsOpen, setFunctionsOpen] = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [key, setKey] = useState(Math.random());
  const ref = useRef(null);

  // +--------+
  // | States |
  // +--------+--------------------------------------------------------

  /**
   * This gets called from MakeFunctions and MakeValues to change the group's
   * key to trigger a re-render (so that the node goes back to the right place
   * if it's drag-and-dropped into the menu, not the workspace)
   */
  function changeKey() {
    setKey(Math.random());
  }

  return (
    <Group
      width={global.width}
      height={menuDimensions.totalMenuHeight}
      key={key}
      ref={ref}
    >
      <Rect
        y={menuDimensions.menuTabHeight}
        width={global.width * 4}
        height={menuDimensions.mainMenuHeight}
        fill={props.bgColor}
        shadowBlur={5}
        opacity={0.98}
      />
      <MenuLine {...props} />
      <Tabs {...props} />
      <Values {...props} />
      <Functions {...props} />
      <SavedItems {...props} />
      <Settings {...props} />
    </Group>
  );

  function MenuLine(props) {
    return (
      <Line
        points={[
          0,
          menuDimensions.menuTabHeight + 1.5,
          global.width,
          menuDimensions.menuTabHeight + 1.5,
        ]}
        stroke={
          valuesOpen
            ? props.valTabColor
            : functionsOpen
              ? props.funTabColor
              : customOpen
                ? props.customTabColor
                : savedOpen
                  ? props.savedTabColor
                  : props.settingsTabColor
        }
        strokeWidth={3}
        shadowBlur={2}
        shadowOffsetY={1}
        shadowOpacity={0.3}
      />
    );
  }

  function Values(props) {
    return gui.valNames.map((name, index) => (
      <ValGroup
        addNode={props.addNode}
        valName={name}
        x={
          menuDimensions.valueMargin +
          index * (menuDimensions.valueMargin + global.valueWidth)
        }
        y={
          menuDimensions.menuTabHeight +
          (menuDimensions.mainMenuHeight - global.valueWidth) / 2
        }
        tabs={{
          valuesOpen: valuesOpen,
        }}
        changeKey={changeKey}
        key={index}
        index={index}
      />
    ));
  }

  function Functions(props) {
    return gui.funNames.map((name, index) => (
      <FuncGroup
        addNode={props.addNode}
        funName={name}
        x={
          menuDimensions.functionMargin +
          index * (menuDimensions.functionMargin + global.functionWidth)
        }
        y={
          menuDimensions.menuTabHeight +
          (menuDimensions.mainMenuHeight - global.functionWidth) / 2
        }
        tabs={{
          functionsOpen: functionsOpen,
          leftOpen: valuesOpen,
          rightOpen: customOpen || savedOpen || settingsOpen,
        }}
        changeKey={changeKey}
        key={index}
        index={index}
      />
    ));
  }

  function SavedItems(props) {
    const { user } = useContext(UserContext);
    let workspaces = [];
    if (user && user._id) {
      workspaces = user.workspaces
    }

    return workspaces.map((u, i) => {
      return (
        <SavedItem
          color={props.savedTabColor}
          x={
            menuDimensions.settingsMargin +
            i * (menuDimensions.settingsMargin + menuDimensions.settingsWidth)
          }
          y={
            menuDimensions.menuTabHeight +
            (menuDimensions.mainMenuHeight - global.functionWidth) / 2
          }
          tabs={{ savedOpen: savedOpen }}
          name={u.name}
          openWS={() => props.openWS(u.data.nodes, u.data.lines)}
        />
      );
    });
  }

  function Settings(props) {

    return [props.theme, "save", "delete"].map((u, i) => {
      return (
        <SettingsItem
          name={u}
          x={
            menuDimensions.settingsMargin +
            i * (menuDimensions.settingsMargin + menuDimensions.settingsWidth)
          }
          y={
            menuDimensions.menuTabHeight +
            (menuDimensions.mainMenuHeight - global.functionWidth) / 2
          }
          width={menuDimensions.settingsWidth}
          height={global.functionWidth}
          tabs={{ settingsOpen: settingsOpen }}
          handler={
            u === "save"
              ? props.openWorkspacePopupCanvas
              : u === "delete"
                ? props.openDeleteWorkspacePopup
                : props.toggleTheme
          }
          theme={props.theme}
        />
      );
    });
  }

  function Tabs(props) {
    const tabs = [
      { text: "Values", open: valuesOpen, tabColor: props.valTabColor },
      { text: "Functions", open: functionsOpen, tabColor: props.funTabColor },
      { text: "Custom", open: customOpen, tabColor: props.customTabColor },
      { text: "Saved", open: savedOpen, tabColor: props.savedTabColor },
      {
        text: "Settings",
        open: settingsOpen,
        tabColor: props.settingsTabColor,
      },
    ];
    return tabs.map((u, i) => {
      return (
        <Group
          x={(global.width / 5) * i}
          width={global.width / 5}
          height={menuDimensions.menuTabHeight}
        >
          <Rect
            width={global.width / 5}
            height={menuDimensions.menuTabHeight}
            fill={u.open ? u.tabColor : props.bgColor}
            opacity={u.open ? 1 : 0.5}
            shadowBlur={2}
            shadowOpacity={0.3}
            shadowOffsetY={-1.5}
            shadowEnabled={u.open}
          /* onMouseEnter={() => {
            setValuesOpen(u.text === "Values");
            setFunctionsOpen(u.text === "Functions");
            setCustomOpen(u.text === "Custom");
            setSavedOpen(u.text === "Saved");
            setSettingsOpen(u.text === "Settings");
          }} */
          />
          <Text
            width={global.width / 5}
            height={menuDimensions.menuTabHeight}
            text={u.text}
            fill={
              (u.text === "Functions" ||
                u.text === "Custom" ||
                u.text === "Settings") &&
                u.open
                ? "white"
                : props.theme === "dark"
                  ? "white"
                  : "black"
            }
            fontFamily={fonts.menuFont}
            fontStyle={"italic"}
            fontWeight={u.open ? "bold" : "light"}
            fontSize={fonts.menuTabFontSize}
            align={"center"}
            verticalAlign={"middle"}
            onTap={() => {
              const temp = [
                u.text === "Values",
                u.text === "Functions",
                u.text === "Custom",
                u.text === "Saved",
                u.text === "Settings",
              ];
              const states = [
                valuesOpen,
                functionsOpen,
                customOpen,
                savedOpen,
                settingsOpen,
              ];
              if (!states.every((u, i) => u === temp[i])) {
                const funs = [
                  setValuesOpen,
                  setFunctionsOpen,
                  setCustomOpen,
                  setSavedOpen,
                  setSettingsOpen,
                ];
                temp.map((u, i) => {
                  funs[i](u);
                });
                props.setMenuTabs(...temp);
                console.log("setting menu tabs");
              }
            }}
            onMouseEnter={() => {
              const temp = [
                u.text === "Values",
                u.text === "Functions",
                u.text === "Custom",
                u.text === "Saved",
                u.text === "Settings",
              ];
              const states = [
                valuesOpen,
                functionsOpen,
                customOpen,
                savedOpen,
                settingsOpen,
              ];
              if (!states.every((u, i) => u === temp[i])) {
                const funs = [
                  setValuesOpen,
                  setFunctionsOpen,
                  setCustomOpen,
                  setSavedOpen,
                  setSettingsOpen,
                ];
                temp.map((u, i) => {
                  funs[i](u);
                });
                props.setMenuTabs(...temp);
                console.log("setting menu tabs");
              }
            }}
          />
        </Group>
      );
    });
  }
}

export default Menu2;
