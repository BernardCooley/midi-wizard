import React from "react";
import logo from "../../../assets/logo.png";
import { Story, Meta } from "@storybook/react";
import { Logo } from "../../../index";

interface ILogoProps {
  icon: string;
}

export default {
  title: "Example/Logo",
  component: Logo,
} as Meta;

const Template: Story<ILogoProps> = (args) => {
  return <Logo {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  icon: logo,
};
