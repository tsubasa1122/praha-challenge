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
      publishedAt: 'mar 4, 2019',
      label: 'Design',
      title: 'Accessibility tools for designers and developers',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Jane Doe',
    },
    {
      publishedAt: 'Feb 14, 2019',
      label: 'PHP',
      title: 'PHP: Array to Map',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Lisa Way',
    },
    {
      publishedAt: 'Dec 23, 2018',
      label: 'Django',
      title: 'Django Dashboard - Learn by Coding',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Steve Matt',
    },
    {
      publishedAt: 'Mar 10, 2018',
      label: 'Testing',
      title: 'TDD Frist',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Khatab Wedaa',
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
      name: 'Jane Doe',
      publishedAt: 'Created 52 Posts',
    },
    {
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Lisa Way',
      publishedAt: 'Created 73 Posts',
    },
    {
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Steve Matt',
      publishedAt: 'Created 245 Posts',
    },
    {
      iconUrl: 'https://source.unsplash.com/random',
      name: 'Khatab Wedaa',
      publishedAt: 'Created 332 Posts',
    },
  ],
  categories: [
    {
      name: 'AWS',
    },
    {
      name: 'Laravel',
    },
    {
      name: 'Vue',
    },
    {
      name: 'Design',
    },
    {
      name: 'Django',
    },
    {
      name: 'PHP',
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
