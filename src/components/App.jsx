import React from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  Board,
  ClearButton,
  Header,
  PauseButton,
  StartButton,
  Menu,
} from './styled';
import FooterContainer from './FooterContainer';

const App = ({
  active,
  setRef,
  sizeX,
  sizeY,
  handleClickStart,
  handleClickPause,
  handleClickClear,
  handleClickCanvas,
}) => (
  <Wrapper>
    <Header>
      <h1>
        {"Conway's Game of Life"}
      </h1>
      <Menu>
        <StartButton
          onClick={handleClickStart}
          active={!active}
        >
          Start
        </StartButton>
        <PauseButton
          onClick={handleClickPause}
          active={active}
        >
          Pause
        </PauseButton>
        <ClearButton
          onClick={handleClickClear}
        >
          Clear
        </ClearButton>
      </Menu>
    </Header>
    <Board>
      <canvas
        ref={setRef}
        height={sizeY}
        width={sizeX}
        onClick={handleClickCanvas}
      />
    </Board>
    <FooterContainer />
  </Wrapper>
);
App.propTypes = {
  handleClickStart: PropTypes.func.isRequired,
  handleClickPause: PropTypes.func.isRequired,
  handleClickClear: PropTypes.func.isRequired,
  handleClickCanvas: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  setRef: PropTypes.func.isRequired,
  sizeX: PropTypes.number.isRequired,
  sizeY: PropTypes.number.isRequired,
};

export default App;
