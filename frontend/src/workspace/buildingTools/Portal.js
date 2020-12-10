// https://github.com/tajo/react-portal/blob/55ed77ab823b03d1d4c45b950ba26ea5d687e85c/src/LegacyPortal.js

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends React.Component {
  componentDidMount() {
    this.renderPortal();
  }

  componentDidUpdate(props) {
    this.renderPortal();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.defaultNode || this.props.node);
    if (this.defaultNode) {
      const portalTo = this.props.portalTo;
      const portalTarget = portalTo ? document.getElementById(portalTo) : document.body;
      portalTarget.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  renderPortal(props) {
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      const portalTo = this.props.portalTo;
      const portalTarget = portalTo ? document.getElementById(portalTo) : document.body;
      portalTarget.appendChild(this.defaultNode);
    }

    let children = this.props.children;
    if (typeof children.type === 'function') {
      children = React.cloneElement(children);
    }

    ReactDOM.render(children, this.props.node || this.defaultNode);
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  portalTo: PropTypes.string
}

export default Portal;