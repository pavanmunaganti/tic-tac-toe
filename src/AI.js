export class AI {
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
  