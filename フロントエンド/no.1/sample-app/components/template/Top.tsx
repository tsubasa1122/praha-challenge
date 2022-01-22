import { VFC } from 'react';
import { Option, SelectBox } from '../atom/inputForm/SelectBox';
import { PostCard } from '../molecule/card/PostCard';
import { RecentPostCard } from '../molecule/card/RecentPostCard';
import { Author, AuthorList } from '../organism/AuthorList';
import { Category, CategoryList } from '../organism/CategoryList';
import { Pagenation } from '../organism/layout/Pagenation';
import { Layout } from './Layout';

export type Props = {
  options: Option[];
  posts: {
    publishedAt: string;
    label: string;
    title: string;
    content: string;
    iconUrl: string;
    name: string;
  }[];
  totalPage: number;
  currentPage: number;
  authors: Author[];
  categories: Category[];
  recentPost: {
    publishedAt: string;
    label: string;
    title: string;
    iconUrl: string;
    name: string;
  };
};

export const Top: VFC<Props> = (props) => {
  const { options, posts, totalPage, currentPage, authors, categories, recentPost } = props;

  return (
    <Layout>
      <div className='px-6 py-8'>
        <div className='container flex justify-between mx-auto'>
          <div className='w-full lg:w-8/12'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-700 md:text-2xl'>Post</h2>
              <SelectBox options={options} />
            </div>
            {posts.map((post, idx) => (
              <div key={idx} className='mt-6'>
                <PostCard key={idx} {...post} />
              </div>
            ))}
            <div className='mt-8'>
              <Pagenation totalPage={totalPage} currentPage={currentPage} />
            </div>
          </div>
          {/* lg:block 1024px以上で表示 */}
          <div className='hidden w-4/12 -mx-8 lg:block'>
            <div className='px-8'>
              <h2 className='mb-4 text-xl font-bold text-gray-700'>Authors</h2>
              <AuthorList authors={authors} />
            </div>
            <div className='px-8 mt-10'>
              <h2 className='mb-4 text-xl font-bold text-gray-700'>Categories</h2>
              <CategoryList categories={categories} />
            </div>
            <div className='px-8 mt-10'>
              <h2 className='mb-4 text-xl font-bold text-gray-700'>Recent Post</h2>
              <RecentPostCard {...recentPost} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
