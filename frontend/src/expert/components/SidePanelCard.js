/**
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

// +--------------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * SidePanelCard.js
 * SidePanelCard is a React functional component. It builds the Side Panel of the 
 * MIST Expert GUI. It contains the user-defined functions as well as the MIST
 * built-in functions. We rely on a parent component to manage the user-defined 
 * functions.
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
    Draggable,
    DragDropContext,
    Droppable
} from 'react-beautiful-dnd';
import {
    Button,
    Card,
    Col,
    Container,
    OverlayTrigger,
    Row,
    Tooltip,
} from 'react-bootstrap';
import { IconContext } from "react-icons";
import {
    FaPen,
    FaRegTrashAlt,
} from 'react-icons/fa';
import {
    MIST_builtin_functions,
    MIST_builtin_values,
} from '../expertGlobals';

function SidePanelCard(props) {

    /*
     * Makes a component draggable. Generates a key using the obj passed as well as
     * and the function createKeyFromObj and an index using a index passed. 
     * If no function is passed, no key will be generated. 
     * 
     * @param {React component} component 
     * @param {Object} obj 
     * @param {Object} param3
     */
    const make_draggable = (component, obj,
        { createKeyFromObj = () => null,
            index = 0,
        }) => (
            <Draggable
                draggableId={createKeyFromObj(obj)}
                index={index}
                key={createKeyFromObj(obj)}
            >
                {(provided) =>
                    (<div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {component}
                    </div>)
                }
            </Draggable>
        ) // make_draggable(Object,Object,Object)

    /*
     * Wraps a component in a Row react-bootstrap component. Generates a 
     * key using the obj passed and the function {createKeyFromObj}.
     * If no function is passed, no key will be generated. 
     * 
     * @param {React component} component 
     * @param {Object} obj 
     * @param {Object} param3 
     */
    const wrap_in_row = (component, obj, { createKeyFromObj }) => (
        <Row
            key={createKeyFromObj(obj)}
            style={{
                justifyContent: "space-between",
                marginBottom: '6px'
            }}>
            {component}
        </Row>
    ) // wrap_in_row(Object,Object,Object)

    /*
     * Adds an Overlay to a React Component. Creates the overlay using a
     * createOverlayFromObj function and the obj passed. Also creates a 
     * key using a createKeyFromObj function and the obj passed. And
     * determines placement using placement field passed.
     * 
     * @param {React component} component 
     * @param {Object} obj 
     * @param {Object} param3 
     */
    const wrap_button_in_overlay = (component, obj, {
        createKeyFromObj = () => null,
        createOverlayFromObj = () => <Tooltip></Tooltip> },
    ) => (
            <OverlayTrigger
                container={props.expertRef}
                key={createKeyFromObj(obj)}
                placement='right'
                overlay={(createOverlayFromObj(obj))}>
                {component}
            </OverlayTrigger>
        )
    // modify button function
    const wrap_custom_icons = (button, obj) => {
        const _warningMessage = 'You are about to delete the saved function ' + obj.name + '. Are you sure you want to continue?';
        return (
            <>
                <Col>
                    <IconContext.Provider
                        value={{ style: { color: 'white', cursor: 'pointer' } }}
                    >
                        <div>
                            <FaRegTrashAlt onClick={() => {
                                props.triggerPopup({
                                    message: _warningMessage,
                                    onConfirm: () => props.deleteFunction(obj.name),
                                });
                            }} />
                        </div>
                    </IconContext.Provider>
                </Col>
                <Col xs={6} padding={0}>
                    {button}
                </Col>
                <Col>
                    <IconContext.Provider
                        value={{ color: 'white', style: { cursor: 'pointer' } }}
                    >
                        <div>
                            <FaPen onClick={() => props.loadSavedFunction(obj.name)} />
                        </div>
                    </IconContext.Provider>
                </Col>
            </>)
    }

    function createButtons(objects, specifiedKeys = null, { button_name, insert_text, wrap_button = (button) => button }) {
        let keys = specifiedKeys || Object.keys(objects).sort();
        return (
            keys.map((obj, idx) => {
                return wrap_button(
                    <Button
                        block
                        className='insertButton'
                        variant='dark'
                        key={idx}
                        onClick={() => { insertText(insert_text(objects[obj])) }}>
                        {button_name(objects[obj])}
                    </Button>,
                    objects[obj],
                    idx
                )
            }))
    }

    /**
    * Insert text into the code field.
    */
    function insertText(text) {
        // Code based on
        //   http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
        const code = document.getElementById('code-editor');
        if (document.selection) { // if text in the code text-field is selected
            code.focus(); // returns the cursor to the code text-field
            var sel = document.selection.createRange(); // creates a fragment of the text-field's value
            sel.text = text; // replaces the fragment with the new text
        }
        else if (code.selectionStart || code.selectionStart === 0) { //if there is not code selected, then selection start will be 0. Slightly convoluted logic, this is a side-effect being used as the main effect instead of just writing the if statement.
            var startPos = code.selectionStart;
            var endPos = code.selectionEnd;
            var scrollTop = code.scrollTop;
            code.value = code.value.substring(0, startPos) + text + code.value.substring(endPos, code.value.length);
            code.focus();
            code.selectionStart = startPos + text.length;
            code.selectionEnd = startPos + text.length;
            code.scrollTop = scrollTop;
            // update state
            props.setCode(code.value);
        }
        else {
            code.value += text;
            code.focus();
            // update state
            props.setCode(code.value);
        }
    } // insertText(txt)

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (destination && source.droppableId === 'user_defined_functions') {
            const new_index = result.destination.index;
            const old_index = result.source.index;
            const old_order = props.getFunctions();
            const new_order = Array.from(old_order);
            new_order.splice(old_index, 1);
            new_order.splice(new_index, 0, draggableId);
            props.setFunctionsOrder(new_order);
        }
    }
    return (
        <Card className='scroll panel'>
            {console.log('rendering sidepanelcard')}
            <Card.Body>
                <Card.Title style={{ color: 'white' }}>Built-In Functions</Card.Title>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId='user_defined_functions'
                    >
                        {(provided) => (
                            <Container ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {
                                    createButtons(props.getStateFunctions(), props.getFunctions(), {
                                        button_name: object => object.name,
                                        insert_text: object => (object.name + ((object.params.length === 0) ? '' : '(' + object.params + ')')),
                                        wrap_button: (button, object, idx) => (
                                            make_draggable(wrap_in_row(
                                                wrap_custom_icons(
                                                    wrap_button_in_overlay(button, object,
                                                        {
                                                            createKeyFromObj: object => object.name,
                                                            createOverlayFromObj: object => (<Tooltip>{object.about}<hr />{(object.name + '(' + object.params + ')')}</Tooltip>)
                                                        }),
                                                    object),
                                                object,
                                                { createKeyFromObj: object => object.name }
                                            ), object, {
                                                createKeyFromObj: object => object.name,
                                                index: idx
                                            })
                                        )
                                    })
                                }
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                    <hr style={{ backgroundColor: 'white' }} />
                    <Container>
                        {
                            createButtons(MIST_builtin_functions, null, {
                                button_name: object => object.display,
                                insert_text: object => (object.display + '(' + object.params + ')'),
                                wrap_button: (button, object, idx) => (
                                    wrap_in_row(
                                        wrap_button_in_overlay(button, object,
                                            {
                                                createKeyFromObj: object => object.name,
                                                createOverlayFromObj: object => (<Tooltip>{object.about}<hr />{(object.display + '(' + object.params + ')')}</Tooltip>)
                                            }),
                                        object,
                                        { createKeyFromObj: object => object.name }
                                    )
                                )
                            })
                        }
                    </Container>
                    <hr style={{ backgroundColor: 'white' }} />
                    <Container>
                        {
                            createButtons(MIST_builtin_values, null, {
                                button_name: object => object.name,
                                insert_text: object => object.name,
                                wrap_button: (button, object, idx) => (
                                    wrap_in_row(
                                        wrap_button_in_overlay(button, object,
                                            {
                                                createKeyFromObj: object => object.name,
                                                createOverlayFromObj: object => (<Tooltip>{object.about}</Tooltip>)
                                            }),
                                        object,
                                        { createKeyFromObj: object => object.name }
                                    )
                                )
                            })
                        }
                    </Container>
                </DragDropContext>
            </Card.Body>
        </Card>
    )
}

SidePanelCard.propTypes = {
    getFormState: PropTypes.func.isRequired,
    getStateFunctions: PropTypes.func.isRequired,
    getFunctions: PropTypes.func.isRequired,
}

export default SidePanelCard;
