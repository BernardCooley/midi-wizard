import React from 'react';
import styled from 'styled-components';
import DeleteAccount from '../../components/Auth/DeleteAccount/DeleteAccount';
import AccountField from '../../components/Auth/AccountField/AccountField';


const Styles = styled.div`
    .manageAccountContainer {
        padding: 100px 50px 50px 50px;
        background-color: lightgray;
        width: auto;
        height: 100vh;
        display: flex;
        margin: auto;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;

        .manageAccountInnerContainer {
            width: 70%;
            height: 90%;
            display: flex;
            flex-direction: column;
            margin: auto;
            justify-content: space-evenly;
            align-items: center;
        }
    }
`;

const ManageAccountPage = () => {

    const passwordErrorMessages = ['Password must be 6 character or longer'];
    const emailErrorMessages = ['Email must not be blank', 'Invalid email address'];



    return (
        <Styles>
            <div className='manageAccountContainer'>
                <div className='manageAccountInnerContainer'>
                    <DeleteAccount/>
                    <AccountField fieldname='password' fieldid='updatePasswordInput' fieldtitle='Update Password' placeholder='New password'/>
                    <AccountField fieldname='email' fieldid='updateEmailInput' fieldtitle='Update Email Address' placeholder='New email address'/>
                </div>
            </div>
        </Styles>
    )
}

export default ManageAccountPage;