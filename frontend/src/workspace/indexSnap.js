import React, { useState, useRef, useContext, Component } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";
import gui from "./globals/mistgui-globals";
import FuncBracket from "./SnapBuildingTools/FuncBracket";
// import { globalContext } from "../globals/global-context";
// import { fontContext } from "../globals/globals-fonts";



// contain all of the information about what functions are currently in the workspace
class SnapWorkspace extends Component {
    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;
        this.valueWidth = props.valueWidth;
        this.valueHeight = props.valueHeight
        this.sidebarHeight = props.sidebarHeight
        this.sidebarWidth = props.sidebarWidth

        this.state = {
            items: [],


        }

    }

    /**
   * Adds a node to the node array
   * @param {String} type
   * @param {String} name
   * @param {float} x
   * @param {float} y
   */
  pushItem = (type, name, x, y) => {
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
        Error("Error: neither a function or a value item.");
        break;
    }
    const item = {
      // Creating a new item
      name: name,
      type: type,
      x: x,
      y: y,
      renderFunction: rf,
      numOutlets: type === "fun" ? gui.functions[name].min : 0,
      activeOutlets:
        type === "fun"
          ? // e.g. if the function is 'add', this will be [false, false]
          Array(gui.functions[name].min).fill(false)
          : null,
      mouthIDs: [],
      // mouths are the outer functions that "consume" the food (values and nested functions)
      foodIDs: [],
      // anything that is "eaten" (aka nested) within a function mouth
      totalFoodHeight: 0,
      maxFoodWidth: valueWidth,
      imageShowing: false,
      draggable: true,
    };
    this.setState((state, props) => {
      return {
        nodes: [...state.nodes, node],
      };
    });
  };














    // copied from index.js (node and line interface model)












    updateNodePosition = (index, x, y) => {
        let newLst = [...this.state.nodes];
        newLst[index].x = x;
        newLst[index].y = y;
        this.setState({
            nodes: newLst,
        });
    };

    render() {
        return (
            <div
                id="snap-workspace"
                style={{
                    position: "relative",
                    width: this.width,
                    height: this.height,
                    margin: 'auto',
                    backgroundColor: "#F0F0FF",
                    overflow: 'hidden',

                }}
            >
                <Stage
                    
                >
                    <Layer>
                        <FuncBracket
                            x={100}
                            y={100}
                            draggable={true}
                        />
                        <FuncBracket
                            x={300}
                            y={400}
                            draggable={true}
                        />

                        <Rect 
                        width={200}
                        height={100}
                        x={50}
                        y={50}
                        onClick={pushItem (fun, trial, 1000 * Math.random(), 1000 * Math.random() )}
                        />

                        {
                         this.state.items.map(
                            (item, index) => ( 
                            <FuncBracket
                                x={300}
                                y={400}
                                draggable={true}
                                code={item.name}
                            />
                            )
                            
                            )  
                         
                        }


                    </Layer>
                </Stage>
            </div>
        );

    }


}


export default SnapWorkspace;