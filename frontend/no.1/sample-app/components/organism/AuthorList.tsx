import { VFC } from 'react';
import { AuthorIcon } from '../atom/AuthorIcon';

export type Author = {
  publishedAt: string;
  iconUrl: string;
  name: string;
};

export type Props = {
  authors: Author[];
};

export const AuthorList: VFC<Props> = ({ authors }) => {
  return (
    <div className='flex flex-col max-w-sm px-6 py-4 mx-auto bg-white rounded-lg shadow-md'>
      <ul className='-mx-4'>
        {authors.map((author, idx) => (
          <li key={idx} className={`flex items-center ${idx !== 0 ? 'mt-6' : ''}`}>
            <AuthorIcon iconUrl={author.iconUrl} name={author.name} />
            <span className='mx-1 text-sm font-light text-gray-700'>{author.publishedAt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
