import React from "react";
import { Layer } from "react-konva";
import Menu from "../menu/Menu2";
import colors from "../globals/globals-themes";
import PropTypes from "prop-types";

function MenuLayer(props) {
  const { theme, addLine, addNode, clearWorkspace, createLayout, openDeleteWorkspaceModal,
    openSaveWorkspaceModal, openWorkspace, setMenuTabs, toggleTheme } = props;
  const backgroundColor = colors.menuBackground[theme];
  const workspaceButtonColor = colors.workspaceButton[theme];
  const valueMenuColor = (() => {
    switch (theme) {
      case "classic":
        return colors.valueMenuColor1;
      case "dusk":
        return colors.valueMenuColor2;
      case "dark":
        return colors.valueMenuColor3;
    }
  })();
  const funTabColor = colors.menuFunTab[theme];
  const valTabColor = colors.menuValTab[theme];
  const customTabColor = colors.menuCustomTab[theme];
  const savedTabColor = colors.menuSavedTab[theme];
  const settingsTabColor = colors.menuSettingsTab[theme];
  return (<Layer>
    <Menu
      addLine={addLine}
      addNode={addNode}
      clearWorkspace={clearWorkspace}
      createLayout={createLayout}
      bgColor={backgroundColor}
      wsButtonColor={workspaceButtonColor}
      valueMenuColor={valueMenuColor}
      funTabColor={funTabColor}
      valTabColor={valTabColor}
      customTabColor={customTabColor}
      savedTabColor={savedTabColor}
      settingsTabColor={settingsTabColor}
      theme={theme}
      setMenuTabs={setMenuTabs}
      toggleTheme={toggleTheme}
      openWorkspace={openWorkspace}
      openSaveWorkspaceModal={openSaveWorkspaceModal}
      openDeleteWorkspaceModal={openDeleteWorkspaceModal}
    />
  </Layer>)
}

MenuLayer.propTypes = {
  addLine: PropTypes.func.isRequired,
  addNode: PropTypes.func.isRequired,
  clearWorkspace: PropTypes.func.isRequired,
  createLayout: PropTypes.func.isRequired,
  openDeleteWorkspaceModal: PropTypes.func.isRequired,
  openSaveWorkspaceModal: PropTypes.func.isRequired,
  openWorkspace: PropTypes.func.isRequired,
  setMenuTabs: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired
}

export default MenuLayer;