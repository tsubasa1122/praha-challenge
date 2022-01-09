import { VFC } from 'react';

export const Header: VFC = () => {
  return (
    <>
      <nav className='px-6 py-4 bg-white border-gray-300 shadow'>
        <div className='container flex flex-col mx-auto md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center justify-between'>
            <a href='#' className='text-xl font-bold text-gray-800 md:text-2xl'>
              Brand
            </a>
          </div>
          <div className='flex-col hidden md:flex md:flex-row md:-mx-4'>
            <a href='#' className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'>
              Home
            </a>
            <a href='#' className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'>
              Blog
            </a>
            <a href='#' className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'>
              About us
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};
