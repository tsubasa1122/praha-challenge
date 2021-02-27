import ReactDOM from 'react-dom';
import Game, { History, ISquare, Players } from './Components/Game';
import './style.css';

const initHistory: History = [
  {
    squares: Array<ISquare>(9).fill(null),
  },
];

const players: Players = ['半', '丁'];

ReactDOM.render(
  <Game players={players} initHistory={initHistory} />,
  document.getElementById('root')
);
