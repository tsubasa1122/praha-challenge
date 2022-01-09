import { Story, Meta } from '@storybook/react/types-6-0';
import { RecentPostCard, Props } from './RecentPostCard';

export default {
  title: 'RecentPostCard',
  component: RecentPostCard,
} as Meta;

const Template: Story<Props> = (args) => <RecentPostCard {...args} />;

export const DefaultRecentPostCard = Template.bind({});
DefaultRecentPostCard.args = {
  publishedAt: 'Jun 1, 2020',
  label: 'Laravel',
  title: 'Build Your New Idea with Laravel Freamwork.',
  iconUrl: 'https://source.unsplash.com/random',
  name: 'Alex John',
};
