import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import App from './App';

const mapStateToProps = state => ({
  active: state.active,
  cycles: state.cycles,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  start: actions.start,
  pause: actions.pause,
  clear: actions.clear,
  init: actions.init,
  addCell: actions.addCell,
}, dispatch);

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.init = false;

    this.setRef = this.setRef.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickCanvas = this.handleClickCanvas.bind(this);
  }

  setRef(elem) {
    if (!this.init && elem) {
      this.props.init(elem);
      this.init = true;
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
    const { offsetTop, offsetLeft } = e.target;
    const { pageX, pageY } = e;
    const clickX = pageX - offsetLeft;
    const clickY = pageY - offsetTop;
    this.props.addCell([clickX, clickY]);
  }

  render() {
    return (
      <App
        active={this.props.active}
        setRef={this.setRef}
        cycles={this.props.cycles}
        handleClickStart={this.handleClickStart}
        handleClickPause={this.handleClickPause}
        handleClickClear={this.handleClickClear}
        handleClickCanvas={this.handleClickCanvas}
      />
    );
  }
}
AppContainer.propTypes = {
  active: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
  addCell: PropTypes.func.isRequired,
  cycles: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
