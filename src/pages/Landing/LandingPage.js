import React from 'react';
import Login from '../../components/Auth/Login/Login';
import AddUser from '../../components/Auth/AddUser/AddUser';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PasswordReset from '../../components/Auth/PasswordReset/PasswordReset';


const Styles = styled.div`
    .landingPageContainer {
        height: 100%;

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