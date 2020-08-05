import React from "react";
import Square  from "./Square";

export class Board extends React.Component {
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
            {this.props.replay}
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