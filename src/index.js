import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filledSquares: this.generateSquares(),
            squares: Array(9).fill(null),
            history: {
                squares: [Array(9).fill(null)],
                safeTile: [6],
                status: ["6 safe tiles left"]
            },
            isFinished: false,
            safeTile: 6,
            status: "6 safe tiles left"
        }
    }

    generateSquares() {
        let arr = Array(9).fill(null)
        let pos = [
            Math.round(Math.random()*8),
            Math.round(Math.random()*8),
            Math.round(Math.random()*8)
        ]

        while (pos[0] === pos[1] || pos[1] === pos[2] || pos[0] === pos[2]) {
            pos = [
                Math.round(Math.random()*8),
                Math.round(Math.random()*8),
                Math.round(Math.random()*8)
            ]
        }

        for (var i = 0; i < arr.length; i++) {
            if (pos.indexOf(i) !== -1) {
                arr[i] = 'M'
            } else {
                let count = 0
                if (pos.indexOf(i-1) !== -1 && i % 3 !== 0) {
                    count++
                }
                if (pos.indexOf(i+1) !== -1 && i % 3 !== 2) {
                    count++
                }
                if (pos.indexOf(i-3) !== -1) {
                    count++
                }
                if (pos.indexOf(i+3) !== -1) {
                    count++
                }
                if (pos.indexOf(i+2) !== -1 && i % 3 !== 0) {
                    count++
                }
                if (pos.indexOf(i-2) !== -1 && i % 3 !== 2) {
                    count++
                }
                if (pos.indexOf(i-4) !== -1 && i % 3 !== 0) {
                    count++
                }
                if (pos.indexOf(i+4) !== -1 && i % 3 !== 2) {
                    count++
                }
                arr[i] = count
            }
        }

        return arr
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        )
    }

    handleClick(i) {
        let squares = this.state.squares.slice()
        let safeTile = this.state.safeTile
        let status = this.state.status
        if (!this.state.isFinished) {
            squares[i] = this.state.filledSquares[i]
            if (squares[i] === 'M') {
                this.setState({
                    isFinished: true,
                    status: 'You lose!'
                })
            } else if (this.state.safeTile === 1) {
                this.setState({
                    isFinished: true,
                    status: 'You win!'
                })
            } else {
                safeTile --
                this.setState({
                    safeTile: safeTile,
                    status: `${safeTile} safe tiles left`
                })
            }
            let historySquares = this.state.history.squares
            historySquares.push(squares)
            let historySafeTile = this.state.history.safeTile
            historySafeTile.push(safeTile)
            let historyStatus = this.state.history.status
            historyStatus.push(status)
            this.setState({
                squares: squares,
                history: {
                    squares: historySquares,
                    safeTile: historySafeTile,
                    status: historyStatus
                }
            })
        }
    }

    restartGame () {
        this.setState({
            filledSquares: this.generateSquares(),
            squares: Array(9).fill(null),
            isFinished: false,
            safeTile: 6,
            status: "6 safe tiles left"
        })
    }

    undoMove () {
        let history = this.state.history
        let lastSquares = history.squares[history.squares.length - 2]
        let lastSafeTile = history.safeTile[history.safeTile.length - 2]
        let lastStatus = history.status[history.status.length - 1]
        let historySquares = history.squares.slice(0, history.squares.length - 1)
        let historySafeTile = history.safeTile.slice(0, history.safeTile.length - 1)
        let historyStatus = history.status.slice(0, history.status.length - 1)
        this.setState({
            squares: lastSquares,
            safeTile: lastSafeTile,
            status: lastStatus,
            isFinished: false,
            history: {
                squares: historySquares,
                safeTile: historySafeTile,
                status: historyStatus
            }
        })
    }

    render() {
        const status = this.state.status;

        return (
            <div>
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
                <button onClick={() => this.undoMove()}>Undo</button><br></br>
                <button onClick={() => this.restartGame()}>Restart Game</button>
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
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
