/* MISTImage props
 *   resolution: the resolution used to render the image (may be smaller than
 *     the actual canvas)
 *   code: the MIST code used to render the image
 *   width: (optional, defaults to resolution) the width of the canvas
 *   height: (optional, defaults to resolution) the height of the canvas
 */

import React, {useEffect, useState} from 'react';

export default function MISTImage(props) {
  const [canvas] = useState(React.createRef());
  const [animator, setAnimator] = useState(null);

  useEffect(() => {
    const new_animator = new window.MIST.ui.Animator(props.code, [], {}, canvas.current);
    new_animator.setResolution(props.resolution, props.resolution);
    new_animator.frame();
    setAnimator(animator => {
      if (animator) {
        animator.stop();
      }
      return new_animator;
    });
    return () => {
      new_animator.stop();
    }
  }, [props.resolution, props.code, canvas, setAnimator]);

  return (
    <canvas
      className="mist-image"
      width={props.width ?? props.resolution}
      height={props.height ?? props.resolution}
      onMouseOut={() => {
        if (animator) {
          animator.stop();
        }
      }}
      onMouseOver={() => {
        if (animator) {
          animator.stop();
          animator.start();
        }
      }}
      ref={canvas}
    />
  );
}