import { VFC } from 'react';
import { Top } from '../../template/Top';

const props = {
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

export const TopPage: VFC = () => {
  return <Top {...props} />;
};
