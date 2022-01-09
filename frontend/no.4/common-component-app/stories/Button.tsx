import { VFC } from 'react';
import './button.css';

interface Props {
  children: string;
  color?: 'red' | 'blue' | 'green';
  size?: 'small' | 'medium' | 'large';
  disabled: boolean;
  onClick?: () => void;
}

export const Button: VFC<Props> = (props) => {
  const { children, color, size = 'small', disabled = false, onClick } = props;

  return (
    <button
      type='button'
      className={`button button--${size}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
