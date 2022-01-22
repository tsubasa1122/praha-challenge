import { Story, Meta } from '@storybook/react/types-6-0';
import { PostCard, Props } from './PostCard';

export default {
  title: 'PostCard',
  component: PostCard,
} as Meta;

const Template: Story<Props> = (args) => <PostCard {...args} />;

export const DefaultPostCard = Template.bind({});
DefaultPostCard.args = {
  publishedAt: 'Jun 1, 2020',
  label: 'Laravel',
  title: 'Build Your New Idea with Laravel Freamwork.',
  content:
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
  iconUrl: 'https://source.unsplash.com/random',
  name: 'Alex John',
};
