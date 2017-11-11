import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    flex: 1 1 auto;
  }
`;

export const Header = styled.div`
  flex-direction: row;
  align-items: space-between;
`;

export const Board = styled.div`
  justify-content: center;
  margin: 20px 0;
  canvas {
    border: 1px solid #333;
  }
`;

export const Footer = styled.div`
  flex-direction: row;
  align-items: space-between;
`;

const Button = styled.button`
  font-size: 20px;
`;

export const StartButton = Button.extend``;
export const PauseButton = Button.extend``;
export const ClearButton = Button.extend``;
