import Game, { GameProps } from './index';
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
  title: 'Game',
  component: Game,
} as Meta;

const Template: Story<GameProps> = (args) => <Game {...args} />;

export const DefaultGame = Template.bind({});
DefaultGame.args = {
  initHistory: [
    {
      squares: Array(9).fill(null),
    },
  ],
  players: ['半', '丁'],
};
