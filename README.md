This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Conway's Game of Life

This is a typical game of life using the following frameworks:

- React
- Redux
- Redux-Saga

Unlike typical versions where the cells are rendered in the DOM in separate div containers, this project uses a single canvas to render the board. The calculations are run in a redux-saga. This makes it perform quite good.