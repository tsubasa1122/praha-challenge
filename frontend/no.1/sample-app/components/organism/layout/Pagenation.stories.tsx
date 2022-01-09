import { Story, Meta } from '@storybook/react/types-6-0';
import { Pagenation, Props } from './Pagenation';

export default {
  title: 'Pagenation',
  component: Pagenation,
} as Meta;

const Template: Story<Props> = (args) => <Pagenation {...args} />;

export const DefaultPagenation = Template.bind({});
DefaultPagenation.args = {
  totalPage: 3,
  currentPage: 1,
};
