import React from "react";
import PropTypes from "prop-types";
import "./logo.scss";

interface ILogo {
    icon: string;
}

const Logo = ({ icon }: ILogo) => {
  return (
    <div className="logoContainer">
      <img src={icon} className="logoContainer__icon"></img>
    </div>
  );
};

Logo.displayName = "Logo";

Logo.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

Logo.defaultProps = {};

export default Logo;
