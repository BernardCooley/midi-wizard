import React from 'react';
import { Meta, Story } from "@storybook/react";

import { Header } from '../../../index';

interface IHeaderProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  height: string;
}

export default {
  title: 'Example/Header',
  component: Header,
} as Meta;

const Template: Story<IHeaderProps> = (args: any) => {
  return <Header {...args}/>;
};

export const Default = Template.bind({});
Default.args = {
  isAdmin: true,
  isLoggedIn: true,
  height: '50px'
};