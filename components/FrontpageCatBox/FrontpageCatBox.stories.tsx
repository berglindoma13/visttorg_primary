import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FrontpageCatBox } from './FrontpageCatBox';

export default {
  title: 'FrontpageCatBox',
  component: FrontpageCatBox,
} as ComponentMeta<typeof FrontpageCatBox>;

const Template: ComponentStory<typeof FrontpageCatBox> = (args) => <FrontpageCatBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Baðherbergi',
  iconImage: 'Sink',
  url: '/',
  color: 'orange'
};