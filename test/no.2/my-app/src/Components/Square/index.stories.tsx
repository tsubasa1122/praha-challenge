import Square, { SquareProps } from './index';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Square',
  component: Square,
} as Meta;

const Template: Story<SquareProps> = (args) => <Square {...args} />;

export const DefaultSquare = Template.bind({});
DefaultSquare.args = {
  value: '半',
  onClick: action('clicked'),
};
