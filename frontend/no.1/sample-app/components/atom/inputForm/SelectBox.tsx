import { VFC } from 'react';

export type Option = {
  value: string;
};

export type Props = {
  options: Option[];
};

export const SelectBox: VFC<Props> = ({ options }) => {
  return (
    <div>
      <select className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
