import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import * as serviceWorker from "./serviceWorker";
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      <span className= {props.value === 'X'? 'player':'bot'}>{props.value}</span>
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
//class board begins
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="status">{this.props.status}</div>
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
        <div className="youare"><span>You are playing as:{" "}</span><b className="player">X</b></div>
      </div>
    );
  }
  //class ends
}

class Game extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isNextBot: false,
      winner: null,
      isGameTie: false,
      AiThinking: true,
      stepNumber: 0, 
      isViewingState: false
    };
  }

  jumpTo(step){
    console.log(step)
    console.log(this.state.history.length)
    if(step === this.state.stepNumber) return;
    if(step === this.state.history.length-1){
      console.log("reached end"+step)
      this.setState({
        stepNumber: this.state.history.length-1,
        isViewingState: false
      })
    }else{
      this.setState({
        stepNumber: step,
        isViewingState: true
      })
    }
  }

  handleClick(i) {
    //return if current turn is bot's
    if (this.state.isNextBot || this.state.isViewingState) return;
    
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    //retrun if game is already completed or square is already filled
    if (this.state.winner !== null || squares[i] || this.state.isGameTie) {
      return;
    }

    squares[i] = "X";

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      isNextBot: !this.state.isNextBot
    });

    //trick to make AI wait for sometime
    setTimeout(() => {
        this.setState({
            AiThinking: !this.state.AiThinking
        })
    }, 1500);
  }

  randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
  }
  
  /*componentDidMount(){
    let whoGoesFirst= Math.random();
    if( whoGoesFirst >= 0.5){
      this.setState({
        isNextBot : !this.state.isNextBot
      })
      setTimeout(() => {
        let squares= this.getCurrentSquares();
        const rn=this.randomNumber(0,8)
        console.log(rn);
        console.log(this.state.isNextBot);
        squares[rn]= 'O';
        this.setState({
          isNextBot: !this.state.isNextBot
        })
    }, 1000);
    }
  }*/

  componentDidUpdate() {
    if(this.state.isViewingState) return;

    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    let winner = calculateWinner(squares);
    if (winner === -1 && !this.state.isGameTie) {
      this.setState({
        isGameTie: true
      });
    } else if (winner !== null && !this.state.winner) {
      this.setState({
        winner: winner
      });
    } else {
      if (this.state.isNextBot && !this.state.winner && !this.state.isGameTie && !this.state.AiThinking) {
        let ai = new AI();
        let newSquares = ai.handleMove(squares);
        this.setState({
            history: history.concat([{
              squares: newSquares,
            }]),
            stepNumber: history.length,
            isNextBot: !this.state.isNextBot,
            AiThinking: !this.state.AiThinking
        });
      }
    }
  }

  render() {

    const history= this.state.history;
    const current= history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Board state after move ' + move:
        'Initial state of board';
      return (
        <li key={move}>
          <button  onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if(this.state.isViewingState){
      status="Viewing state: "+(this.state.stepNumber);
    }else if (this.state.isGameTie) {
      status = "It's a Tie!";
    } else if (this.state.winner) {
      status = this.state.winner === 'X'? "You won!": "You lost, bot won!";
    } else {
      status = (this.state.isNextBot ? "Bot is making a move...." : "It's your turn, make a move");
    }

    const status_bar= <b className={
      this.state.isViewingState? 'viewing-state':(
      this.state.isGameTie? 'tie' : (this.state.winner? (
        this.state.winner === 'X'? 'winner': 'lost'
      ): (
        this.state.isNextBot? 'bot':'player'
      )))
    }>{status}</b>

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
            status={status_bar}
          />
        </div>
        <div className="game-info">
          <div>
            <div className="history"><b>Game history</b></div>
            <ul>{moves}</ul>
          </div>
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
