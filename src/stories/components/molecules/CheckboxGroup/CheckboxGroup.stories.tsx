import React from "react";
import { Meta, Story } from "@storybook/react";
import { CheckboxGroup } from "../../../index";
import Checkbox from "react-custom-checkbox";

interface IButtonGroupProps {
  checkboxes: React.ReactNode;
}

export default {
  title: "Example/CheckboxGroup",
  component: CheckboxGroup,
} as Meta;

const buttons = [
  <Checkbox label="Button 1" />,
  <Checkbox label="Button 2" />,
  <Checkbox label="Button 3" />,
];

const Template: Story<IButtonGroupProps> = (args) => {
  return (
    <CheckboxGroup>
      {args.buttons.map((button) => (
        <div>{button}</div>
      ))}
    </CheckboxGroup>
  );
};

export const Default = Template.bind({});

Default.args = {
  buttons: buttons,
};
