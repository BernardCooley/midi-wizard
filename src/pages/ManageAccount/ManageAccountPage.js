import React from 'react';
import styled from 'styled-components';
import DeleteAccount from '../../components/DeleteAccount/DeleteAccount';


const Styles = styled.div`
    .manageAccountContainer {
        padding: 100px 50px 50px 50px;
        background-color: lightgray;
        width: auto;
        height: 100vh;
        display: flex;
        margin: auto;
        justify-content: center;
    }
`;

const ManageAccountPage = () => {


    return (
        <Styles>
            <div className='manageAccountContainer'>
                <DeleteAccount/>
            </div>
        </Styles>
    )
}

export default ManageAccountPage;