import './index.css';

type ISquare = '半' | '丁' | null;

export interface SquareProps {
  value: ISquare;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;
