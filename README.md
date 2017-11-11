This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Conway's Game of Life

This is a typical game of life using the following frameworks:

- React
- Redux
- Redux-Saga

Unlike typical versions where the cells are rendered in the DOM in separate div containers, this project uses a single canvas to render the board. The calculations are run in a redux-saga. This makes it perform quite good.

## How to run it

You need yarn (or npm) and Node installed.

Should work for Node 6.11.5 or higher.

```
git clone https://github.com/ChrisGitter/game-of-life.git
cd game-of-life
yarn install
yarn start
```
