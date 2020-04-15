import React from 'react';
import Login from '../../components/Auth/Login/Login';
import AddUser from '../../components/Auth/AddUser/AddUser';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PasswordReset from '../../components/Auth/PasswordReset/PasswordReset';
import backGroundImage from '../../images/landing_page_cover.jpg';


const Styles = styled.div`

    .backgroundImage {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 100vh;
        width: 100%;
        opacity: 0.7;
        position: absolute;
    }

    .landingPageContainer {

        .loginRegisterContainer {
            width: 50%;
            margin: auto;
            position: relative;
            top: 75px;
        }
    }
`

const LandingPage = () => {

    const authComponent = useSelector(state => state.currentAuthComponent);

    return (
        <Styles>
            <img src={backGroundImage} className='backgroundImage'></img>
            <div className='landingPageContainer'>
                <div className='loginRegisterContainer'>

                    {(() => {
                        switch (authComponent) {
                            case 'passwordReset':
                                return <PasswordReset />;
                            case 'register':
                                return <AddUser />;
                            default:
                                return <Login />;
                        }
                    })()}
                </div>
            </div>
        </Styles>
    )
}

export default LandingPage;