/* eslint-disable no-confusing-arrow */

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    flex: 1 1 auto;
  }
`;

export const Header = styled.div`
  flex-direction: column;
  align-items: center;
  h1 {
    color : #e0f8f4;
    font-size: 30px;
    span {
      font-size: 18px;
      color: rgba(224, 248, 244, 0.5);
      margin-left: 10px;
      min-width: 100px;
      display: inline-block;
    }
  }
`;

export const Menu = styled.div`
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

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

export const Credits = styled.div`
  display: flex;
  flex-direction: column !important;
  justify-contnt: center;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #89898a;
  a, a:link, a:visited {
    color: #89898a;
    text-decoration: none;
    &: hover {
      text-decoration: underline;
    }
  }
`;

export const SpeedSelector = styled.div`
  color: #e0f8f4;
  margin: 10px;
  margin-top: 20px;
  font-size: 20px;
  span {
    padding: 5px;
  }
  select {
    background: #373440;
    font-size: 20px;
    color: rgb(240,96,96);
    padding: 5px 10px;
    border: 0;
    :focus {
      outline: none;
    }
  }
`;

export const FooterField = styled.div`
  margin: 10px;
  font-size: 20px;
  color: #e0f8f4;
  flex: 0 0 auto;
  input {
    border: 0;
    color: rgb(240,96,96);
    font-size: 20px;
    padding: 5px 10px;
    width: 40px;
    background: #373440;
    :focus {
      outline: none;
    }
  }
`;

const Button = styled.button`
  font-size: 24px;
  border: 0;
  padding: 5px 10px;
  margin: 0 10px;
  border: 2px solid;
  :focus {
    outline: none;
  }
`;

export const StartButton = Button.extend`
  background: ${p => p.active ? 'rgb(242, 235, 191)' : 'rgba(242, 235, 191, 0.5)'};
  border-color: ${p => p.active ? 'rgb(242, 235, 191)' : 'transparent'};
  ${p => p.active && `
  :hover {
    border-color: rgb(240, 96, 96);
  }
  `}
`;
export const PauseButton = Button.extend`
  background: ${p => p.active ? 'rgb(242, 235, 191)' : 'rgba(242, 235, 191, 0.5)'};
  border-color: ${p => p.active ? 'rgb(242, 235, 191)' : 'transparent'};
  ${p => p.active && `
  :hover {
    border-color: rgb(240, 96, 96);
  }
  `}
`;
export const ClearButton = Button.extend`
  background: rgb(240, 96, 96);
  border-color: rgb(240, 96, 96);
  :hover {
    border-color: rgb(242, 235, 191);
  }
`;

export const UpdateButton = Button.extend`
  background: rgb(242, 235, 191);
  border-color: rgb(242, 235, 191);
  :hover {
    border-color:  rgb(240, 96, 96);
  }
`;
