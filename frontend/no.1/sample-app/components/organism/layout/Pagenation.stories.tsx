import { Story, Meta } from '@storybook/react/types-6-0';
import { Pagenation, Props } from './Pagenation';

export default {
  title: 'Pagenation',
  component: Pagenation,
} as Meta;

const Template: Story<Props> = (args) => <Pagenation {...args} />;

export const DefaultPagenation = Template.bind({});
DefaultPagenation.args = {
  total_page: 3,
  current_page: 1,
};
