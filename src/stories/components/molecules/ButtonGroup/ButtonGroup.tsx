import React from "react";
import PropTypes from "prop-types";
import "./buttonGroup.scss";

interface IButtonGroup {
  buttons: React.ReactNode[];
  title: string;
}

const ButtonGroup = ({ buttons, title }: IButtonGroup) => {
  return (
    <div className="button-group">
      <div className="button-group__title">{title}</div>
      <div className="button-group__group">
        {buttons.length > 0 &&
          buttons.map((button) => (
            <div className="button-group__group__button">{button}</div>
          ))}
      </div>
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";

ButtonGroup.propTypes = {
  buttons: PropTypes.node,
  title: PropTypes.string,
};

ButtonGroup.defaultProps = {};

export default ButtonGroup;
