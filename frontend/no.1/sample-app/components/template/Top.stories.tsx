import { Story, Meta } from '@storybook/react/types-6-0';
import { Top, Props } from './Top';

export default {
  title: 'Top',
  component: Top,
} as Meta;

const Template: Story<Props> = (args) => <Top {...args} />;

export const DefaultTop = Template.bind({});
DefaultTop.args = {
  options: [{ value: 'Latest' }, { value: 'Last Week' }],
  posts: [
    {
      publishedAt: 'Jun 1, 2020',
      label: 'Laravel',
      title: 'Build Your New Idea with Laravel Freamwork.',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Alex John',
    },
    {
      publishedAt: 'Jun 1, 2020',
      label: 'Laravel',
      title: 'Build Your New Idea with Laravel Freamwork.',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Alex John',
    },
    {
      publishedAt: 'Jun 1, 2020',
      label: 'Laravel',
      title: 'Build Your New Idea with Laravel Freamwork.',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Alex John',
    },
  ],
  totalPage: 3,
  currentPage: 1,
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
  categories: [
    {
      name: 'AWS',
    },
    {
      name: 'Laravel',
    },
  ],
  recentPost: {
    publishedAt: 'Jun 1, 2020',
    label: 'Laravel',
    title: 'Build Your New Idea with Laravel Freamwork.',
    iconUrl: 'https://source.unsplash.com/random',
    name: 'Alex John',
  },
};
