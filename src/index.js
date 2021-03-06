import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={`square ${props.highlight}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const winnerPattern = this.props.winner;
        const highlight = (winnerPattern && winnerPattern.includes(i)) ? 'highlight' : null;
        return (
            <Square
                value={this.props.squares[i]}
                highlight={highlight}
                onClick={() => this.props.onClick(i)} />
        );
    }

    renderRow(index) {
        let offset = index * 3;
        let rows = [];

        for (let i = 0; i <= 2; i++) {
            rows.push(this.renderSquare(offset + i));
        }

        return <div className="board-row">
            {rows}
        </div>
    }

    renderBoard() {
        let board = [];

        for (let i = 0; i <= 2; i++) {
            board.push(this.renderRow(i));
        }

        return board;
    }

    render() {
        return (
            <div>{this.renderBoard()}</div>
        );
    }
}

class GameInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAscending: true
        };
    }

    handleToggleClick() {
        this.setState({
            isAscending: !this.state.isAscending
        })
    }

    render() {
        const history = this.props.history;
        const currentMove = this.props.move;
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
                    <button style={currentMove === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
                        onClick={() => this.props.onClick(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${xIsNext ? 'O' : 'X'}`;
        }
        else if (currentMove === 9) {
            status = `Draw!`
        } else {
            status = `Next player: ${xIsNext ? 'X' : 'O'}`
        }

        return (
            <div>
                <div>{status}</div>
                Sort Order: <button onClick={() => this.handleToggleClick()}>{this.state.isAscending ? 'ASC' : 'DESC'}</button>
                <ol>{this.state.isAscending ? moves : moves.reverse()}</ol>
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
        const winner = calculateWinner(current.squares);

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winner={winner} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <GameInfo history={history} move={currentMove} onClick={(i) => this.jumpTo(i)} />
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
            return lines[i];
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