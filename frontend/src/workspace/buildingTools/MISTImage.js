import React, { useEffect, useState } from "react";
import MIST from '../mist/mistui.js';

/* MISTImage props
 *   resolution: the resolution used to render the image (may be smaller than
 *     the actual canvas)
 *   code: the MIST code used to render the image
 *   width: (optional, defaults to resolution) the width of the canvas
 *   height: (optional, defaults to resolution) the height of the canvas
 */
export default function MISTImage(props) {
  
  const [canvas] = useState(React.createRef());
  const [animator, setAnimator] = useState(null);

  useEffect(() => {
    if (animator) {
      animator.stop();
    }
    const new_animator = new MIST.ui.Animator(
      props.renderFunction,
      "",
      {},
      canvas.current
    );
    new_animator.setResolution((props.width < 150) ? props.width : 150,
        (props.height < 150) ? props.height : 150);
    new_animator.frame();
    if(props.automated) {
        new_animator.start();
    }
    setAnimator(new_animator);
    return () => {
      if (animator) {
        animator.stop();
      }
    };
  }, [props.renderFunction, canvas, setAnimator]);

  useEffect(() => {
    if (animator) {
      animator.setResolution((props.width < 150) ? props.width : 150,
      (props.height < 150) ? props.height : 150);
      animator.frame();
    }
  }, [animator, props.width, props.height]);

  return (
    <canvas
      height='500'
      width='500'
      className="mist-image"
      style={{
        position: "absolute",
        top: props.y,
        left: props.x,
        width: props.width,
        height: props.height,
      }}
      onMouseOut={() => {
        if (!props.automated) {
          if (animator) {
            animator.stop();
          }
        }
      }}
      onMouseOver={() => {
        if (!props.automated) {
          if (animator) {
            animator.stop();
            animator.start();
          }
        }
      }}
      onClick={props.onClick}
      ref={canvas}
    />
  );
}
