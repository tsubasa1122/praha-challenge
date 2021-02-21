import { Board, BoardProps } from '../index';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Board',
  component: Board,
} as Meta;

const Template: Story<BoardProps> = (args) => <Board {...args} />;

export const DefaultBoard = Template.bind({});
DefaultBoard.args = {
  squares: Array(9).fill(null),
  onClick: action('clicked'),
};

export const AllClossBoard = Template.bind({});
AllClossBoard.args = {
  ...DefaultBoard.args,
  squares: Array(9).fill('X'),
};

export const AllCircleBoard = Template.bind({});
AllCircleBoard.args = {
  ...DefaultBoard.args,
  squares: Array(9).fill('○'),
};

export const AllTriangleBoard = Template.bind({});
AllTriangleBoard.args = {
  ...DefaultBoard.args,
  squares: Array(9).fill('△'),
};
