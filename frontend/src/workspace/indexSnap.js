import React, { useState, useRef, useContext, Component }from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import gui from "./globals/mistgui-globals";
// import { globalContext } from "../globals/global-context";
// import { fontContext } from "../globals/globals-fonts";

class SnapWorkspace extends Component {
    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;
        this.inputWidth = props.inputWidth;
        this.inputHeight = props.inputHeight

        this.state = {
            roots: [],


        }

    }


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

                </Stage>
            </div>
        );

    }



}


export default SnapWorkspace;