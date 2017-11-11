import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { settings, setSpeed } from '../store/actions';
import Footer from './Footer';

const mapStateToProps = state => ({
  cols: state.cols,
  rows: state.rows,
  cellSize: state.cellSize,
  speed: state.speed,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    settings,
    setSpeed,
  },
  dispatch,
);

const inputRegex = /^\d{1,3}$/;
const speedRegex = /^\d{1,5}$/;

class FooterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colValue: String(props.cols),
      rowValue: String(props.rows),
      cellSizeValue: String(props.cellSize),
      speedValue: String(props.speed),
    };

    this.updateColValue = this.updateColValue.bind(this);
    this.updateRowValue = this.updateRowValue.bind(this);
    this.updateCellSizeValue = this.updateCellSizeValue.bind(this);
    this.handleClickButton = this.handleClickButton.bind(this);
    this.updateSpeedValue = this.updateSpeedValue.bind(this);
  }

  updateColValue(e) {
    const colValue = e.target.value;
    if (inputRegex.test(colValue)) {
      this.setState(state => ({
        ...state,
        colValue,
      }));
    }
  }

  updateRowValue(e) {
    const rowValue = e.target.value;
    if (inputRegex.test(rowValue)) {
      this.setState(state => ({
        ...state,
        rowValue,
      }));
    }
  }

  updateCellSizeValue(e) {
    const cellSizeValue = e.target.value;
    if (inputRegex.test(cellSizeValue)) {
      this.setState(state => ({
        ...state,
        cellSizeValue,
      }));
    }
  }

  updateSpeedValue(e) {
    const speedValue = e.target.value;
    if (speedRegex.test(speedValue)) {
      this.setState(state => ({
        ...state,
        speedValue,
      }), () => {
        this.props.setSpeed(+speedValue);
      });
    }
  }

  handleClickButton() {
    const { colValue, rowValue, cellSizeValue } = this.state;
    this.props.settings({
      cols: +colValue,
      rows: +rowValue,
      cellSize: +cellSizeValue,
    });
  }

  render() {
    return (
      <Footer
        updateColValue={this.updateColValue}
        updateRowValue={this.updateRowValue}
        updateCellSizeValue={this.updateCellSizeValue}
        handleClickButton={this.handleClickButton}
        updateSpeedValue={this.updateSpeedValue}
        {...this.state}
      />
    );
  }
}
FooterContainer.propTypes = {
  cols: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  settings: PropTypes.func.isRequired,
  setSpeed: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer);
