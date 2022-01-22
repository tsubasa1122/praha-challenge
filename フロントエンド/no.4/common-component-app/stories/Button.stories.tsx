import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Blue = Template.bind({});
Blue.args = {
  children: '応募する',
  color: 'blue',
  size: 'medium',
  disabled: false,
  onClick: () => {},
};

export const Red = Template.bind({});
Red.args = {
  children: '削除する',
  color: 'red',
  size: 'small',
  disabled: false,
  onClick: () => {},
};

export const RedDisabled = Template.bind({});
RedDisabled.args = {
  children: '削除する',
  color: 'red',
  size: 'small',
  disabled: true,
  onClick: () => {},
};
