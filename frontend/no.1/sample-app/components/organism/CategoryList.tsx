import { VFC } from 'react';

export type Category = {
  name: string;
};

export type Props = {
  categories: Category[];
};

export const CategoryList: VFC<Props> = ({ categories }) => {
  return (
    <div className='flex flex-col max-w-sm px-4 py-6 mx-auto bg-white rounded-lg shadow-md'>
      <ul>
        {categories.map((category, idx) => (
          <li key={idx} className={`${idx !== 0 ? 'mt-2' : ''}`}>
            <a
              href='#'
              className='mx-1 font-bold text-gray-700 hover:text-gray-600 hover:underline'
            >
              - {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
