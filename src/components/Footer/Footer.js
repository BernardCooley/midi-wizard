import React from 'react';
import styled from 'styled-components';


const Styles = styled.div`
    .footerContainer {
        margin-top: 20px;
        position: absolute;
        bottom: 0;
        width: 100%;
    }
`

const Footer = () => {
    

    return (
        <Styles>
            <div className='footerContainer'>
                Footer
            </div>
        </Styles>
    )
}

export default Footer;