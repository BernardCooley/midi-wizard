import React from 'react';
import Login from '../../components/Auth/Login/Login';
import AddUser from '../../components/Auth/AddUser/AddUser';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PasswordReset from '../../components/Auth/PasswordReset/PasswordReset';
import backGroundImage from '../../images/landing_page_cover.jpg';
import logo from '../../images/logo.png';
import Colors from '../../styles/colors';


const Styles = styled.div`

    .landingTitle {
        width: 100%;
        text-align: center;
        color: ${Colors.white};
    }

    .backgroundImage {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 100vh;
        width: 100%;
        position: absolute;
    }

    .landingPageContainer {

        .loginRegisterContainer {
            width: 50%;
            margin: auto;
            position: relative;
            top: 75px;
            display: flex;
            flex-direction: column;

            .logoImage {
                height: 70px;
                width: 350px;
                margin: auto;
            }
        }
    }
`

const LandingPage = () => {

    const authComponent = useSelector(state => state.currentAuthComponent);

    return (
        <Styles>
            <img src={backGroundImage} className='backgroundImage'></img>

            <h1 className='landingTitle'>Studio Designer</h1>

            <div className='landingPageContainer'>
                <div className='loginRegisterContainer'>
                    <img src={logo} className='logoImage'></img>
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