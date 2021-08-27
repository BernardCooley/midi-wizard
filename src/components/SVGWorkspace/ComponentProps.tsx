import React from "react";

export const controlPanelProps = {
  title: "Control panel",
  width: "200px",
  height: "320px",
  expandedStyles: {
    width: "200px",
    height: "320px",
    transition: "width 0.3s, padding 0.3s, height 0.3s ease 0.3s",
    backgroundColor: "lightgray",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid darkgray",
  },
  collapsedStyles: {
    width: "30px",
    height: "30px",
    transition: "height 0.3s, padding 0.3s, width 0.3s ease 0.3s",
    backgroundColor: "lightgray",
    padding: "0",
    borderRadius: "3px",
    border: "none",
  },
};
