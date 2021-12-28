import Image from 'next/image';
import { VFC } from 'react';

// Icon or ユーザー名はそれぞれ単体で使用することがないので一緒にした
export type Props = {
  iconUrl: string;
  name: string;
};

export const AuthorIcon: VFC<Props> = ({ iconUrl, name }) => {
  return (
    <>
      <a href='#' className='flex items-center'>
        {/* Imageに直接layoutを指定しても動かないのでstyleをラップする https://stackoverflow.com/questions/65527407/next-image-not-taking-class-properties */}
        <div className='mx-4 flex items-center'>
          <Image
            src={iconUrl}
            alt='avator'
            width={40}
            height={40}
            className='hidden object-cover w-10 h-10 rounded-full sm:block'
          />
        </div>
        <p className='font-bold text-gray-700 hover:underline'>{name}</p>
      </a>
    </>
  );
};
