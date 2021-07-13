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

// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * Menu.js
 * 
 * This exports the Menu component of the MIST Expert GUI.
 * 
 */

import PropTypes from 'prop-types';
import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownButton,
    Form,
    FormControl,
    ListGroup,
    Nav,
    Navbar,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { BsCloud, BsFullscreen, BsFullscreenExit, BsQuestionCircle } from 'react-icons/bs';
import { FaRegShareSquare } from 'react-icons/fa';

function Menu(props) {
    // A reference to keep track of the name that the user picks for their workspace
    const workspaceNameRef = createRef('workspaceName');
    const finalimageNameRef = createRef('finalimageName');
    return (
        <Navbar id='menu' bg="dark" variant="dark" style={{ justifyContent: 'space-between', }}>
            <Nav>

                <Button
                    className='menu-btn'
                    onClick={() => {
                        props.triggerPopup({
                            footer: false,
                            message: (
                                <div>
                                    <ListGroup>
                                        <ListGroup.Item>
                                            The <b>Side Panel</b> is the left-most panel is where you
                                        access builtin MIST functions and values as well as your saved functions.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Central Panel</b> is where you can write and save your own MIST function with however many
                                        parameters as well as write your MIST Image.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Final Image Panel</b> is where you can render and see the MIST image that you wrote out
                                        in the Central Panel.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Workspace</b> you save is both the functions that you have saved as well as the contents
                                        of the function that you are currently writing.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            If you need additional help to start using the Expert UI, click the following button to
                                            checkout our tutorial!
                                            <a href='/tutorial/#expert-ui'>
                                                <Button>To Tutorials</Button>
                                            </a>
                                        </ListGroup.Item>

                                    </ListGroup>
                                </div>
                            ),
                            title: 'MIST Expert UI Terminology',
                        })
                    }}
                    variant="outline-light">
                    <BsQuestionCircle

                    />
                </Button>
                <FileDropdown
                    deleteWorkspace={props.deleteWorkspace}
                    getCurrentWorkspace={props.getCurrentWorkspace}
                    getUserExpertWS={props.getUserExpertWS}
                    isWorkspaceInUse={props.isWorkspaceInUse}
                    loadWorkspace={props.loadWorkspace}
                    resetWorkspace={props.resetWorkspace}
                    togglePopup={props.togglePopup}
                    triggerPopup={props.triggerPopup}
                    workspaceNameRef={workspaceNameRef}
                />
            </Nav>
            <Nav>
                <Form inline>
                    <FormControl
                        className="mr-sm-2"
                        placeholder="Name your Workspace"
                        ref={workspaceNameRef}
                        type="text"
                    />
                </Form>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Save your workspace</Tooltip>}
                >
                    <Button className='menu-btn'
                        onClick={() => props.saveWorkspace(workspaceNameRef.current.value)}
                        variant='outline-light'> <BsCloud /> Save</Button>
                </OverlayTrigger>
            </Nav>

            <Nav>
                <Form inline>
                    <FormControl
                        className="mr-sm-2"
                        placeholder="Name your Final Image"
                        ref={finalimageNameRef}
                        type="text"
                    />
                </Form>
                <OverlayTrigger
                    placement='top' //might be good to change to 'bottom;
                    overlay={<Tooltip>Publish your final image</Tooltip>}
                >
                    <Button className='menu-btn'
                        variant='outline-light'
                        onClick={() => {
                            if (!finalimageNameRef.current.value || !props.rendering_code) {
                                if (!finalimageNameRef.current.value)
                                    alert('Enter a valid final image name')
                                else
                                    alert('Please render an image to save')
                            } else {
                                //props.triggerPopup({message: 'You are about to publish the image'finalimageNameRef.current.value, props.rendering_code});
                                // check if the user already has an image with that title
                                // or if the user is not logged in 
                                const title = finalimageNameRef.current.value;

                                let url = "api?action=imageexists&title=" + title;
                                fetch(url)
                                    .then((res) => res.json())
                                    .then((response) => {
                                        switch (response) {
                                            case "logged out":
                                                alert("Please log in to save images.")
                                                break;
                                            case "image exists":
                                                alert("You already have an image with this name; please name it something else.")
                                                break;
                                            case "image does not exist":
                                                let image = {
                                                    action: "saveimage",
                                                    title: title,
                                                    code: props.rendering_code
                                                }
                                                // save the image
                                                fetch("api", {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    credentials: 'include',
                                                    body: JSON.stringify(image)
                                                })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        if (data.success)
                                                            alert(data.message);
                                                        else {
                                                            alert('Failed to save due to ' + (data.message || data))
                                                        }
                                                    })
                                                    .catch(err => alert('Failed to save due to Error: ' + err))
                                                break;
                                            default: {
                                                // we do not expect to reach this state
                                                console.log('Unexpected result')
                                            }
                                        }
                                    })
                                    .catch(error => alert('Failed to fetch due to Error: ' + error))

                            }
                        }}
                    ><FaRegShareSquare /> Publish</Button>
                </OverlayTrigger>
            </Nav>
            <FullscreenButton
                requestFullscreen={props.requestFullscreen}
                exitFullscreen={props.exitFullscreen}
            />
        </Navbar>
    )
}

Menu.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    requestFullscreen: PropTypes.func.isRequired,
    exitFullscreen: PropTypes.func.isRequired,
}

/**
 * Button for the user to toggle fullscreen
 */
function FullscreenButton(props) {
    const [fullscreen, setFullscreen] = useState(document.requestFullscreen);
    useEffect(() => {
        const listener = () => setFullscreen(document.requestFullscreen);
        document.addEventListener('fullscreenchange', listener);
        return () => {
            document.removeEventListener('fullscreenchange', listener);
        }
    }, []);

    if (fullscreen) {
        return (
            <Button
                className='menu-btn'
                onClick={props.exitFullscreen}
                variant='outline-light'><BsFullscreenExit /></Button>
        );
    } else {
        return (
            <Button
                className='menu-btn'
                onClick={props.requestFullscreen}
                variant='outline-light'><BsFullscreen /></Button>
        );
    }
}

/**
 * Dropdown for where the user can perform actions related to workspaces other than saving
 */
function FileDropdown(props) {
    const handleDeleteOnClick = async () => {
        const data = await props.getUserExpertWS();
        if (data.success) {
            props.triggerPopup({
                footer: false,
                title: 'Choose an Expert Workspace to Delete',
                message: (<ButtonGroup vertical>
                    {data.expertWorkspaces.map(expert_workspace => (
                        <Button
                            className='menu-btn'
                            onClick={() => { props.deleteWorkspace(expert_workspace.name); props.togglePopup() }}
                            variant='outline-primary'
                        >
                            {expert_workspace.name}
                        </Button>
                    ))}
                </ButtonGroup>),
            })
        } else {
            alert(data.message)
        }
    }
    return (
        <>
            <DropdownButton
                as={ButtonGroup}
                className='menu-btn'
                id="file"
                title="File"
                variant="outline-light"
            >
                <Dropdown.Item
                    onClick={() => {
                        if (props.isWorkspaceInUse()) {
                            props.triggerPopup({
                                message: 'Your workspace is currently in use. Are you sure that you want to reset it?',
                                onConfirm: props.resetWorkspace,
                            })
                        }
                    }}
                >Reset Workspace</Dropdown.Item>

                <ImportWorkspace
                    getUserExpertWS={props.getUserExpertWS}
                    loadWorkspace={props.loadWorkspace}
                    triggerPopup={props.triggerPopup}
                    workspaceNameRef={props.workspaceNameRef} />
                <Dropdown.Item onClick={handleDeleteOnClick}>Delete Workspace</Dropdown.Item>
                <Dropdown.Divider />

            </DropdownButton>{' '}
        </>
    )
}

FileDropdown.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    workspaceNameRef: PropTypes.object.isRequired,
}

/**
 * Button for the user to load a saved workspace from the server 
 */
function ImportWorkspace(props) {
    const handleOnClick = async () => {
        const data = await props.getUserExpertWS();
        if (data.success) {
            props.triggerPopup({
                footer: false,
                title: 'Choose an Expert Workspace to Load',
                message: (<ButtonGroup vertical>
                    {data.expertWorkspaces.map(expert_workspace => (
                        <Button
                            className='menu-btn'
                            onClick={() => props.loadWorkspace(expert_workspace)}
                            variant='outline-primary'
                        >
                            {expert_workspace.name}
                        </Button>
                    ))}
                </ButtonGroup>),
            })
        } else {
            alert(data.message)
        }
    }

    return (
        <>
            <Dropdown.Item onClick={handleOnClick}>Load a Workspace</Dropdown.Item>
        </>
    );
}

export default React.memo(Menu);