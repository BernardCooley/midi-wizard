import React from 'react';
import styled from 'styled-components';
import AccountDetails from '../../components/AccountDetails/AccountDetails';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { isManageAccountPageOpen } from '../../actions';
import { useDispatch } from 'react-redux';
import { CloseIconStyles } from '../../styles/components';
import Colors from '../../styles/colors';


const Styles = styled.div`
    height: 100vh;

    .manageAccountContainer {
        padding: 100px 50px 50px 50px;
        background-color: ${Colors.whiteBlue};
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
            justify-content: flex-start;

            .closeIcon {
                font-size: 30px;
                position: absolute;
                top: 60px;
                right: 22px;
                cursor: pointer;
            }
        }
    }
`;

const ManageAccountPage = () => {
    library.add(faTimesCircle);
    const dispatch = useDispatch();

    const closeAccountPage = () => {
        dispatch(isManageAccountPageOpen(false));
    }

    return (
        <Styles>
            <div className='manageAccountContainer'>
                <div className='manageAccountInnerContainer'>
                    <CloseIconStyles>
                        <FontAwesomeIcon onClick={closeAccountPage} className='svg closeIcon' icon="times-circle" />
                    </CloseIconStyles>
                    <AccountDetails />
                </div>
            </div>
        </Styles>
    )
}

export default ManageAccountPage;