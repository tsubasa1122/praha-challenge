import { Story, Meta } from '@storybook/react/types-6-0';
import { CategoryList, Props } from './CategoryList';

export default {
  title: 'CategoryList',
  component: CategoryList,
} as Meta;

const Template: Story<Props> = (args) => <CategoryList {...args} />;

export const DefaultCategoryList = Template.bind({});
DefaultCategoryList.args = {
  categories: [
    {
      name: 'AWS',
    },
    {
      name: 'Laravel',
    },
  ],
};
