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
/**
 * 2020-07-24 Version 1.0
 *
 * index.js
 * This is the main file used to create the MIST expert page located at the /expert
 * route. 
 * 
 * Basic Layout: 
 * 
 * Working Definitions: 
 * 1. Function
 * 
 * 2. Workspace
 * 
 * Here we build the Expert component which manages the state of the form on
 * the expert page as well as the function-macros defined by the user. We divide the
 * page into the React Components: Menu, SidePanelCard, WorkspaceCard, CanvasCard;
 * whose corresponding files are located in './components'. We go into more detail
 * of each Component in the list below as well as in the Notes Headers of the respective
 * files.
 * 
 * 1. Menu
 * 
 * 2. SidePanelCard
 * 
 * 3. WorkspaceCard
 * 
 * 4. CanvasCard
 * 
 * 
 * We also rely on a Popup Component, whose contents will be modified at
 * shown whenever a popup is needed via the triggerPopup() function.
 * 
 * The initialState of the Expert Component is stored under './initial-state.js
 * 
 * We handle macros using the expand_macros function from the './macros' module.
 * 
 * We keep track of following states using React hooks:
 * popup, form, macros, rendering_code
 * 
 * We define a workspace to be both the contents of the form wherein we allow the 
 * users to write their functions, and the where we write code that renders into an image. Thus,
 * it is the object { form: object, functions: object} where the object corresponding
 * to 'form' is the hook 'form' and the object corresponding 'functions' is the hook macros.
 * 
 * Our definition of workspace had changed overtime, at first it only meant the contents
 * of the 'function form' which is why the central panel is named WorksapceCard; we should
 * rename this file and component in the future. 
 * 
 */

import '../design/styleSheets/expert.css';
import CanvasCard from './components/CanvasCard';
import Menu from './components/Menu';
import Popup from './components/Popup';
import WorkspaceCard from './components/WorkspaceCard';
import SidePanelCard from './components/SidePanelCard';
import { getInitialForm, getInitialMacros, getInitialPopup, } from './initial-state';
import expand_macros from './macros';
import React, { createRef, useEffect, useState } from 'react';
import ResizablePanels from "resizable-panels-react";

// +---------------------------------
// | Expert |
// +--------+
function Expert(props) {
    const codeRef = createRef("code");
    const expertRef = createRef("expert");

    // +-------+------------------------------------------------------------------------
    // | Popup |
    // +-------+
    const [popup, setPopup] = useState(getInitialPopup());

    /**
     * Opens and Closes the current Popup.
     * */
    const togglePopup = () => {
        setPopup({
            ...popup,
            isOpen: !popup.isOpen,
        })
    }

    /**
     * Opens a Popup with the given message and a specific confirmation action.
     * @param {*} param0 
     */
    const triggerPopup = ({ footer = true, message, onConfirm, title = 'Warning' }) => {
        setPopup({
            ...popup,
            footer: footer,
            isOpen: !popup.isOpen,
            message: message,
            title: title,
            onConfirm: onConfirm,
        })
    }

    // +------+------------------------------------------------------------------------
    // | Form |
    // +------+
    const [form, setForm] = useState(getInitialForm());
    // For when we have a Link to the Expert UI from the GUI ready.
    useEffect(() => {
        if (props.location && props.location.state && props.location.state.code) {
            setForm({
                ...getInitialForm(),
                code: props.location.state.code,
            })
        }
    }, [props.location])
    /**
     * Resets the form to the initial state.
     */
    const resetForm = () => {
        setForm(getInitialForm);

    }

    /** 
     * Returns true if the form is in use, otherwise it returns false.
     */
    const isFormInUse = () => {
        const initialForm = getInitialForm();
        let inUse = false;
        Object.keys(form).forEach(field => {
            if (form[field] !== initialForm[field]) {
                inUse = true;
                return;
            }
        })
        return inUse;
    }


    /**
     * Loads the object (functionToLoad) into the form.
     */
    const loadFunctionToForm = (functionToLoad) => {
        const fun = { ...functionToLoad };
        if (Array.isArray(fun.params)) {
            fun.params = fun.params.toString();
        }
        setForm(fun);
    }

    /**
     * Returns a value from the form corresponding to the key str.
     */
    const getFormValue = (str) => {
        return form[str]
    }

    /**
     * Sets a field in the form.
     */
    const setFormValue = (key, to) => {
        setForm({
            ...form,
            [key]: to,
        })
    }

    // +--------+------------------------------------------------------------------------
    // | Macros |
    // +--------+
    const [macros, setMacros] = useState(getInitialMacros());

    /**
     * Saves a user defined function to be resused in the workspace.
     * @param {Object} new_function 
     */
    const addFunctionToState = (new_function) => {
        const new_function_name = Object.keys(new_function)[0];
        const new_order = [...macros._order.filter(name => name !== new_function_name), new_function_name];
        const new_macros = Object.assign({}, macros, { _order: new_order }, new_function);
        setMacros(new_macros);
    } // addFunctionToState(Object)

    /**
     * Wrapper that adds checks before saving a user definde function.
     */
    const addUserDefinedFunction = () => {
        const funct = form;
        const name = funct.name;
        const code = funct.code;

        if (name && code) {
            let params;
            if (funct.params)
                params = funct.params.replace(/\s/g, "").split(",");
            else
                params = [];
            try {
                // try expanding the code
                expand_macros(code, macros);
                // if no error then...
                const about = funct.description;
                const new_function =
                {
                    name: name,
                    about: about,
                    params: params,
                    code: code,
                };

                addFunctionToState({ [name]: new_function });
            }
            catch (error) {
                setFormValue('message', error);
            }

        } else {
            alert('We need both name and code filled out!')
        }
    } // addUserDefinedFunction()

    /**
     * Reorders the macros.
     * @param {Array} order 
     */
    const setFunctionsOrder = (order) => {
        setMacros({
            ...macros,
            _order: order,
        })
    }

    /**
     * Removes the user defined function by the name fun_name.
     */
    const deleteFunction = (fun_name) => {
        const new_macros = { ...macros, _order: macros._order.filter((name) => name !== fun_name) }
        delete macros[fun_name];
        setMacros(new_macros)
    }
    // +-----------+------------------------------------------------------------------------
    // | Workspace |
    // +-----------+

    /**
     * Saves a workspace to the authenticated user's account.
     */
    const _save = (workspace) => {
        fetch('api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'saveexpertws', workspace: (workspace) })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Expert-Workspace ' + workspace.name + ' has been successfully saved!');
                } else {
                    alert('We failed to save because of ' + data.message);
                }
            })
            .catch(error => alert('We failed to save because of Error: ' + error))
    }

    /**
     * Wrapper that checks the if the user already has an expert workspace
     * of the given name and triggers a popup that asks for overwrite 
     * confirmation.
     * 
     * @param {String} name 
     */
    const saveWSToUser = (name) => {
        // build the expert_workspace to save
        const workspace = { functions: macros, form: form, name: name };
        console.log(form)
        console.log(macros)
        console.log(getCurrentWorkspace())
        // build the url
        let url = "api/?action=expertwsexists&name=" + name;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    if (data.hasWorkspace) {
                        triggerPopup({
                            message: 'You are about to overwrite the workspace: ' + name + '. Click confirm to continue.',
                            onConfirm: () => { _save(workspace) }
                        })
                    } else {
                        _save(workspace);
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(error => { alert('Failed due to ' + error); console.log(error) })

    }

    /**
     * Delete a workspace.
     */
    const _deleteExpertWorkspace = (name) => {
        fetch('api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'deleteexpertws', name: name })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Expert-Workspace ' + name + ' has been successfully deleted!');
                } else {
                    alert('We failed to delete because of ' + data.message);
                }
            })
            .catch(error => alert('We failed to delete because of Error: ' + error))
    }

    /** 
     * Loads a user's expert workspaces.
     */
    const getUserExpertWS = async () => {
        return (
            fetch('/api?action=getUserExpertWS')
                .then(res => res.json())
                .then(data => data)
                .catch(error => { alert('Failed due to ' + error); console.log(error) }))
    }

    /**
     * Loads the stored user-saved functions (while preserving order) and the stored form
     * values stored in workspaceToLoad.
     * 
     * @param {Object} workspaceToLoad, whose keys matches the initialState object found in
     * './initial-state.js' 
     */
    const loadWorkspace = (workspaceToLoad) => {
        setForm(workspaceToLoad.form);
        setMacros(workspaceToLoad.functions);
    } // loadWorkspace(Object)

    /**
     * Resets the workspace to initial values.
     */
    const resetWorkspace = () => {
        setForm(getInitialForm());
        setMacros(getInitialMacros());
    }

    /**
     * Return true if the workspace is in use, otherwise it returns false.
     */
    const isWorkspaceInUse = () => {
        return isFormInUse() || (macros._order.length !== 0);
    }

    /**
     * Returns the current workspace.
     */
    const getCurrentWorkspace = () => {
        return ({
            functions: macros,
            form: form,
        })
    }

    /**
     * Rendering code: This should always contain valid MIST Code
     */
    const [rendering_code, setRenderingCode] = useState('');

    return (
        <div id='expert' ref={expertRef} >
            {console.log('rendering expert')}
            <Popup
                {...popup}
                onClose={togglePopup}
            />
            <Menu
            
                getCurrentWorkspace={getCurrentWorkspace}
                getUserExpertWS={getUserExpertWS}
                isWorkspaceInUse={isWorkspaceInUse}
                loadWorkspace={loadWorkspace}
                resetWorkspace={resetWorkspace}

                requestFullscreen={() => {
                    expertRef.current.requestFullscreen()
                }}
                exitFullscreen={() => document.exitFullscreen()}

                deleteWorkspace={_deleteExpertWorkspace}
                saveWorkspace={saveWSToUser}

                togglePopup={togglePopup}
                triggerPopup={triggerPopup}

                rendering_code={rendering_code}
            />

            <ResizablePanels
                bkcolor="#353b48"
                displayDirection="row"
                width="100%"
                height="100vh"
                panelsSize={[15, 43, 42]}
                sizeUnitMeasure="%"
                resizerSize="10px"
            >
                <SidePanelCard
                    deleteFunction={deleteFunction}
                    expertRef={expertRef}
                    getFormState={() => form}
                    getStateFunctions={() => macros}
                    getFunctions={() => macros._order}
                    loadSavedFunction={(fun_name) => loadFunctionToForm(macros[fun_name])}
                    setCode={txt => { setFormValue('code', txt) }}
                    setFunctionsOrder={order => setFunctionsOrder(order)}

                    triggerPopup={triggerPopup}
                />

                <WorkspaceCard

                    addUserDefinedFunction={addUserDefinedFunction}
                    doesFunctionExist={(fun_name) => (fun_name in macros)}

                    clearFunction={resetForm}
                    getCurrentWorkspace={getCurrentWorkspace}
                    loadFunction={loadFunctionToForm}
                    functions={macros._order}

                    code={getFormValue('code')}
                    codeRef={codeRef}
                    description={getFormValue('description')}
                    expertRef={expertRef}
                    name={getFormValue('name')}
                    message={getFormValue('message')}
                    params={getFormValue('params')}
                    default_params={getFormValue('default_params')}
                    setCode={(code) => setFormValue("code", code)}
                    setDescription={(description) => setFormValue("description", description)}
                    setDefaultParams={(default_params) => setFormValue("default_params", default_params)}

                    setName={(name) => setFormValue("name", name)}
                    setParams={(params) => setFormValue("params", params)}

                    triggerPopup={triggerPopup}
                />
                <CanvasCard
                    code={getFormValue('code')}
                    default_params={getFormValue('default_params')}
                    expertRef={expertRef}
                    getFormState={() => form}
                    getStateFunctions={() => macros}
                    params={getFormValue('params')}
                    setMessage={(message) => setFormValue("message", message)}
                    setRenderingCode={setRenderingCode}
                />
            </ResizablePanels>

        </div>)
}
export default Expert;