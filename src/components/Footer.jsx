import React from 'react';
import PropTypes from 'prop-types';
import Heart from 'react-icons/lib/go/heart';
import Github from 'react-icons/lib/go/mark-github';
import { FooterWrapper, FooterField, UpdateButton, SpeedSelector, Credits } from './styled';

const Footer = ({
  colValue,
  rowValue,
  cellSizeValue,
  speedValue,
  updateColValue,
  updateRowValue,
  updateCellSizeValue,
  updateSpeedValue,
  handleClickButton,
}) => (
  <FooterWrapper>
    <div>
      <FooterField>
        Columns: <input value={colValue} onChange={updateColValue} />
      </FooterField>
      <FooterField>
        Rows: <input value={rowValue} onChange={updateRowValue} />
      </FooterField>
      <FooterField>
        Cell Size: <input value={cellSizeValue} onChange={updateCellSizeValue} />
      </FooterField>
      <UpdateButton onClick={handleClickButton}>
        Update
      </UpdateButton>
    </div>
    <SpeedSelector>
      <span>Speed:</span>
      <select value={speedValue} onChange={updateSpeedValue}>
        <option value="50">Lightspeed</option>
        <option value="100">Fast</option>
        <option value="250">Medium</option>
        <option value="500">Kind of slow</option>
        <option value="1000">Boring</option>
      </select>
    </SpeedSelector>
    <Credits>
      <p>Made with <Heart /></p>
      <p><a href="https://github.com/ChrisGitter/game-of-life">View on Github <Github /></a></p>
    </Credits>
  </FooterWrapper>
);
Footer.propTypes = {
  colValue: PropTypes.string.isRequired,
  rowValue: PropTypes.string.isRequired,
  cellSizeValue: PropTypes.string.isRequired,
  speedValue: PropTypes.string.isRequired,
  updateColValue: PropTypes.func.isRequired,
  updateRowValue: PropTypes.func.isRequired,
  updateCellSizeValue: PropTypes.func.isRequired,
  updateSpeedValue: PropTypes.func.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

export default Footer;
