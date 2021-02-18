import React from 'react';
import { Square } from '../index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Square',
  component: Square,
  argTypes: {
    onClick: action('clicked'),
    value: 'X',
  },
};

export function Squares(args) {
  return <Square onClick={args.onClick} value={args.value} />;
}

Squares.args = {
  value: 'X',
};
