import React from "react";
import AccountIcon from "../../../assets/user.svg";

import { ClickableIcon } from "../../../index";

const iconClicked = () => {
  alert("Icon clicked!!!");
};

export default {
  title: "Example/ClickableIcon",
  component: ClickableIcon,
};

const Template = (args: any) => {
  return <ClickableIcon {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  icon: AccountIcon,
  onClick: iconClicked,
  size: "30px",
};
