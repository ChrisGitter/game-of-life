import React from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  Board,
  ClearButton,
  Footer,
  Header,
  PauseButton,
  StartButton,
} from './styled';

const App = ({
  handleClickStart,
  handleClickPause,
  handleClickClear,
  handleClickCanvas,
  setRef,
  sizeX,
  sizeY,
}) => (
  <Wrapper>
    <Header>
      <StartButton onClick={handleClickStart} >Start</StartButton>
      <PauseButton onClick={handleClickPause} >Pause</PauseButton>
      <ClearButton onClick={handleClickClear} >Clear</ClearButton>
    </Header>
    <Board>
      <canvas
        ref={setRef}
        height={sizeY * 10}
        width={sizeX * 10}
        onClick={handleClickCanvas}
      />
    </Board>
    <Footer />
  </Wrapper>
);
App.propTypes = {
  handleClickStart: PropTypes.func.isRequired,
  handleClickPause: PropTypes.func.isRequired,
  handleClickClear: PropTypes.func.isRequired,
  handleClickCanvas: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired,
  sizeX: PropTypes.number.isRequired,
  sizeY: PropTypes.number.isRequired,
};

export default App;
