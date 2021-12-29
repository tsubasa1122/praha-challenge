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

export const Red = Template.bind({});
Red.args = {
  children: '登録する',
  color: 'red',
  size: 'medium',
  disabled: true,
  onClick: () => {
    console.log('登録しました');
  },
};

export const Blue = Template.bind({});
Blue.args = {
  children: '登録する',
  color: 'blue',
  size: 'medium',
  disabled: true,
  onClick: () => {},
};

export const Green = Template.bind({});
Green.args = {
  children: '登録する',
  color: 'green',
  size: 'medium',
  disabled: true,
  onClick: () => {},
};

export const Small = Template.bind({});
Small.args = {
  children: '登録する',
  color: 'red',
  size: 'small',
  disabled: true,
  onClick: () => {},
};
