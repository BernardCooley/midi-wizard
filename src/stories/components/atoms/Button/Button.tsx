import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';

interface IButton {
  primary?: boolean;
  backgroundColor?: any;
  size?: string;
  label: string;
  onClick: () => {};
}

const Button = ({ primary, backgroundColor, size, label, onClick, ...props }: IButton) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={backgroundColor && { backgroundColor }}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};

Button.displayName = 'Button';

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: true,
  size: 'medium',
  onClick: undefined,
};

export default Button;