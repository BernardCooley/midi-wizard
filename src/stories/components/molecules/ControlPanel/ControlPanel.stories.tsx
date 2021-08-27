import React from "react";
import { Meta, Story } from "@storybook/react";
import { InputGroup } from "@wfp/ui";
import Checkbox from "react-custom-checkbox";
import { ControlPanel, Button } from "../../../index";
import { FiCheck } from "react-icons/fi";

interface IControlPanelProps {
  children: React.ReactNode[];
  title: string;
  width: string;
  height: string;
}

export default {
  title: "Example/ControlPanel",
  component: ControlPanel,
} as Meta;

const Template: Story<IControlPanelProps> = ({children, width, height, title}) => {
  return <ControlPanel children={children} width={width} height={height} title={title} />;
};

export const Default = Template.bind({});

const checkboxProps = {
  borderColor: "#5c5e5f",
  borderRadius: 20,
  size: 15,
  style: { margin: 8, overflow: "hidden", cursor: "pointer" },
  containerStyle: { cursor: "pointer" },
  icon: (
    <div
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#174A41",
        alignSelf: "stretch",
      }}
    >
      <FiCheck color="white" size={15} />
    </div>
  ),
};

Default.args = {
  children: [
    <InputGroup labelText="Show / hide">
      <Checkbox
        label="Audio"
        name="showHide"
        value="audio"
        {...checkboxProps}
      />
      <Checkbox label="Midi" name="showHide" value="midi" {...checkboxProps} />
      <Checkbox label="USB" name="showHide" value="usb" {...checkboxProps} />
    </InputGroup>,
    <InputGroup labelText="New connection" vertical={true}>
      <Button label="Audio" />
      <Button label="Midi" />
      <Button label="USB" />
    </InputGroup>,
  ],
  width: "200px",
  height: "320px",
  title: 'Control panel',
};
