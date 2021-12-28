import { VFC } from 'react';
import { AuthorIcon } from '../../atom/AuthorIcon';
import { PrimaryLabel } from '../../atom/label/PrimaryLabel';

export type Props = {
  publishedAt: string;
  label: string;
  title: string;
  iconUrl: string;
  name: string;
};

export const RecentPostCard: VFC<Props> = (props) => {
  const { publishedAt, label, title, iconUrl, name } = props;

  return (
    <div className='flex flex-col max-w-sm px-8 py-6 mx-auto bg-white rounded-lg shadow-md'>
      <div className='flex items-center justify-center'>
        <PrimaryLabel>{label}</PrimaryLabel>
      </div>
      <div className='mt-4'>
        <a href='#' className='text-lg font-medium text-gray-700 hover:underline'>
          {title}
        </a>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center'>
          <AuthorIcon iconUrl={iconUrl} name={name} />
        </div>
        <span className='text-sm font-light text-gray-600'>{publishedAt}</span>
      </div>
    </div>
  );
};
