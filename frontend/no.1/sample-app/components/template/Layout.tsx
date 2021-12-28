import { VFC, ReactNode } from 'react';
import { Footer } from '../organism/layout/Footer';
import { Header } from '../organism/layout/Header';

export type Props = {
  children: ReactNode;
};

export const Layout: VFC<Props> = ({ children }) => {
  return (
    <>
      <div className='overflow-x-hidden bg-gray-100'>
        <Header />
      </div>
      {children}
      <Footer />
    </>
  );
};
