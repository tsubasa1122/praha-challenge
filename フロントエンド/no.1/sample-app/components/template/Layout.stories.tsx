import { Story, Meta } from '@storybook/react/types-6-0';
import { Layout, Props } from './Layout';

export default {
  title: 'Layout',
  component: Layout,
} as Meta;

const Template: Story<Props> = (args) => <Layout {...args} />;

export const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  children: <div></div>,
};
