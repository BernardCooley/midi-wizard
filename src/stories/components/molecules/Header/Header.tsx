import React from "react";
import PropTypes from "prop-types";
import AccountIcon from "../../../../icons/user.svg";
import SettingsIcon from "../../../../icons/settings.svg";
import logo from "../../../../images/logo.png";
import Colors from "../../../../styles/colors";

import { Button, ClickableIcon, Logo } from "../../../index";
import "./header.scss";

interface IProps {
  isAdmin: boolean;
  onAdminButtonClick: () => {};
  onAccountClick: () => {};
  height: string;
  isLoggedIn: boolean;
}

const Header = ({
  isAdmin,
  onAdminButtonClick,
  onAccountClick,
  height,
  isLoggedIn,
}: IProps) => (
  <header>
    <div className="wrapper" style={{ height: height }}>
      <div className="wrapper__buttons">
        {isAdmin && (
          <Button
            backgroundColor={Colors.primaryButton}
            size="medium"
            label="Admin console"
            onClick={onAdminButtonClick}
          />
        )}
      </div>
      <Logo className="wrapper__logo" icon={logo} />
      <div className="wrapper__icons">
        {isLoggedIn && (
          <ClickableIcon
            icon={AccountIcon}
            onClick={onAccountClick}
            size="30px"
          />
        )}
        <ClickableIcon
          icon={SettingsIcon}
          onClick={onAccountClick}
          size="30px"
        />
      </div>
    </div>
  </header>
);

Header.displayName = "Header";

Header.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onAdminButtonClick: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool,
};

Header.defaultProps = {
  isLoggedIn: true,
};

export default Header;
