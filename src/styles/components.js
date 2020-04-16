import styled from 'styled-components';
import Colors from '../styles/colors';


export const ConnectionFormSection = styled.div`
    .connectionFormSection {
        
    }
`;

export const TrayTab = styled.div`
    .trayTab {
        position: relative;
        background-color: #383838;
        height: 30px;
        border: none;
        width: 120px;
        font-size: 20px;
        outline: none;
        cursor: pointer;
        color: ${Colors.whiteBlue};
        transition:0.2s;
        -webkit-transition:0.2s;
        -moz-transition:0.2s;
        background: linear-gradient(rgba(211,211,211,1) 0%, rgba(137,137,137,1) 4%, rgba(56,56,56,1) 82%, rgba(56,56,56,1) 100%);
        z-index: 10;

        &:hover {
            -webkit-box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
            -moz-box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
            box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
        }
    }
`

export const CustomButton = styled.div`
    .customButton {
        width: 200px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        background-color: ${Colors.middleGray};
        color: ${Colors.whiteBlue};
        border: 1px solid ${Colors.whiteBlue};
        border-radius: 10px;
        outline: none;

        &:hover {
            background-color: ${Colors.darkTeal};
        }
    }
`

export const CloseIcon = styled.div`
    .closeIcon {
        position: relative;
        right: 7px;
        top: 23px;
        font-size: 30px;
        cursor: pointer;
        z-index: 20;
        color: ${Colors.middleGray};

        &:hover {
            color: ${Colors.darkTeal};
        }
    }
`

export const AuthFormOptions = styled.div`
    .optionsContainer {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        flex-wrap: wrap;

        .optionContainer {
            margin-top: 50px;
            color: ${Colors.whiteBlue};

            .optionLink {
                cursor: pointer;
                font-weight: bold;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`

export const AuthFormValidationMessage = styled.div`
    .validationContainer {
        color: ${Colors.red};
        min-height: 20px;
    }

    .errorBackground {
        background-color: ${Colors.whiteBlueOpaque};
        padding: 0 5px;
        border-radius: 5px;
    }
`

export const AuthFormField = styled.div`
    width: 100%;

    .fieldContainer {
        width: 100%;
        margin-bottom: 30px;
        height: 70px;
        font-size: 20px;

        .inputField {
            width: 100%;
            font-size: 30px;
            height: 50px;
            text-align: center;
            border-radius: 5px;
            background-color: ${Colors.whiteBlue};
            border: 1px solid ${Colors.whiteBlue};
            outline: none;
            -webkit-text-fill-color: ${Colors.middleGray};
            -webkit-box-shadow: 0 0 0px 1000px ${Colors.whiteBlue} inset;
            -webkit-autofill::first-line {font-size: 20px}
        }

        .errorBorder {
            box-shadow: 0 0 10px ${Colors.red};
        }
    }
`

export const AuthFormContainer = styled.div`
    .formContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`