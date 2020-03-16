import React from 'react';
import './AutoCompleteList.scss';

const AutoCompleteList = (props) => {
    console.log(props.autoCompleteList);
    console.log(props.field);

    document.querySelector('.manufacturer');

    // TODO pass field name to only display under required field

    return(
        <div className="autoCompleteListContainer">

            {props.autoCompleteList.length > 0 ? props.autoCompleteList.map((matchedItem, index) => (
                <div key={index}>{matchedItem}</div>
            )):null}
        </div>
    )
}


export default AutoCompleteList;