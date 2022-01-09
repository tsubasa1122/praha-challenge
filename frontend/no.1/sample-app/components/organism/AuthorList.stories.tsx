import { Story, Meta } from '@storybook/react/types-6-0';
import { AuthorList, Props } from './AuthorList';

export default {
  title: 'AuthorList',
  component: AuthorList,
} as Meta;

const Template: Story<Props> = (args) => <AuthorList {...args} />;

export const DefaultAuthorList = Template.bind({});
DefaultAuthorList.args = {
  authors: [
    {
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Alex John',
      publishedAt: 'Created 23 Posts',
    },
    {
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Alex John',
      publishedAt: 'Created 23 Posts',
    },
  ],
};
