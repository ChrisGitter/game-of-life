import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from './Footer';

const mapStateToProps = state => ({
  cols: state.cols,
  rows: state.rows,
  cellSize: state.cellSize,
});

const inputRegex = /^\d{1,3}$/;

class FooterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colValue: String(props.cols),
      rowValue: String(props.rows),
      cellSizeValue: String(props.cellSize),
    };

    this.updateColValue = this.updateColValue.bind(this);
    this.updateRowValue = this.updateRowValue.bind(this);
    this.updateCellSizeValue = this.updateCellSizeValue.bind(this);
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

  render() {
    return (
      <Footer
        updateColValue={this.updateColValue}
        updateRowValue={this.updateRowValue}
        updateCellSizeValue={this.updateCellSizeValue}
        {...this.state}
      />
    );
  }
}
FooterContainer.propTypes = {
  cols: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(FooterContainer);
