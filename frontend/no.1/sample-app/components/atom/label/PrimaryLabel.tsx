import { ReactNode, VFC } from 'react';

export type Props = {
  children: ReactNode;
};

export const PrimaryLabel: VFC<Props> = ({ children }) => {
  return (
    <a href='#' className='px-2 py-1 font-bold text-gray-100 bg-gray-600 rounded hover:bg-gray-500'>
      {children}
    </a>
  );
};
