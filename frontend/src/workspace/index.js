/**
 * The workspace area in MIST.
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

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/*
  1. Nodes and lines are saved in arrays of object literals.

  2. Nodes save the following information:
  -- name: String
  -- type: String; 'fun' or 'val'
  -- x: int
  -- y: int
  -- renderFunction: {String, boolean}; {renderFunction: String; isRenderable: boolean}
  -- lineOut: int[]; array of indices of the lines
  -- numInputs: int; number of lines coming into the node
  -- numOutlets: int; number of outlets
  -- activeOutlets: int[]; each item is a source index if it exists,
    or false if it doesn't have an incoming line

  3. Lines save the following information:
  -- sourceIndex: int; index of the source node in the nodes array
  -- sinkIndex: int; index of the sink node in the nodes array
  -- headPosition: {float, float}; coordinates of the vertex that connects to the source
  -- tailPosition: {float, float}; coordinates of the vertex that connects to the sink
  -- outletIndex: int; index of outlet that the line goes into

  4. The indices in redoFromIndices are where re-adjusting the
     render functions need to start from. The render function
     gets updated at each index, and renderFunctionRedo gets called
     recursively to do the same for all of the child nodes.

  5. UseStrictMode is a good react-konva practice.

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import FunNode from "./buildingTools/FunNode";
import colors from "./globals/globals-themes";
import { ContextProvider } from "./globals/ContextProvider";
import gui from "./globals/mistgui-globals";
import { MIST } from "./mist/mist.js";
import React, { Component } from "react";
import { Stage, Layer } from "react-konva";
import ValNode from "./buildingTools/ValNode";
import ImageModal from "./modals/ImageModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import SaveWorkspaceModal from "./modals/SaveWorkspaceModal";
import DeleteWorkspaceModal from "./modals/DeleteWorkspaceModal";
import Custom from "./menu/Custom";
import RenderBox from "./buildingTools/RenderBox";
import { UserContext } from "../pages/components/Contexts/UserContext";
import PropTypes from "prop-types";
import EdgeLayer from "./layers/EdgeLayer";
import FunBarLayer from "./layers/FunBarLayer";
import MenuLayer from "./layers/MenuLayer";
import TempLayer from "./layers/TempLayer";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

class WorkspaceComponent extends Component {
  constructor(props) {
    super(props);

    let layout1 = new MIST.Layout();

    this.themes = ["classic", "dusk", "dark"];

    this.width = props.width;
    this.height = props.height;
    this.menuHeight = props.menuHeight;
    this.funBarHeight = props.funBarHeight;
    this.functionWidth = props.functionWidth;
    this.offsetX = 0;
    this.offsetY = props.offset;
    this.valueWidth = props.valueWidth;

    this.clearWorkspace = this.clearWorkspace.bind(this);
    this.createLayout = this.createLayout.bind(this);
    this.bgClicked = this.bgClicked.bind(this);
    this.getRenderFunction = this.getRenderFunction.bind(this);
    this.openImageModal = this.openImageModal.bind(this);
    this.pushLine = this.pushLine.bind(this);
    this.pushNode = this.pushNode.bind(this);
    this.removeLine = this.removeLine.bind(this);

    // +--------+--------------------------------------------------------
    // | States |
    // +--------+
    this.state = {
      nodes: [],
      lines: [],
      redoFromIndices: [],
      newSource: null,
      mouseListenerOn: false,
      mousePosition: { x: null, y: null },
      tempLine: null,
      currentNode: null,
      layouts: [layout1],
      themeIndex: 1,
      theme: "dusk",
      pos1: { x: 100, y: 200 },
      pos2: { x: 0, y: 100 },
      isImageModalOpen: false,
      isSaveWorkspaceModalOpen: false,
      isConfirmationModalOpen: false,
      confirmationModalWarningMessage: "",
      confirmationOnClickCallback: () => { console.log('STUB Confirmation'); },
      isDeleteWorkspaceModalOpen: false,
      menuTabs: {
        valuesOpen: false,
        functionsOpen: true,
        customOpen: false,
        savedOpen: false,
        settingsOpen: false,
      },
    };
    // +--------+
    // | States |
    // +--------+--------------------------------------------------------
  }

  componentDidMount() { }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nodes !== this.state.nodes) {
      console.log("nodes changed");
    }
    if (prevState.lines !== this.state.lines) {
      console.log("lines changed");
    }
    if (prevState.redoFromIndices !== this.state.redoFromIndices) {
      for (let i = 0; i < this.state.redoFromIndices.length; i++) {
        this.findRenderFunction(this.state.redoFromIndices[i]);
        // TO-DO: call this only on the branches
        this.renderFunctionRedo(this.state.redoFromIndices[i]);
      }
    }
  }

  // +------------------------+----------------------------------------
  // | Adding Nodes and Lines |
  // +------------------------+

  createLayout = (expression) => {
    let newNodes = [...this.state.nodes];
    let newLines = [...this.state.lines];
    let redoIndices = [];

    const sink = newNodes.length;

    if (expression.class === "MIST.App") {
      const name = gui.repToFun[expression.operation];
      const parentX = Math.random() * (0.8 * this.width);
      const parentY =
        gui.menuHeight +
        Math.random() * (this.height - this.menuHeight - 2 * this.funBarHeight);
      const outermost = {
        // Creating a new node
        name: name,
        type: "fun",
        x: parentX,
        y: parentY,
        renderFunction: { renderFunction: "", isRenderable: false },
        lineOut: [],
        numInputs: 0,
        numOutlets: gui.functions[gui.repToFun[expression.operation]].min,
        activeOutlets: Array(
          gui.functions[gui.repToFun[expression.operation]].min
        ).fill(false),
        parentNodes: [],
        imageShowing: false,
        draggable: true,
      };
      console.log("pushed operation " + outermost.name);
      newNodes.push(outermost);
      evalFrom.bind(this)(sink, expression.operands, parentX, parentY);
    } else {
      // it's a value
      if (gui.values[expression.name] === undefined) {
        return Error();
      }
      const val = {
        name: expression.name,
        type: "val",
        x: Math.random() * (0.8 * this.width),
        y:
          this.menuHeight +
          Math.random() *
          (this.height - this.menuHeight - 2 * this.funBarHeight),
        renderFunction: { renderFunction: expression.code, isRenderable: true },
        lineOut: [],
        numInputs: 0,
        numOutlets: 0,
        activeOutlets: null,
        parentNodes: [],
        imageShowing: false,
        draggable: true,
      };
      newNodes.push(val);
    }

    function evalFrom(sinkIndex, operands, parentX, parentY) {
      console.log("newNodes[sinkIndex].name: " + newNodes[sinkIndex].name);
      console.log("operands.length: " + operands.length);
      if (
        gui.functions[newNodes[sinkIndex].name].color === gui.functionMultColor
      ) {
        if (
          operands.length < gui.functions[newNodes[sinkIndex].name].min ||
          operands.length > gui.functions[newNodes[sinkIndex].name].max
        ) {
          return Error(
            newNodes[sinkIndex].name +
            " must contain between " +
            gui.functions[newNodes[sinkIndex].name].min +
            " and " +
            gui.functions[newNodes[sinkIndex].name].max +
            " parameters"
          );
        }
      } else {
        if (operands.length !== gui.functions[newNodes[sinkIndex].name].min) {
          return Error(
            this.state.nodes[sinkIndex].name +
            " must contain " +
            gui.functions[this.state.nodes[sinkIndex].name].min +
            " parameters"
          );
        }
      }
      for (let i = 0; i < operands.length; i++) {
        console.log("entered for loop");
        let sourceIndex = newNodes.length;
        let lineIndex = newLines.length;
        // checking if the operand is a function
        if (operands[i].class === "MIST.App") {
          const pX = parentX - 50;
          const pY =
            this.menuHeight +
            Math.random() *
            (this.height - this.menuHeight - 2 * this.funBarHeight);
          const sourceNode = {
            // Creating a new node
            name: gui.repToFun[operands[i].operation],
            type: "fun",
            x: pX,
            y: pY,
            renderFunction: { renderFunction: "", isRenderable: false },
            lineOut: [],
            numInputs: 0,
            numOutlets: gui.functions[gui.repToFun[operands[i].operation]].min,
            activeOutlets: Array(
              gui.functions[gui.repToFun[operands[i].operation]].min
            ).fill(false),
            parentNodes: [],
            imageShowing: false,
          };
          evalFrom.bind(this)(sourceIndex, operands[i].operands, pX, pY);
          newNodes.push(sourceNode);
          newLines.push({
            sourceIndex: sourceIndex,
            sinkIndex: sinkIndex,
            headPosition: {
              x: sourceNode.x + this.functionWidth / 2,
              y: sourceNode.y + this.functionWidth / 2,
            },
            tailPosition: {
              x: newNodes[sinkIndex].x,
              y: newNodes[sinkIndex].y, // outletIndex = i
            },
            outletIndex: i,
          });
          // setting all the dependent node values after pushing a new line
          newNodes[sourceIndex].lineOut.push(lineIndex); //add line to lineOut array of source node
          newNodes[sinkIndex].numInputs += 1; // updating the number of inputs for sink node
          if (
            newNodes[sinkIndex].numInputs >= newNodes[sinkIndex].numOutlets &&
            gui.functions[newNodes[sinkIndex].name].color ===
            gui.functionMultColor
          ) {
            // Adding a new outlet once existing outlets are used
            newNodes[sinkIndex].numOutlets += 1;
            newNodes[sinkIndex].activeOutlets.push(false);
          }
          newNodes[sinkIndex].activeOutlets[i] = lineIndex;
        } else {
          // value
          if (gui.values[operands[i].name] === undefined) {
            console.log("error hereee");
            return Error();
          }
          //error happens in the next thing, fix it
          const sourceNode = {
            name: operands[i].name,
            type: "val",
            x: Math.random() * (0.8 * this.width),
            y: this.menuHeight +
              Math.random() *
              (this.height - this.menuHeight - 2 * this.funBarHeight),
            renderFunction: {
              renderFunction: operands[i].code,
              isRenderable: true,
            },
            lineOut: [],
            numInputs: 0,
            numOutlets: 0,
            activeOutlets: [],
            parentNodes: [],
            imageShowing: false,
            draggable: true,
          };
          newNodes.push(sourceNode);
          console.log(sourceNode.x);
          console.log(this.state.functionWidth);
          console.log(newNodes[sinkIndex].x);
          newLines.push({
            sourceIndex: sourceIndex,
            sinkIndex: sinkIndex,
            headPosition: {
              x: sourceNode.x + this.functionWidth / 2,
              y: sourceNode.y + this.functionWidth / 2,
            },
            tailPosition: {
              x: newNodes[sinkIndex].x,
              y: newNodes[sinkIndex].y,
            },
            outletIndex: i,
          });
          console.log("made new line");
          // setting all the dependent node values after pushing a new line
          newNodes[sourceIndex].lineOut.push(lineIndex); //add line to lineOut array of source node
          newNodes[sinkIndex].numInputs += 1; // updating the number of inputs for sink node
          if (
            newNodes[sinkIndex].numInputs >= newNodes[sinkIndex].numOutlets &&
            gui.functions[newNodes[sinkIndex].name].color ===
            gui.functionMultColor
          ) {
            // Adding a new outlet once existing outlets are used
            newNodes[sinkIndex].numOutlets += 1;
            newNodes[sinkIndex].activeOutlets.push(false);
          }
          newNodes[sinkIndex].activeOutlets[i] = lineIndex;
        }
        redoIndices.push(sinkIndex);
      }
    }
    this.setState((state, props) => {
      return {
        nodes: newNodes,
        lines: newLines,
        redoFromIndices: redoIndices,
      };
    });
  };

  /**
   * Adds a node to the node array
   * @param {String} type
   * @param {String} name
   * @param {float} x
   * @param {float} y
   */
  pushNode = (type, name, x, y) => {
    //const newIndex = this.state.nodes.length;
    let rf = {};
    switch (type) {
      case "fun":
        rf = { renderFunction: "", isRenderable: false };
        break;
      case "val":
        rf = { renderFunction: gui.values[name].rep, isRenderable: true };
        break;
      default:
        Error("Error: neither a function or a value node.");
        break;
    }
    const node = {
      // Creating a new node
      name: name,
      type: type,
      x: x,
      y: y,
      renderFunction: rf,
      lineOut: [],
      numInputs: 0,
      numOutlets: type === "fun" ? gui.functions[name].min : 0,
      activeOutlets:
        type === "fun"
          ? // e.g. if the function is 'add', this will be [false, false]
          Array(gui.functions[name].min).fill(false)
          : null,
      parentNodes: [],
      imageShowing: false,
      draggable: true,
    };
    this.setState((state, props) => {
      return {
        nodes: [...state.nodes, node],
      };
    });
  };

  /**
   * Pushes a new line to 'lines'. Updates information for the sink node.
   * @param {int} source
   * @param {int} sink
   */
  pushLine = (source, sink, outletIndex) => {
    // preventing infinite loops
    if (!this.state.nodes[source].parentNodes.includes(sink)) {
      let newLines = [...this.state.lines];
      let lineIndex = newLines.length; // index of the new line about to be pushed

      newLines.push({
        sourceIndex: source,
        sinkIndex: sink,
        headPosition: {
          x: this.state.nodes[source].x + this.functionWidth / 2,
          y: this.state.nodes[source].y + this.functionWidth / 2,
        },
        tailPosition: {
          x: this.state.nodes[sink].x,
          y: this.state.nodes[sink].y,
        },
        outletIndex: outletIndex, // index of the outlet that the line is sinking into
      });
      let newNodes = [...this.state.nodes];
      newNodes[source].lineOut.push(lineIndex); //add line to lineOut array of source node
      newNodes[sink].numInputs += 1; // updating the number of inputs for sink node
      if (
        newNodes[sink].numInputs >= newNodes[sink].numOutlets &&
        gui.functions[newNodes[sink].name].color === gui.functionMultColor
      ) {
        // Adding a new outlet once existing outlets are used
        newNodes[sink].numOutlets += 1;
        newNodes[sink].activeOutlets.push(false);
      }
      newNodes[sink].activeOutlets[outletIndex] = lineIndex;
      this.setState({
        nodes: newNodes,
        lines: newLines,
        redoFromIndices: [sink],
      });
    }
  };

  // +------------------------+
  // | Adding Nodes and Lines |
  // +------------------------+----------------------------------------

  // +------------------------+----------------------------------------
  // | Updating Node Position |
  // +------------------------+

  /**
   * Updates the position of a node
   * @param {int} index
   * @param {float} x
   * @param {float} y
   */
  updateNodePosition = (index, x, y) => {
    let newLst = [...this.state.nodes];
    newLst[index].x = x;
    newLst[index].y = y;
    this.setState({
      nodes: newLst,
    });
  };

  updateLinePosition = (nodeIndex, end, x, y) => {
    console.log(
      "updateLinePosition " +
      this.state.nodes[nodeIndex].numInputs +
      " " +
      this.state.nodes[nodeIndex].lineOut.length
    );
    this.setState(prevState => {
      if (
        prevState.nodes[nodeIndex].numInputs > 0 ||
        prevState.nodes[nodeIndex].lineOut.length > 0
      ) {
        let newLines = [...prevState.lines];
        // updating line position for all the incoming lines
        for (let i = 0; i < prevState.nodes[nodeIndex].numOutlets; i++) {
          if (typeof prevState.nodes[nodeIndex].activeOutlets[i] === "number") {
            let lineIndex = prevState.nodes[nodeIndex].activeOutlets[i];
            newLines[lineIndex].tailPosition = {
              x: x,
              y: y,
            };
          }
        }
        // updating line position for all the outgoing lines
        for (let i = 0; i < prevState.nodes[nodeIndex].lineOut.length; i++) {
          if (typeof prevState.nodes[nodeIndex].lineOut[i] === "number") {
            let lineIndex = prevState.nodes[nodeIndex].lineOut[i];
            newLines[lineIndex].headPosition = {
              x: x + this.functionWidth / 2,
              y: y + this.functionWidth / 2,
            };
          }
        }
        return ({
          lines: newLines,
        });
      }
    });
  };

  // +------------------------+
  // | Updating Node Position |
  // +------------------------+----------------------------------------

  // +--------------------------+--------------------------------------
  // | Removing Nodes and Lines |
  // +--------------------------+

  /**
   * Resets the nodes and lines to reflect the deletion of a node at index
   * @param {index} index
   */
  removeNode = (index) => {
    let newNodes = [...this.state.nodes];
    let newLines = [...this.state.lines];
    const node = this.state.nodes[index];
    // update info for the incoming lines
    if (node.type === "fun") {
      // updates lines and nodes according to the lines coming out of the node
      for (let i = 0; i < node.activeOutlets.length; i++) {
        const lineIndex = node.activeOutlets[i];
        if (typeof lineIndex === "number") {
          const source = newNodes[newLines[lineIndex].sourceIndex];
          // finds and sets the line to false
          newNodes[
            newLines[lineIndex].sourceIndex // gets the source index of the line
          ].lineOut[source.lineOut.indexOf(lineIndex)] = false; // gets the source node of the line // gets the index of the line within the source node's lineIndex array
          newLines[lineIndex] = false;
        }
      }
    }
    // all the nodes that get directly affected by deleting the node
    let newRedoIndices = [];
    // update info for the outgoing lines and sink nodes
    for (let i = 0; i < node.lineOut.length; i++) {
      const lineIndex = node.lineOut[i];
      if (typeof lineIndex === "number") {
        const sinkIndex = newLines[lineIndex].sinkIndex;
        const outletIndex = newLines[lineIndex].outletIndex;
        newNodes[sinkIndex].activeOutlets[outletIndex] = false; // updates status of the sink node
        newNodes[sinkIndex].numInputs -= 1; // updates sink node's number of inputs
        let numOutlets = newNodes[sinkIndex].numOutlets;
        // deleting extra outlets at the bottom
        let j = numOutlets - 1;
        while (
          j >= gui.functions[newNodes[sinkIndex].name].min &&
          !newNodes[sinkIndex].activeOutlets[j]
        ) {
          console.log("j:" + j);
          newNodes[sinkIndex].activeOutlets.pop();
          newNodes[sinkIndex].numOutlets--;
          j--;
        }
        newRedoIndices.push(sinkIndex);
        newLines[lineIndex] = false; // removes the line
      }
    }
    newNodes[index] = false;
    this.setState({
      tempLine: null,
      newSource: null,
      currentNode: null,
      nodes: newNodes,
      lines: newLines,
      redoFromIndices: newRedoIndices,
    });
  }; // removeNode

  /**
   * Resets the nodes and lines to reflect the deletion of a line at index
   * @param {int} index
   */
  removeLine = (index) => {
    const sourceIndex = this.state.lines[index].sourceIndex;
    const sinkIndex = this.state.lines[index].sinkIndex;
    const outletIndex = this.state.lines[index].outletIndex;
    let newNodes = [...this.state.nodes];
    newNodes[sourceIndex].lineOut[
      // index of the removed line in the source node's lineOut array
      newNodes[sourceIndex].lineOut.indexOf(index)
    ] = false;
    newNodes[sinkIndex].activeOutlets[outletIndex] = false; // updates the sink node's outlet status
    newNodes[sinkIndex].numInputs -= 1;
    let numOutlets = newNodes[sinkIndex].numOutlets;
    let j = numOutlets - 1;
    while (
      j >= gui.functions[newNodes[sinkIndex].name].min &&
      !newNodes[sinkIndex].activeOutlets[j] &&
      newNodes[sinkIndex].numInputs + 1 < newNodes[sinkIndex].numOutlets
    ) {
      console.log("j:" + j);
      newNodes[sinkIndex].activeOutlets.pop();
      newNodes[sinkIndex].numOutlets--;
      j--;
    }
    let newLines = [...this.state.lines];
    newLines[index] = false;
    this.setState({
      nodes: newNodes,
      lines: newLines,
      redoFromIndices: [sinkIndex],
    });
  };

  // +--------------------------+
  // | Removing Nodes and Lines |
  // +--------------------------+--------------------------------------

  // +-------------------------------+---------------------------------
  // | Updating the Render Functions |
  // +-------------------------------+

  /**
   *
   * @param {int} index
   * @param {float} value
   * Updates the numeric value in the '#' node
   */
  updateHashValue = (index, value) => {
    this.setState((prevState) => {
      const prevNodes = prevState.nodes;
      prevNodes[index].renderFunction.renderFunction = value;
      const temp = [];
      for (let i = 0; i < prevState.nodes[index].lineOut.length; i++) {
        temp.push(prevState.lines[prevState.nodes[index].lineOut[i]].sinkIndex)
      }
      return ({
        nodes: prevNodes,
        redoFromIndices: temp
      });
    });
  }

  /**
   * Updates the render function of the node at index as well as all the nodes that branch out of it
   * @param {int} index
   */
  renderFunctionRedo = (index) => {
    console.log("renderFunctionRedo");
    let newNodes = [...this.state.nodes];
    let node = newNodes[index];
    let rf = "";
    let isRenderable = true;
    let lineCount = 0;
    let parentNodes = [];
    // getting the render function from each outlet (w/o going deeper into the tree)
    for (let i = 0; i < node.activeOutlets.length; i++) {
      const lineIndex = node.activeOutlets[i];
      if (typeof lineIndex === "number") {
        lineCount++;
        let sourceIndex = this.state.lines[lineIndex].sourceIndex;
        let sourceNode = this.state.nodes[sourceIndex];
        // update parentNodes
        if (sourceNode.type === "fun") {
          parentNodes.push(sourceIndex);
          parentNodes.push(...sourceNode.parentNodes);
        }
        rf += sourceNode.renderFunction.renderFunction;
        rf += ",";
        // checks if any of the child node's render function is invalid;
        // if so, sets isRenderable to false
        if (!sourceNode.renderFunction.isRenderable) {
          isRenderable = false;
        }
      }
    }
    // runs if the minimum number of inputs isn't met
    for (
      let i = 0;
      i < Math.max(0, gui.functions[node.name].min - lineCount);
      i++
    ) {
      rf += "__,";
      // missing information means the function isn't renderable
      isRenderable = false;
    }
    if (rf !== "") {
      rf = rf.substring(0, rf.length - 1);
      // puts the function's name and parentheses around the parameters
      rf = gui.functions[node.name].prefix + "(" + rf + ")";
    }

    newNodes[index].renderFunction = {
      renderFunction: rf,
      isRenderable: isRenderable,
    };
    newNodes[index].parentNodes = parentNodes;

    /*for(let j = 0; j < newNodes.length; j++) {
      console.log("hello");
      for (let i = 0; i < newNodes[j].parentNodes.length; i++) {
        console.log(
          "parentNode for " +
          newNodes[j].name +
            ": " +
            newNodes[j].parentNodes[i]
        );
      }
    }*/
    this.setState({
      nodes: newNodes,
    });
    // goes through all of the lines coming out of the current node
    for (let i = 0; i < node.lineOut.length; i++) {
      const lineIndex = node.lineOut[i];
      if (typeof lineIndex === "number") {
        // recursively calls this function on its children (?) nodes
        this.renderFunctionRedo(this.state.lines[lineIndex].sinkIndex);
      }
    }
  };

  /**
   * Finds and sets the render function of the node of given index.
   * @param {int} index
   */
  findRenderFunction = (index) => {
    const node = this.state.nodes[index];
    if (node.type === "val") {
      return node.renderFunction;
    }
    let rf = "";
    let isRenderable = node.renderFunction.isRenderable;
    // checking all the incoming lines
    let lineCount = 0;
    for (let i = 0; i < node.activeOutlets.length; i++) {
      const lineIndex = node.activeOutlets[i];
      if (typeof lineIndex === "number") {
        lineCount++;
        rf += this.findRenderFunction(this.state.lines[lineIndex].sourceIndex)
          .renderFunction;
        rf += ",";
      }
    }
    // runs if the minimum number of inputs isn't met
    for (
      let i = 0;
      i < Math.max(0, gui.functions[node.name].min - lineCount);
      i++
    ) {
      rf += "__,";
      // missing information means the function isn't renderable
      isRenderable = false;
    }
    if (rf !== "") {
      rf = rf.substring(0, rf.length - 1);
    }
    if (node.type === "fun" && rf !== "") {
      // prevent parentheses with nothing in them
      rf = gui.functions[node.name].prefix + "(" + rf + ")";
    }
    let newNodes = [...this.state.nodes];
    newNodes[index].renderFunction = {
      renderFunction: rf,
      isRenderable: isRenderable,
    };
    this.setState({
      nodes: newNodes,
    });
    console.log(
      "node index:" + index + " rf:" + rf + " isRenderable: " + isRenderable
    );
    return { renderFunction: rf, isRenderable: isRenderable };
  };

  // +-------------------------------+
  // | Updating the Render Functions |
  // +-------------------------------+---------------------------------

  // +-------------------------+---------------------------------------
  // | Interacting with Modals |
  // +-------------------------+

  openConfirmationPopup = (warningMessage, confirmOnClick) => {
    this.setState({
      isConfirmationModalOpen: true,
      confirmationModalWarningMessage: warningMessage,
      confirmationOnClickCallback: confirmOnClick
    })
  }

  openImageModal = () => {
    this.setState({
      isImageModalOpen: true
    })
  }

  // +-------------------------+
  // | Interacting with Modals |
  // +-------------------------+---------------------------------------

  // +------------------------+----------------------------------------
  // | Updating the Workspace |
  // +------------------------+

  /**
   * Clears all nodes and lines
   */
  clearWorkspace = () => {
    this.setState({
      nodes: [],
      lines: [],
    });
  };

  // +-----------+----------------------------------------
  // | Workspace |
  // +-----------+

  // +------------------------+
  // | Updating the Workspace |
  // +------------------------+----------------------------------------

  // +----------------------+------------------------------------------
  // | Mouse Event Handlers |
  // +----------------------+

  updateMousePosition = (x, y) => {
    console.log("updateMousePosition");
    this.setState({
      mousePosition: { x: x, y: y },
    });
  };

  /**
   * When a function node gets clicked, its render function gets displayed in FunBar.
   * @param {int} index
   */
  funClicked = (index) => {
    this.setState({
      currentNode: index,
    });
    // for (let i = 0; i < nodes[index].parentNodes.length; i++) {
    //   console.log(
    //     "parentNode for " +
    //       nodes[index].name +
    //       ": " +
    //       nodes[index].parentNodes[i]
    //   );
    // }
  };

  /**
   * When a value node gets clicked, its name gets displayed in FunBar.
   * @param {int} index
   */
  valClicked = (index) => {
    this.setState({
      currentNode: index,
    });
  };

  nodeTapped = (index) => {
    if (typeof index === 'number') {
      this.setState(prevState => {
        // this accounts for the fact that when we delete a node
        // we are not removing it from the array but rather are
        // replacing it with false
        const newNodes = prevState.nodes.map((node, i) => (node ? { ...node, draggable: i !== index } : false));
        return {
          currentNode: index,
          newSource: index,
          mouseListenerOn: true,
          mousePosition: {
            x: this.state.nodes[index].x + gui.functionRectSideLength / 2,
            y: this.state.nodes[index].y + gui.functionRectSideLength / 2,
          },
          tempLine: {
            sourceX: this.state.nodes[index].x,
            sourceY: this.state.nodes[index].y,
          },
          nodes: newNodes
        }
      })
    };
  }

  /**
   * If the connection is valid, clicking the outlet pushes a new line
   * @param {*} sinkIndex
   * @param {*} outletIndex
   */
  outletClicked = (sinkIndex, outletIndex) => {
    if (
      this.state.newSource !== null &&
      this.state.newSource !== sinkIndex &&
      this.state.nodes[sinkIndex].activeOutlets[outletIndex] === false &&
      this.state.nodes[sinkIndex].numInputs <
      gui.functions[this.state.nodes[sinkIndex].name].max
    ) {
      // a line coming out of source
      this.pushLine(this.state.newSource, sinkIndex, outletIndex);
    }
  };

  /**
   * Called when the background is clicked.
   */
  bgClicked = () => {
    this.setState({
      newSource: null,
      tempLine: null,
      mouseListenerOn: false,
    });
  };

  /**
   * When a node is double-clicked, a line comes out of it with the end on the cursor
   * @param {int} index
   */
  dblClicked = (index) => {
    if (!this.state.tempLine && this.state.nodes[index].name !== "rgb") {
      this.setState({
        newSource: index,
        mouseListenerOn: true,
        mousePosition: {
          x: this.state.nodes[index].x + gui.functionRectSideLength / 2,
          y: this.state.nodes[index].y + gui.functionRectSideLength / 2,
        },
        tempLine: {
          sourceX: this.state.nodes[index].x,
          sourceY: this.state.nodes[index].y,
        },
      });
    }
  };

  // +----------------------+
  // | Mouse Event Handlers |
  // +----------------------+------------------------------------------

  // +----------------------+
  // | Touch Event Handlers |
  // +----------------------+------------------------------------------

  /**
   *
   */
  toggleDraggable = (index) => {
    this.setState(prevState => {
      const newNodes = prevState.nodes;
      newNodes[index].draggable = !newNodes[index].draggable;
      return { nodes: newNodes };
    })
  }

  // +----------------------+
  // | Touch Event Handlers |
  // +----------------------+------------------------------------------

  // +-------+----------------------------------------
  // | Misc. |
  // +-------+

  getRenderFunction = () => {
    const { currentNode, nodes } = this.state;
    const EMPTY = { renderFunction: "", isRenderable: false };
    return (currentNode !== null && nodes[currentNode]) ? nodes[currentNode].renderFunction : EMPTY;
  };

  getTempLine = () => {
    const { tempLine, mousePosition, theme } = this.state;
    const tempLineOffset = this.functionWidth / 2;
    const fill = colors.lineFill[theme];
    return (tempLine && {
      sourceX: tempLine.sourceX + tempLineOffset,
      sourceY: tempLine.sourceY + tempLineOffset,
      sinkX: mousePosition.x,
      sinkY: mousePosition.y,
      fill: fill
    })
  };

  // +-------+
  // | Misc. |
  // +-------+----------------------------------------
  // +--------+--------------------------------------------------------
  // | RENDER |
  // +--------+

  render() {
    return (
      /* <Container
        style={{
          marginLeft: "0",
          paddingLeft: "0",
          marginBottom: "0",
          paddingBottom: "7.5rem",
        }}
      > */
      <div
        id="workspace"
        style={{
          position: "relative",
          width: this.width,
          height: this.height,
          margin: 'auto',
          backgroundColor: colors.workspaceBackground[this.state.theme],
          overflow: 'hidden',
        }}
      >
        {/* <div onClick={()=>this.deleteWorkspaces('a').then(alert).catch(alert)}>Delete ws</div> */}
        {/* Bridging the UserContext into react-konva according to
	  https://github.com/konvajs/react-konva/issues/188#issuecomment-478302062
      */}
        <UserContext.Consumer>
          {value => (
            <Stage
              ref={(ref) => {
                this.stageRef = ref;
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
              width={this.width}
              height={this.height}
              onClick={this.bgClicked}
              onMouseMove={(e) => {
                if (this.state.mouseListenerOn) {
                  this.updateMousePosition(
                    this.stageRef.getStage().getPointerPosition().x,
                    this.stageRef.getStage().getPointerPosition().y
                  );
                }
              }}
              onTouchMove={() => {
                this.setState(currentState => {
                  const index = currentState.currentNode;
                  if (index !== null && currentState.newSource && !currentState.tempLine && currentState.nodes[index].name !== 'rgb') {
                    return ({
                      newSource: index,
                      mouseListenerOn: true,
                      mousePosition: {
                        x: currentState.nodes[index].x + gui.functionRectSideLength / 2,
                        y: currentState.nodes[index].y + gui.functionRectSideLength / 2,
                      },
                      tempLine: {
                        sourceX: currentState.nodes[index].x,
                        sourceY: currentState.nodes[index].y,
                      },
                    })
                  } else if (index !== null && currentState.tempLine && currentState.nodes[index].name !== 'rgb') {
                    this.updateMousePosition(
                      this.stageRef.getStage().getPointerPosition().x,
                      this.stageRef.getStage().getPointerPosition().y
                    )
                  } else {
                  }

                })
              }}
              onTouchEnd={() => {
                if (this.state.mouseListenerOn && this.state.tempLine) {
                  this.setState(prevState => {
                    const newNodes = prevState.nodes;
                    if (prevState.newSource !== null) {
                      newNodes[prevState.newSource].draggable = true;
                    }
                    const newState = {
                      newSource: null,
                      tempLine: null,
                      mouseListenerOn: false,
                      nodes: newNodes
                    };
                    return newState;
                  })
                }
              }}
            >

              <UserContext.Provider value={value}>
                <ContextProvider
                  width={this.width}
                  height={this.height}
                  menuHeight={this.menuHeight}
                  funBarHeight={this.funBarHeight}
                  functionWidth={this.functionWidth}
                  valueWidth={this.valueWidth}
                >
                  <TempLayer tempLine={this.getTempLine()} />
                  <EdgeLayer
                    edges={this.state.lines}
                    removeLine={this.removeLine}
                    theme={this.state.theme}
                  />
                  <MenuLayer
                    addLine={this.pushLine}
                    addNode={this.pushNode}
                    clearWorkspace={this.clearWorkspace}
                    createLayout={this.createLayout}
                    openDeleteWorkspaceModal={() => this.setState({ isDeleteWorkspaceModalOpen: true })}
                    openSaveWorkspaceModal={() => this.setState({ isSaveWorkspaceModalOpen: true })}
                    openWorkspace={(newNodes, newLines) => {
                      this.setState({
                        nodes: newNodes,
                        lines: newLines,
                        currentNode: null,
                        mouseListenerOn: false,
                        newSource: null,
                      })
                    }}
                    setMenuTabs={(
                      valuesOpen,
                      functionsOpen,
                      customOpen,
                      savedOpen,
                      settingsOpen
                    ) => {
                      this.setState({
                        menuTabs: {
                          valuesOpen: valuesOpen,
                          functionsOpen: functionsOpen,
                          customOpen: customOpen,
                          savedOpen: savedOpen,
                          settingsOpen: settingsOpen,
                        },
                      });

                    }}
                    theme={this.state.theme}
                    toggleTheme={() => {
                      let i = (this.state.themeIndex + 1) % this.themes.length;
                      this.setState({
                        themeIndex: i,
                        theme: this.themes[i],
                      });
                    }}
                  />
                  <FunBarLayer
                    openImageModal={this.openImageModal}
                    renderFunction={this.getRenderFunction()}
                    theme={this.state.theme}
                  />
                </ContextProvider>

                <Layer>
                  {this.state.nodes.map(
                    (node, index) =>
                      (node && node.type === "fun" && (
                        <ContextProvider
                          width={this.width}
                          height={this.height}
                          menuHeight={this.menuHeight}
                          funBarHeight={this.funBarHeight}
                          functionWidth={this.functionWidth}
                          valueWidth={this.valueWidth}
                        >
                          <FunNode
                            draggable={node.draggable}
                            toggleDraggable={this.toggleDraggable.bind(this)}
                            name={node.name}
                            key={index} // just to silence a warning message
                            index={index}
                            x={node.x}
                            y={node.y}
                            offsetX={this.offsetX}
                            offsetY={this.offsetY}
                            numInputs={node.numInputs}
                            numOutlets={node.numOutlets}
                            renderFunction={
                              node.renderFunction.isRenderable
                                ? node.renderFunction.renderFunction
                                : false
                            }
                            updateNodePosition={this.updateNodePosition.bind(this)}
                            updateLinePosition={this.updateLinePosition.bind(this)}
                            funClicked={this.funClicked.bind(this)}
                            tapHandler={this.nodeTapped.bind(this)}
                            outletClicked={this.outletClicked.bind(this)}
                            dblClickHandler={this.dblClicked.bind(this)}
                            removeNode={this.removeNode.bind(this)}
                            hoverShadowColor={
                              colors.nodeHoverShadow[this.state.theme]
                            }
                            imageShowing={node.imageShowing}
                            toggleBox={() => {
                              const newNodes = this.state.nodes;
                              newNodes[index].imageShowing = !this.state.nodes[index].imageShowing;
                              this.setState({
                                nodes: newNodes,
                              });
                            }}
                          />
                        </ContextProvider>
                      )) ||
                      (node && node.type === "val" && (
                        <ContextProvider
                          width={this.width}
                          height={this.height}
                          menuHeight={this.menuHeight}
                          funBarHeight={this.funBarHeight}
                          functionWidth={this.functionWidth}
                          valueWidth={this.valueWidth}
                        >
                          <ValNode
                            draggable={node.draggable}
                            toggleDraggable={this.toggleDraggable.bind(this)}
                            name={node.name}
                            key={index}
                            index={index}
                            x={node.x}
                            y={node.y}
                            offsetX={this.offsetX}
                            offsetY={this.offsetY}
                            renderFunction={
                              node.renderFunction.isRenderable
                                ? node.renderFunction.renderFunction
                                : false
                            }
                            updateNodePosition={this.updateNodePosition.bind(this)}
                            updateLinePosition={this.updateLinePosition.bind(this)}


                            tapHandler={this.nodeTapped.bind(this)}
                            clickHandler={this.valClicked.bind(this)}
                            dblClickHandler={this.dblClicked.bind(this)}
                            removeNode={this.removeNode.bind(this)}
                            updateHashValue={this.updateHashValue.bind(this)}
                            imageShowing={node.imageShowing}
                            toggleBox={() => {
                              const newNodes = this.state.nodes;
                              newNodes[index].imageShowing = !this.state.nodes[index].imageShowing;
                              this.setState({
                                nodes: newNodes,
                              });
                            }}
                          />
                        </ContextProvider>
                      ))
                  )}
                </Layer>
              </UserContext.Provider>
            </Stage>)
          }
        </UserContext.Consumer>

        <ContextProvider
          width={this.width}
          height={this.height}
          menuHeight={this.menuHeight}
          funBarHeight={this.funBarHeight}
          functionWidth={this.functionWidth}
          valueWidth={this.valueWidth}
        >
          <ImageModal
            top={0}
            left={0}
            show={this.state.isImageModalOpen}
            renderFunction={
              (this.state.currentNode !== null && this.state.nodes[this.state.currentNode]) ?
                this.state.nodes[this.state.currentNode].renderFunction :
                { renderFunction: "", isRenderable: false }
            }
            handleClose={() => {
              this.setState({ isImageModalOpen: false });
            }}
          />

          <ConfirmationModal
            handleClose={() => this.setState({ isConfirmationModalOpen: false })}
            show={this.state.isConfirmationModalOpen}
            confirmOnClickCallback={this.state.confirmationOnClickCallback}
            warningMessage={this.state.confirmationModalWarningMessage}
          />

          <SaveWorkspaceModal
            show={this.state.isSaveWorkspaceModalOpen}
            handleClose={() => {
              this.setState({ isSaveWorkspaceModalOpen: false });
            }}
            openConfirmationPopup={this.openConfirmationPopup.bind(this)}
            workspaceData={{ nodes: this.state.nodes, lines: this.state.lines }}
          />

          <DeleteWorkspaceModal
            show={this.state.isDeleteWorkspaceModalOpen}
            openConfirmationPopup={this.openConfirmationPopup.bind(this)}
            handleClose={() => {
              this.setState({ isDeleteWorkspaceModalOpen: false });
            }}
          />
        </ContextProvider>

        <ContextProvider
          width={this.width}
          height={this.height}
          menuHeight={this.menuHeight}
          funBarHeight={this.funBarHeight}
          functionWidth={this.functionWidth}
          valueWidth={this.valueWidth}
        >
          <Custom
            menuTabs={this.state.menuTabs}
            createLayout={this.createLayout.bind(this)}
          />
        </ContextProvider>

        {this.state.nodes.map(
          (node, index) =>
            node &&
            node.renderFunction.isRenderable &&
            node.imageShowing && (
              <ContextProvider
                width={this.width}
                height={this.height}
                menuHeight={this.menuHeight}
                funBarHeight={this.funBarHeight}
                functionWidth={this.functionWidth}
                valueWidth={this.valueWidth}
              >
                <RenderBox
                  x={node.x}
                  y={node.y}
                  type={node.type}
                  renderFunction={node.renderFunction.renderFunction}
                  toggleBox={() => {
                    const newNodes = this.state.nodes;
                    newNodes[index].imageShowing = !this.state.nodes[index].imageShowing;
                    this.setState({
                      nodes: newNodes,
                    });
                  }}
                />
              </ContextProvider>
            )
        )}
      </div>
    );
  }
}

WorkspaceComponent.propTypes = {
  funBarHeight: PropTypes.number.isRequired,
  functionWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  offset: PropTypes.number,
  valueWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default WorkspaceComponent;