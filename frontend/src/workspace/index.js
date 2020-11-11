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
  -- sinkIndex: int; ndex of the sink node in the nodes array
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

import FunBar from "./funbar/FunBar";
import FunNode from "./buildingtools/FunNode";
import colors from "./globals/globals-themes";
import { Container } from "react-bootstrap";
import Edge from "./buildingtools/line";
import { ContextProvider } from "./globals/ContextProvider";
import Menu1 from "./menu/Menu1";
import Menu2 from "./menu/Menu2";
import gui from "./globals/mistgui-globals";
import { MIST } from "./mist/mist.js";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group, Text, useStrictMode } from "react-konva";
import ValNode from "./buildingtools/ValNode";
import PopupCanvas from "./funbar/PopupCanvas";
import { animated, useSpring } from "react-spring";
import Custom from "./menu/Custom";
import RenderBox from "./buildingtools/RenderBox";

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
    this.valueWidth = props.valueWidth;

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
      offsetX: 0,
      offsetY: props.offset,
      isPopupCanvasOpen: false,
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

  componentDidMount() {}

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
      };
      console.log("pushed operation " + outermost.name);
      evalFrom(sink, expression.operands, parentX, parentY);
      newNodes.push(outermost);
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
        numInputs: null,
        numOutlets: null,
        activeOutlets: null,
        parentNodes: null,
        imageShowing: false,
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
          evalFrom(sourceIndex, operands[i].operands, pX, pY);
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
            return Error();
          }
          const sourceNode = {
            name: operands[i].name,
            type: "val",
            x: Math.random() * (0.8 * this.width),
            y:
              this.menuHeight +
              Math.random() *
                (this.height - this.menuHeight - 2 * this.funBarHeight),
            renderFunction: {
              renderFunction: operands[i].code,
              isRenderable: true,
            },
            lineOut: [],
            numInputs: null,
            numOutlets: null,
            activeOutlets: null,
            parentNodes: null,
            imageShowing: false,
          };
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
    if (
      this.state.nodes[nodeIndex].numInputs > 0 ||
      this.state.nodes[nodeIndex].lineOut.length > 0
    ) {
      let newLines = [...this.state.lines];
      // updating line position for all the incoming lines
      for (let i = 0; i < this.state.nodes[nodeIndex].numOutlets; i++) {
        if (typeof this.state.nodes[nodeIndex].activeOutlets[i] === "number") {
          let lineIndex = this.state.nodes[nodeIndex].activeOutlets[i];
          let line = newLines[lineIndex];
          newLines[lineIndex].tailPosition = {
            x: x,
            y: y,
          };
        }
      }
      // updating line position for all the outgoing lines
      for (let i = 0; i < this.state.nodes[nodeIndex].lineOut.length; i++) {
        if (typeof this.state.nodes[nodeIndex].lineOut[i] === "number") {
          let lineIndex = this.state.nodes[nodeIndex].lineOut[i];
          newLines[lineIndex].headPosition = {
            x: x + this.functionWidth / 2,
            y: y + this.functionWidth / 2,
          };
        }
      }
      this.setState({
        lines: newLines,
      });
    }
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
    this.state.nodes[index].renderFunction.renderFunction = value;
    const temp = [];
    for (let i = 0; i < this.state.nodes[index].lineOut.length; i++) {
      temp.push(this.state.lines[this.state.nodes[index].lineOut[i]].sinkIndex)
    }
    this.setState({
      redoFromIndices: temp
    })
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

  /**
   * Save your workspace to the server
   * Pre: User is authenticated and user does not already have a workspace by the given name
   */
  _saveWorkspace = (name) => {
    // build workspace
    const workspace = {
      name: name,
      data: {
        ...this.state
      },
    }
    // async POST fetch request
    fetch('api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'savews', workspace: (workspace) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success)
          alert('Succesfully saved workspace ' + name);
        else
          throw (data.message);
      })
      .catch(error => { alert(error) })
  }

  /**
   * Checks if the workspace exists in the server by the same name
   * @param {String} name 
   */
  checkIfWorkspaceExists = async (name) => {
    const res = await fetch('api/?action=wsexists&name=' + name);
    if (!res.ok)
      throw new Error(`HTTP error! status: ${res.status}`);
    else {
      return await res.json()
        .then(data => {
          if (data === 'logged out')
            throw new Error('You needed to be logged in!')
          if (data.success) {
            return data.exists;
          }
          else {
            throw new Error(data.message);
          }
        });
    }
  }

  // save workspace

  /**
   * Retrieve a user's workspaces from the server
   */
  getWorkspaces = async () => {
    const res = await fetch('api/?action=getws');
    if (!res.ok)
      throw new Error(`HTTP error! status: ${res.status}`);
    else {
      return await res.json()
        .then(data => {
          if (data === 'logged out')
            throw new Error('You needed to be logged in!')
          if (data.success) {
            return data.workspaces;
          }
          else {
            throw new Error(data.message);
          }
        });
    }
  }

  /**
   * Delete a workspace of a name
   * @param {String} name 
   */
  deleteWorkspace = async (name) => {
    // async POST fetch request
    const res = await fetch('api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deletews', name: name })
    });
    if(!res.ok)
      throw new Error(`HTTP error! status: ${res.status}`);
    else{
      return await res.json()
        .then(data => {
          if (data === 'logged out')
            throw new Error('You needed to be logged in!')
          if (data.success) {
            return 'Successfully deleted workspace';
          }
          else {
            throw new Error(data.message);
          }
        });
    }
  }

  /**
   * Load a workspace onto the state
   */
  loadWorkspace = (workspaceToLoad) => {
    this.setState({
      ...workspaceToLoad
    })
  }

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
  bgClicked = (e) => {
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
            onClick={() => {
              this.setState({
                newSource: null,
                tempLine: null,
                mouseListenerOn: false,
              });
            }}
            onMouseMove={(e) => {
              if (this.state.mouseListenerOn) {
                this.updateMousePosition(
                  this.stageRef.getStage().getPointerPosition().x,
                  this.stageRef.getStage().getPointerPosition().y
                );
              }
            }}
          >

            <Layer>
              {this.state.tempLine && (
                <ContextProvider
                  width={this.width}
                  height={this.height}
                  menuHeight={this.menuHeight}
                  funBarHeight={this.funBarHeight}
                  functionWidth={this.functionWidth}
                  valueWidth={this.valueWidth}
                >
                  <Edge
                    sourceX={
                      this.state.tempLine.sourceX + this.functionWidth / 2
                    }
                    sourceY={
                      this.state.tempLine.sourceY + this.functionWidth / 2
                    }
                    sinkX={this.state.mousePosition.x}
                    sinkY={this.state.mousePosition.y}
                    fill={colors.lineFill[this.state.theme]}
                    outletIndex={null}
                  />
                </ContextProvider>
              )}
            </Layer>

            <Layer>
              {this.state.nodes.length !== 0 &&
                this.state.lines.map(
                  (line, index) =>
                    line && (
                      <ContextProvider
                        width={this.width}
                        height={this.height}
                        menuHeight={this.menuHeight}
                        funBarHeight={this.funBarHeight}
                        functionWidth={this.functionWidth}
                        valueWidth={this.valueWidth}
                      >
                        <Edge
                          index={index}
                          key={index}
                          sourceX={line.headPosition.x}
                          sourceY={line.headPosition.y}
                          sinkX={line.tailPosition.x}
                          sinkY={line.tailPosition.y}
                          removeLine={this.removeLine.bind(this)}
                          fill={colors.lineFill[this.state.theme]}
                          hoverShadowColor={
                            colors.nodeHoverShadow[this.state.theme]
                          }
                          outletIndex={line.outletIndex}
                        />
                      </ContextProvider>
                    )
                )}
            </Layer>

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
                        name={node.name}
                        key={index} // just to silence a warning message
                        index={index}
                        x={node.x}
                        y={node.y}
                        offsetX={this.state.offsetX}
                        offsetY={this.state.offsetY}
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
                        name={node.name}
                        key={index}
                        index={index}
                        x={node.x}
                        y={node.y}
                        offsetX={this.state.offsetX}
                        offsetY={this.state.offsetY}
                        renderFunction={
                          node.renderFunction.isRenderable
                            ? node.renderFunction.renderFunction
                            : false
                        }
                        updateNodePosition={this.updateNodePosition.bind(this)}
                        updateLinePosition={this.updateLinePosition.bind(this)}
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

            <Layer>
              <ContextProvider
                width={this.width}
                height={this.height}
                menuHeight={this.menuHeight}
                funBarHeight={this.funBarHeight}
                functionWidth={this.functionWidth}
                valueWidth={this.valueWidth}
              >
                <Menu2
                  addNode={this.pushNode.bind(this)}
                  addLine={this.pushLine.bind(this)}
                  clearWorkspace={this.clearWorkspace.bind(this)}
                  createLayout={this.createLayout.bind(this)}
                  bgColor={colors.menuBackground[this.state.theme]}
                  wsButtonColor={colors.workspaceButton[this.state.theme]}
                  valueMenuColor={
                    (this.state.theme === "classic" &&
                      colors.valueMenuColor1) ||
                    (this.state.theme === "dusk" && colors.valueMenuColor2) ||
                    (this.state.theme === "dark" && colors.valueMenuColor3)
                  }
                  funTabColor={colors.menuFunTab[this.state.theme]}
                  valTabColor={colors.menuValTab[this.state.theme]}
                  customTabColor={colors.menuCustomTab[this.state.theme]}
                  savedTabColor={colors.menuSavedTab[this.state.theme]}
                  settingsTabColor={colors.menuSettingsTab[this.state.theme]}
                  theme={this.state.theme}
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
                  toggleTheme={() => {
                    let i = (this.state.themeIndex + 1) % this.themes.length;
                    this.setState({
                      themeIndex: i,
                      theme: this.themes[i],
                    });
                  }
                  }
                  checkIfWorkspaceExists={this.checkIfWorkspaceExists.bind(this)}
                  deleteWorkspace={()=>{ alert('Not yet implemented'); 
				  //this.deleteWorkspace.bind(this)
				  }}
                  getWorkspaces={this.getWorkspaces.bind(this)}
                  loadWorkspace={this.loadWorkspace.bind(this)}
				  workspaceData={{ nodes: this.state.nodes, lines: this.state.lines}} 
                  openWS={(newNodes, newLines) => {
                    alert("attempting to open a workspace");
                    this.setState({
                      nodes: newNodes,
                      lines: newLines,
                    })
                  }}
                />
              </ContextProvider>
            </Layer>

            <Layer>
              <ContextProvider
                width={this.width}
                height={this.height}
                menuHeight={this.menuHeight}
                funBarHeight={this.funBarHeight}
                functionWidth={this.functionWidth}
                valueWidth={this.valueWidth}
              >
                <FunBar
                  renderFunction={
                    this.state.currentNode !== null &&
                    this.state.nodes[this.state.currentNode]
                      ? this.state.nodes[this.state.currentNode].renderFunction
                      : { renderFunction: "", isRenderable: false }
                  }
                  bg={colors.funBarBackground[this.state.theme]}
                  onClick={() => {
                    let i = (this.state.themeIndex + 1) % this.themes.length;
                    this.setState({
                      themeIndex: i,
                      theme: this.themes[i],
                    });
                  }}
                  functionBoxBg={
                    this.state.theme === "dark" ? "darkgray" : "white"
                  }
                  functionTextColor={
                    this.state.theme === "dark" ? "black" : "black"
                  }
                  openPopupCanvas={() => {
                    this.setState({
                      isPopupCanvasOpen: true,
                    });
                    console.log("opened popup canvas");
                  }}
                />
              </ContextProvider>
            </Layer>

          </Stage>

          <ContextProvider
            width={this.width}
            height={this.height}
            menuHeight={this.menuHeight}
            funBarHeight={this.funBarHeight}
            functionWidth={this.functionWidth}
            valueWidth={this.valueWidth}
          >
            <PopupCanvas
              x={0}
              y={0}
              top={0}
              left={0}
              show={this.state.isPopupCanvasOpen}
              renderFunction={
                this.state.currentNode !== null &&
                this.state.nodes[this.state.currentNode]
                  ? this.state.nodes[this.state.currentNode].renderFunction
                  : { renderFunction: "", isRenderable: false }
              }closePortal={() => {
                this.setState({ isPopupCanvasOpen: false });
              }}
              setImageName={(name) => {
                // not implemented
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
            <Custom menuTabs={this.state.menuTabs} />
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
      /* </Container> */
    );
  }
}

export default WorkspaceComponent;
