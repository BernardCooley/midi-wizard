import React from "react";
import { Meta, Story } from "@storybook/react";

import { Button } from "../../../index";

interface IButtonProps {
  primary: boolean;
  label: string;
}

export default {
  title: "Example/Button",
  component: Button,
} as Meta;

const Template: Story<IButtonProps> = (args) => {
  return <Button {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  primary: true,
  label: "Button",
};
