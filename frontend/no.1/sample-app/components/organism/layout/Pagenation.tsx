import { VFC } from 'react';

export type Props = {
  total_page: number;
  current_page: number;
};

export const Pagenation: VFC<Props> = ({ total_page, current_page }) => {
  return (
    <div className='flex'>
      {total_page === 1 ? (
        <a
          href='#'
          className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
        >
          {total_page}
        </a>
      ) : (
        <>
          <a
            href='#'
            className={`px-3 py-2 mx-1 font-medium bg-white rounded-md ${
              current_page === 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-700 hover:bg-blue-500 hover:text-white'
            }`}
          >
            previous
          </a>
          <a
            href='#'
            className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
          >
            {current_page}
          </a>
          <a
            href='#'
            className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
          >
            {current_page + 1}
          </a>
          <a
            href='#'
            className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
          >
            {current_page + 2}
          </a>
          <a
            href='#'
            className={`px-3 py-2 mx-1 font-medium bg-white rounded-md ${
              current_page === total_page
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-700 hover:bg-blue-500 hover:text-white'
            }`}
          >
            next
          </a>
        </>
      )}
    </div>
  );
};
