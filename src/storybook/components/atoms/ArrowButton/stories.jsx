import React from 'react';
import { storiesOf } from '@storybook/react';
import ArrowButton from './ArrowButton';
import { action } from '@storybook/addon-actions';

const clickEvent = () => action('clicked');

storiesOf('Atoms/Arrow Button', module)
    .add('default', () => <ArrowButton onClick={clickEvent} />)
    .add('left arrow', () => <ArrowButton gpStyle="left" onClick={clickEvent} />);
