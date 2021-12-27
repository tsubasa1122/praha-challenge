import { VFC } from 'react';

export const Footer: VFC = () => {
  return (
    <>
      <div className='bg-gray-800 text-white py-3 px-4 text-center fixed left-0 bottom-0 right-0 z-40'>
        This a Blog Page by khatabwedaa.
        <a href='#' className='underline text-gray-200'>
          Component details
        </a>
      </div>
    </>
  );
};
