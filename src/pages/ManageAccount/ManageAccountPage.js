import React from 'react';
import styled from 'styled-components';


const Styles = styled.div`
    .manageAccountContainer {
        padding-top: 50px;
    }
`;

const ManageAccountPage = () => {


    return (
        <Styles>
            <div className='manageAccountContainer'>
                ManageAccount
            </div>
        </Styles>
    )
}

export default ManageAccountPage;