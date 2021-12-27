import { PrimaryLabel, Props } from './PrimaryLabel';
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
  title: 'Label',
  component: PrimaryLabel,
} as Meta;

const Template: Story<Props> = (args) => <PrimaryLabel {...args} />;

export const DefaultLabel = Template.bind({});
DefaultLabel.args = {
  children: 'Larabel',
};
