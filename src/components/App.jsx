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
  cycles,
  handleClickStart,
  handleClickPause,
  handleClickClear,
  handleClickCanvas,
}) => (
  <Wrapper>
    <Header>
      <h1>
        {"Conway's Game of Life"}
        <span>
          {cycles} cycles
        </span>
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
  cycles: PropTypes.number.isRequired,
};

export default App;
