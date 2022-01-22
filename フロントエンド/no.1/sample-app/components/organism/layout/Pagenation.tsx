import { VFC } from 'react';

export type Props = {
  totalPage: number;
  currentPage: number;
};

export const Pagenation: VFC<Props> = ({ totalPage, currentPage }) => {
  return (
    <div className='flex'>
      {totalPage === 1 ? (
        <a
          href='#'
          className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
        >
          {totalPage}
        </a>
      ) : (
        <>
          <a
            href='#'
            className={`px-3 py-2 mx-1 font-medium bg-white rounded-md ${
              currentPage === 1
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
            {currentPage}
          </a>
          <a
            href='#'
            className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
          >
            {currentPage + 1}
          </a>
          <a
            href='#'
            className='px-3 py-2 mx-1 font-medium text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white'
          >
            {currentPage + 2}
          </a>
          <a
            href='#'
            className={`px-3 py-2 mx-1 font-medium bg-white rounded-md ${
              currentPage === totalPage
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-700 hover:bg-blue-500 hover:text-white'
            }`}
          >
            Next
          </a>
        </>
      )}
    </div>
  );
};
