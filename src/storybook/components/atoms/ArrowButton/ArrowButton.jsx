import React from 'react';
import PropTypes from 'prop-types';
import Icons from '../../../icons';
import SVG from '../SVG/SVG';
import Button from '../Button/Button';
import './style.scss';

const ArrowButton = ({ className, gpDirection, gpStyle, ...rest }) => {
    let arrowIcon = Icons.ChevronRight;
    if (gpDirection === 'left') arrowIcon = Icons.ChevronLeft;

    return (
        <Button className={`arrow-button arrow-button--${gpDirection} arrow-button--${gpStyle} ${className}`} {...rest}>
            <SVG icon={arrowIcon} />
        </Button>
    );
};

ArrowButton.propTypes = {
    className: PropTypes.string,
    gpDirection: PropTypes.string,
    gpStyle: PropTypes.string,
    onClick: PropTypes.func,
};

ArrowButton.defaultProps = {
    gpStyle: 'white',
    gpDirection: 'right',
    className: '',
};

export default ArrowButton;
