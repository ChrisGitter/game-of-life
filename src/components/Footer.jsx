import React from 'react';
import PropTypes from 'prop-types';
import { FooterWrapper, FooterField, UpdateButton } from './styled';

const Footer = ({
  colValue,
  rowValue,
  cellSizeValue,
  updateColValue,
  updateRowValue,
  updateCellSizeValue,
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
    </div>
    <div>
      <UpdateButton>
        Update
      </UpdateButton>
    </div>
  </FooterWrapper>
);
Footer.propTypes = {
  colValue: PropTypes.string.isRequired,
  rowValue: PropTypes.string.isRequired,
  cellSizeValue: PropTypes.string.isRequired,
  updateColValue: PropTypes.func.isRequired,
  updateRowValue: PropTypes.func.isRequired,
  updateCellSizeValue: PropTypes.func.isRequired,
};

export default Footer;
