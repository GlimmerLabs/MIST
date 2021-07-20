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
 * CanvasCard.js
 *
 * Here we export the CanvasCard React Component which corresponds to the rightmost
 * panel of the MIST Expert GUI. On this panel, the user renders the MIST Image
 * written in the central panel.
 */

import expand_macros, { make_template_string, replace_all } from '../macros';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    OverlayTrigger,
    Row,
    Tooltip,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import {
    FiDownload,
    FiPlay,
    FiStopCircle,
} from 'react-icons/fi';

class CanvasCard extends Component {
    constructor(props) {
        super(props);
        this.animator = null;
        this.canvas = createRef("canvas");
        this.state = { resolution: 200 };
    }

    /**
     * We should only rerender the Canvas if the resolution changes
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.resolution !== this.state.resolution)
    }

    /**
     * Sets the resolution of the MIST Image render via the animator object.
     * @param {number} resolution 
     */
    setResolution(resolution) {
        if (this.state.resolution !== resolution) {
            this.setState({ resolution: resolution });
            if (this.animator) {
                this.canvas.current.width = this.state.resolution;
                this.canvas.current.height = this.state.resolution;
                this.animator.bounds();
                this.animator.setResolution(resolution, resolution);
                this.animator.frame();
            }
        }
    } // setResolution(resolution)

    /**
     * Starts rendering the MIST Image onto the canvas element.
     */
    startAnimator() {
        const MIST = window.MIST;
        if (this.animator) { this.animator.stop(); }
        try {
            let expand_code = this.props.code;
            // check the user has specified default parameters
            if (this.props.default_params) {

                const params = this.props.params.replace(/\s/g, "").split(",");
                const default_params = this.props.default_params.replace(/\s/g, "").split(",");;
                // check that default_params match params in count
                if (params.length === default_params.length) {
                    // surround parameters with brackets
                    expand_code = make_template_string({ code: expand_code, params: params }, {}, {});
                    // replace parameters with default parameters
                    console.log(expand_code);
                    params.forEach((param, idx) => {
                        console.log('here')
                        expand_code = replace_all(expand_code, `{${param}}`, default_params[idx])
                    });
                } else {
                    const error_message = 'There is a mismatch between default_params and params';
                    throw error_message;
                }
            }
            expand_code = expand_macros(expand_code, this.props.getStateFunctions());
            this.props.setMessage(""); // Clear out any previous errors
            this.animator = new MIST.ui.Animator(expand_code, "", {}, this.canvas.current, (txt) => {
                this.props.setMessage(txt);
                throw txt
            });
            this.animator.setResolution(this.state.resolution, this.state.resolution);
            this.animator.start();
            // at this point the image should be rendering
            this.props.setRenderingCode(expand_code);
        } catch (error) {
            this.props.setMessage(error);
            this.props.setRenderingCode('');
        }
    } // startAnimator()

    /**
     * Stops animating the MIST Image in the canvas element. 
     */
    stopAnimator() {
        if (this.animator) {
            this.animator.stop();
        }
    } // stopAnimator()

    /**
     * Downloads the image seen in the canvas element.
     */
    downloadImage() {
        let link = document.createElement('a');
        link.download = (this.props.getFormState().name || 'MISTImage') + '.png';
        link.href = this.canvas.current.toDataURL();
        link.click();
    } // downloadImage()

    render() {
        return (
            <Card
                id='expert-canvas'
                className={(this.props.size ? 'col-' + this.props.size : ' ') + ' scroll panel'}>
                {console.log('rendering canvascard')}
                <Card.Title style={{ color: 'white' }}>Final Image</Card.Title>
                <Card.Body>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <ButtonGroup>
                            <OverlayTrigger
                                container={this.props.expertRef}
                                key={'startAnimation'}
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Start image animation
                                    </Tooltip>
                                }>

                                <Button
                                    className='canvasButton'
                                    onClick={this.startAnimator.bind(this)}
                                >
                                    <FiPlay />
                                </Button>
                            </OverlayTrigger>


                            <OverlayTrigger
                                container={this.props.expertRef}
                                key={'stopAnimation'}
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Stop image animation
                                    </Tooltip>
                                }>
                                <Button
                                    className='canvasButton'
                                    onClick={this.stopAnimator.bind(this)}
                                >
                                    <FiStopCircle />
                                </Button>
                            </OverlayTrigger>


                        </ButtonGroup>
                        <CanvasSlider
                            min={1}
                            max={Math.round(this.canvas.current?.getClientRects()[0].width ?? 400)}
                            step={1}
                            setResolution={(res) => this.setResolution(res)}
                            resolution={this.state.resolution}
                        />
                        <ButtonGroup>
                            <OverlayTrigger
                                container={this.props.expertRef}
                                key={'downloadImagePng'}
                                placement="left"
                                overlay={
                                    <Tooltip>
                                        Locally download the image as a .png
                                    </Tooltip>
                                }>
                                <Button
                                    className='canvasButton'
                                    onClick={() => this.downloadImage()}
                                >
                                    <FiDownload />
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </Row>
                    <Card.Img
                        as="canvas"
                        id="expert-canvas-image"
                        ref={this.canvas}
                        width={500}
                        height={500} />
                </Card.Body>
            </Card>
        )
    }
}

CanvasCard.propTypes = {
    code: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    getFormState: PropTypes.func.isRequired,
    getStateFunctions: PropTypes.func.isRequired,
}

function CanvasSlider(props) {
    return (
        <RangeSlider
            value={props.resolution}
            min={props.min}
            max={props.max}
            step={props.step}
            tooltip={'on'}
            tooltipStyle={{ color: 'white' }}
            tooltipLabel={(value) => ('Resolution: ' + value)}
            onChange={(e) => props.setResolution(parseInt(e.target.value, 10))}
        />
    );

}

CanvasSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    setResolution: PropTypes.func.isRequired,
}

export default CanvasCard;