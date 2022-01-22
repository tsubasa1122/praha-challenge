import { Story, Meta } from '@storybook/react/types-6-0';
import { SelectBox, Props } from './SelectBox';

export default {
  title: 'SelectBox',
  component: SelectBox,
} as Meta;

const Template: Story<Props> = (args) => <SelectBox {...args} />;

export const DefaultSelectBox = Template.bind({});
DefaultSelectBox.args = {
  options: [{ value: 'Latest' }, { value: 'Last Week' }],
};
