import React from "react";
import { Meta, Story } from "@storybook/react";

import { ButtonGroup, Button } from "../../../index";

interface IButtonProps {
  primary: boolean;
  label: string;
}

interface IButtonGroupProps {
  buttons: IButtonProps[];
}

export default {
  title: "Example/ButtonGroup",
  component: ButtonGroup,
} as Meta;

const Template: Story<IButtonGroupProps> = (args) => {
  return <ButtonGroup buttons={args.buttons} title='Buttons' />;
};

export const Default = Template.bind({});

Default.args = {
  buttons: [
    <Button label="Button 1" />,
    <Button label="Button 2" />,
    <Button label="Button 3" />,
  ],
};
