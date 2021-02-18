import React from 'react';
import { Board } from '../index';

export default {
  title: 'Board',
  component: Board,
};

export function Board() {
  return (
    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
  );
}
