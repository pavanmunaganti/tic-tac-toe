import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import * as serviceWorker from "./serviceWorker";
function Square(props) {
  return (
    <button className="square" onClick={() => props.click()}>
      {props.value}
    </button>
  );
}

class AI {
  //class begins

  handleMove(squares) {
    let bestMoveScore = Number.NEGATIVE_INFINITY;
    let bestMoveIndex = null;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "O";
        let moveScore = this.minimax(squares, 0, false);
        squares[i] = null;
        if (moveScore > bestMoveScore) {
          bestMoveScore = moveScore;
          bestMoveIndex = i;
        }
      }
    }
    console.log(bestMoveIndex);
    squares[bestMoveIndex] = "O";
    return squares;
  }

  movesLeft(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) return true;
    }
    return false;
  }

  evaluate(squares) {
    //all possibile wining sequences in the board
    const winPossibilities = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    //checking whether there is any winning sequence already
    //lopoing through all possibilities
    for (let i = 0; i < winPossibilities.length; i++) {
      const [a, b, c] = winPossibilities[i];
      //checking who will win and returning scores accordingly
      if (squares[a] === squares[b] && squares[b] === squares[c]) {
        if (squares[a] === "O") return 10;
        else if (squares[a] === "X") return -10;
      }
    }

    //if there's no winning sequence in the board then return 0
    return 0;
  }

  minimax(squares, depth, isMaximizingPlayer) {
    let score = this.evaluate(squares);

    // return score if 'O' wins the game
    if (score === 10) {
      return score;
    }
    // reutrn score if 'X' wins the game
    if (score === -10) {
      return score;
    }

    //if no moves left
    if (this.movesLeft(squares) === false) {
      return 0;
    }

    //if this is a maximizers move
    if (isMaximizingPlayer) {
      let bestVal = Number.NEGATIVE_INFINITY;
      // traverse all possible moves, which are not null
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          //make move and choose maximum value
          squares[i] = "O";
          bestVal = Math.max(
            bestVal,
            this.minimax(squares, depth + 1, !isMaximizingPlayer)
          );
          // reset the move after finding the max value
          squares[i] = null;
        }
      }
      return bestVal;
    } else {
      //if this ia minimizer's turn

      let bestVal = Number.POSITIVE_INFINITY;
      //console.log(bestVal);
      // traverse all possible moves, which are not null
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          //make move and choose minimum value
          squares[i] = "X";
          bestVal = Math.min(
            bestVal,
            this.minimax(squares, depth + 1, !isMaximizingPlayer)
          );
          // reset the move after finding the max value
          squares[i] = null;
        }
      }
      return bestVal;
    }
  }

  //class end
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      isNextBot: false,
      winner: null,
      isGameTie: false
    };
  }

  componentDidUpdate() {
    let winner = calculateWinner(this.state.squares);
    if (winner === -1 && !this.state.isGameTie) {
      this.setState({
        isGameTie: true
      });
    } else if (winner !== null && !this.state.winner) {
      this.setState({
        winner: winner
      });
      //console.log("Won");
    } else {
      if (this.state.isNextBot && !this.state.winner) {
        //console.log("bot move");
        let ai = new AI();
        let newSquares = ai.handleMove(this.state.squares);
        this.setState({
          squares: newSquares,
          isNextBot: !this.state.isNextBot
        });
      }
    }
  }

  handleClick(i) {
    //return if current turn is bot's
    if (this.state.isNextBot) return;

    //retrun if game is already completed or square is already filled
    const squares = this.state.squares.slice();
    if (this.state.winner !== null || squares[i] || this.state.isGameTie) {
      return;
    }

    squares[i] = "X";
    this.setState({
      squares: squares,
      isNextBot: !this.state.isNextBot
    });
  }

  renderSquare(i) {
    return (
      <Square value={this.state.squares[i]} click={() => this.handleClick(i)} />
    );
  }

  render() {
    let status;
    if (this.state.isGameTie) {
      status = "Tie!";
    } else if (this.state.winner) {
      status = "Winner:" + this.state.winner;
    } else {
      status = "Next player is:" + (this.state.isNextBot ? " O" : " X");
    }
    return (
      <div className="board">
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let nullcount = 0;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (!squares[a] || !squares[b] || !squares[c]) {
      nullcount += 1;
    }

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (nullcount === 0) return -1;

  return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
