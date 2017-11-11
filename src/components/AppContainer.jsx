import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import App from './App';

const mapStateToProps = state => ({
  active: state.active,
  sizeX: state.sizeX,
  sizeY: state.sizeY,
  canvas: state.canvas,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  start: actions.start,
  pause: actions.pause,
  clear: actions.clear,
  init: actions.init,
}, dispatch);

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickCanvas = this.handleClickCanvas.bind(this);
  }

  setRef(elem) {
    if (!this.props.canvas && elem) {
      this.props.init(elem);
    }
  }

  handleClickStart() {
    this.props.start();
  }

  handleClickPause() {
    this.props.pause();
  }

  handleClickClear() {
    this.props.clear();
  }

  handleClickCanvas(e) {
    console.log('clicked canvas', e);
  }

  render() {
    const { start, pause, clear, ...props} = this.props;
    return (
      <App
        setRef={this.setRef}
        handleClickStart={this.handleClickStart}
        handleClickPause={this.handleClickPause}
        handleClickClear={this.handleClickClear}
        handleClickCanvas={this.handleClickCanvas}
        {...props}
      />
    );
  }
}
AppContainer.propTypes = {
  start: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
