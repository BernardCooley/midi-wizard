import React from 'react';

const Footer = () => {


    const styles = {
        footerContainer: {
            marginTop: '20px',
            position: 'absolute',
            bottom: '0',
            width: '100%'
        }
    }

    return (
        <div style={styles.footerContainer}>
            Footer
        </div>
    )
}

export default Footer;