import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        return (
            <div>
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
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true,
                position: null
            }],
            move: 0
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const move = this.state.move;
        const current = history[move];
        const xIsNext = history[move].xIsNext;
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';

        let updatedHistory = history;

        if (move < history.length - 1) {
            const indexToRemove = move + 1;
            const numberToRemove = history.length - indexToRemove;
            updatedHistory.splice(indexToRemove, numberToRemove);
        }

        const state = {
            history: updatedHistory.concat([{
                squares: squares,
                xIsNext: !xIsNext,
                position: i
            }]),
            move: move + 1 
        }

        this.setState(state);
    }

    jumpTo(move) {
        this.setState({
            move: move
        });
    }

    render() {
        const history = this.state.history;
        const currentMove = this.state.move;
        const current = history[currentMove];
        const xIsNext = current.xIsNext;
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const position = step.position;
            
            const desc = move ?
              `Go to move #${move} (${getCol(position)}, ${getRow(position)})` :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${xIsNext ? 'X' : 'O'}`
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function getCol(position) {
    return position % 3;
}

function getRow(position) {
    return Math.floor(position / 3);
}