import React, { useState } from "react";
import PropTypes, { arrayOf } from "prop-types";
import "./controlPanel.scss";
import { AiFillControl } from "react-icons/ai";
import Colors from "../../../../styles/colors";

interface IControlPanelProps {
  children: React.ReactNode[];
  title: string;
  width: string;
  height: string;
  expandedStyles: object;
  collapsedStyles: object;
}

const ControlPanel = ({
  children,
  title,
  width,
  height,
  expandedStyles,
  collapsedStyles
}: IControlPanelProps) => {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div
      className={`control-panel ${expanded ? "expanded" : ""}`}
      style={expanded ? expandedStyles : collapsedStyles}
    >
      <div className="control-panel__container">
        <div
          className="control-panel__container__header"
          onClick={() => setExpanded(!expanded)}
        >
          <AiFillControl
            color={expanded ? Colors.primaryButton : Colors.whiteBlue}
            size={30}
            className="control-panel__container__header__icon"
          />
          <div className="control-panel__container__header__title">{title}</div>
        </div>
        {children.length > 0 &&
          children.map((child) => (
            <div className="control-panel__container__input-group">{child}</div>
          ))}
      </div>
    </div>
  );
};

ControlPanel.displayName = "ControlPanel";

ControlPanel.propTypes = {
  children: arrayOf(PropTypes.node),
  title: PropTypes.string,
};

ControlPanel.defaultProps = {};

export default ControlPanel;
