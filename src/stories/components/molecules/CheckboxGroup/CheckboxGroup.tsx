import React from "react";
import PropTypes from "prop-types";
import "./checkboxGroup.scss";

interface ICheckboxGroup {
  children: React.ReactNode[];
  groupName: string;
}

const CheckboxGroup = ({ children }: ICheckboxGroup) => {
  return (
    <div className="checkbox-group">
      {children.map((child) => (
        <div>{child}</div>
      ))}
    </div>
  );
};

CheckboxGroup.displayName = "CheckboxGroup";

CheckboxGroup.propTypes = {
  children: PropTypes.node,
};

CheckboxGroup.defaultProps = {};

export default CheckboxGroup;
