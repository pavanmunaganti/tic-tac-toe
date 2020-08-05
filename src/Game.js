import React from "react";
import {AI} from "./AI";
import "./index.css";
import {calculateWinner} from "./utils";
import {Board} from "./Board";

export default class Game extends React.Component {
  
    constructor(props){
      super(props);
      this.resetGame = this.resetGame.bind(this);
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

    resetGame(){
      this.setState({
        history: [{
          squares: Array(9).fill(null),
        }],
        isNextBot: false,
        winner: null,
        isGameTie: false,
        AiThinking: true,
        stepNumber: 0, 
        isViewingState: false
      })
    }

    replayButton(){
      return (
        <button className="replay" onClick={this.resetGame}>Play again</button>
      );
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
            <button onClick={() => this.jumpTo(move)}>
              {move === this.state.stepNumber ? <b style= {{textDecoration: "underline", color: "#1d3354"}}>{desc}</b> : desc}
            </button>
          </li>
        );
      });
      
  
      let status;
      let replay="";
      if(this.state.isViewingState){
        status="Viewing state: "+(this.state.stepNumber);
      }else if (this.state.isGameTie) {
        status = "It's a Tie!";
        replay= this.replayButton();
      } else if (this.state.winner) {
        status = this.state.winner === 'X'? "You won!": "You lost, bot won!";
        replay= this.replayButton();
      } else {
        status = (this.state.isNextBot ? "O is playing...." : "It's your turn....");
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
              replay={replay}
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
  