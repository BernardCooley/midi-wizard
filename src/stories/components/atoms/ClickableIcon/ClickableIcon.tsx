import React from "react";
import PropTypes from "prop-types";
import "./clickableIcon.scss";

interface IProps {
  icon: string;
  onClick: () => {};
  size: string;
}

const ClickableIcon = ({ icon, onClick, size }: IProps) => {
  return (
    <div className="iconContainer">
      <img src={icon} onClick={onClick} style={{height: size}} className="iconContainer__icon"></img>
    </div>
  );
};

ClickableIcon.displayName = "ClickableIcon";

ClickableIcon.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string,
};

ClickableIcon.defaultProps = {};

export default ClickableIcon;
