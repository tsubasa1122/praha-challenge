import { VFC } from 'react';
import { AuthorIcon } from '../../atom/AuthorIcon';
import { PrimaryLabel } from '../../atom/label/PrimaryLabel';

export type Props = {
  publishedAt: string;
  label: string;
  title: string;
  content: string;
  iconUrl: string;
  name: string;
};

export const PostCard: VFC<Props> = (props) => {
  const { publishedAt, label, title, content, iconUrl, name } = props;

  return (
    <div className='max-w-4xl px-10 py-6 mx-auto bg-white rounded-lg shadow-md'>
      <div className='flex items-center justify-between'>
        <span className='font-light text-gray-600'>{publishedAt}</span>
        <PrimaryLabel>{label}</PrimaryLabel>
      </div>
      <div className='mt-2'>
        <a href='#' className='text-2xl font-bold text-gray-700 hover:underline'>
          {title}
        </a>
        <p className='mt-2 text-gray-600'>{content}</p>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <a href='#' className='text-blue-500 hover:underline'>
          Read more
        </a>
        <AuthorIcon iconUrl={iconUrl} name={name} />
      </div>
    </div>
  );
};
