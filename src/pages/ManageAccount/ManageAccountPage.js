import React from 'react';
import styled from 'styled-components';
import DeleteAccount from '../../components/Auth/DeleteAccount/DeleteAccount';
import ChangePassword from '../../components/Auth/ChangePassword/ChangePassword';


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


    return (
        <Styles>
            <div className='manageAccountContainer'>
                <div className='manageAccountInnerContainer'>
                    <DeleteAccount/>
                    <ChangePassword/>
                </div>
            </div>
        </Styles>
    )
}

export default ManageAccountPage;