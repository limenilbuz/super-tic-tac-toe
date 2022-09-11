import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Reset(props) {
    return (
        <button onClick = {props.onClick}>Reset</button>
    )
}

function Square(props) {
    return (
      <button className={"square " + props.value + "-square"} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
            value = {this.props.squares[i]}
            onClick = {() => this.props.onClick(i)}
        />
      );
    }

    render() {  
        return (
            <div className={this.props.className}>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: Array(9).fill().map(() => Array(9).fill(null)),
            xIsNext: true,
            claims: Array(9).fill(null),
            currentBoard: 4
        };
    }

    colorBoard(i) {
        if (i === this.state.currentBoard) {
            return 'current-board'
        }
        else if (this.state.claims[i] != null) {
            return this.state.claims[i].toString() + '-board';
        }
        else
        {
            return ''
        }
    }

    renderBoard(i) {
        if (this.state.claims[i] != null) {
            return (<div className={this.state.claims[i] + '-board'}>{this.state.claims[i]}</div>)
        }
        return (
            <Board
                className = {"game-board " + this.colorBoard(i)}
                squares = {this.state.boards[i]}
                onClick = {(j) => this.handleClick(i, j)}
            />
        );
    }

    handleClick(i, j) {
        if (this.state.currentBoard != null && this.state.currentBoard !== i) {
            return;
        }

        let boards = this.state.boards.slice();
        let squares = boards[i];
        let claims = this.state.claims.slice();

        if (squares[j] != null) {
            return;
        }
        squares[j] = this.state.xIsNext ? 'X' : 'O';
        
        boards[i] = squares;
        
        if (this.calculateBoardWinner(i))
        {
            claims[i] = (this.state.xIsNext ? 'X' : 'O');
        }

        let nextBoard;

        if (this.state.claims[j] !== null) {
            nextBoard = null;
        }
        else {
            nextBoard = j
        }

        this.setState({
            boards: boards,
            xIsNext: !this.state.xIsNext,
            currentBoard: nextBoard,
            claims: claims
        });
    }

    calculateBoardWinner(i) {
        const squares = this.state.boards[i].slice();
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        for (let j = 0; j < lines.length; j++) {
          const [a, b, c] = lines[j];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }

    calculateWinner() {
        const claims = this.state.claims.slice();
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
        for (let j = 0; j < lines.length; j++) {
            const [a, b, c] = lines[j];
            if (claims[a] && claims[a] === claims[b] && claims[a] === claims[c]) {
              return claims[a];
            }
        }
        return null;
    }
    handleReset() {
        let newState = {
            boards: Array(9).fill().map(() => Array(9).fill(null)),
            xIsNext: true,
            claims: Array(9).fill(null),
            currentBoard: 4
            }
        this.setState(newState);

    }
    render() {        
        let status;
        let winner = this.calculateWinner();
        if (winner) {
            status = 'Winner: ' + winner
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className='app'>
            <div className="game">
                {this.renderBoard(0)}
                {this.renderBoard(1)}
                {this.renderBoard(2)}                
                {this.renderBoard(3)}
                {this.renderBoard(4)}
                {this.renderBoard(5)}                
                {this.renderBoard(6)}
                {this.renderBoard(7)}
                {this.renderBoard(8)}
                <div className="game-info">
                    <div>{status}</div>
                </div>
                <div></div>
                <Reset onClick={() => this.handleReset()}/>
            </div>
            <ul>
                <li>Super tic tac toe</li>
                <li>The classic game reimagined.</li>
                <li>Rules:</li>
                <li>The first player starts on the middle board.</li>
                <li>When you place down a tile, the next player must play on the board that corresponds to the tile's position.</li>
                <li>Once a board has a tic tac toe, that player claims that whole board.</li>
                <li>Create a tic tac toe with the boards to win!</li>
            </ul>
            </div>
        );
    }
  }


  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  