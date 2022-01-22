import { VFC } from 'react';

export const Footer: VFC = () => {
  return (
    <>
      <footer className='px-6 py-2 text-gray-100 bg-gray-800'>
        <div className='container flex flex-col items-center justify-between mx-auto md:flex-row'>
          <a href='#' className='text-2xl font-bold'>
            Brand
          </a>
          <p className='mt-2 md:mt-0'>All rights reserved 2020.</p>
        </div>
      </footer>
    </>
  );
};
