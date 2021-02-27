import { useState } from 'react';
import Board from '../Board';
import './index.css';

export type History = HistoryElement[];
export type ISquare = '半' | '丁' | null;
export type Players = [Player, Player];
export type Player = '半' | '丁';

interface HistoryElement {
  squares: ISquare[];
}

export interface GameProps {
  initHistory: History;
  players: Players;
}

const Game: React.FC<GameProps> = ({ players, initHistory }) => {
  const [history, setHistory] = useState<History>(initHistory);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const _history = history.slice(0, stepNumber + 1);

    const current = _history[_history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? players[0] : players[1];

    setHistory(history.concat([{ squares }]));
    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];

  const winner = calculateWinner(current.squares);

  const moves = history.map((_step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? players[0] : players[1]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
function calculateWinner(squares: ISquare[]) {
  const lines = [
    [0, 1, 2], // 横
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //縦
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //斜め
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
