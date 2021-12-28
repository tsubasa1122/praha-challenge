import { Story, Meta } from '@storybook/react/types-6-0';
import { AuthorIcon, Props } from './AuthorIcon';

export default {
  title: 'AuthorIcon',
  component: AuthorIcon,
} as Meta;

const Template: Story<Props> = (args) => <AuthorIcon {...args} />;

export const DefaultAuthorIcon = Template.bind({});
DefaultAuthorIcon.args = {
  iconUrl: 'https://source.unsplash.com/random',
  name: 'Alex John',
};
