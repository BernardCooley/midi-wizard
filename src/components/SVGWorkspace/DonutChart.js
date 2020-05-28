import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import PropTypes from 'prop-types';
import { connectionSelections } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';


const DonutChart = props => {

    const [selected, setSelected] = useState([]);
    const [hovered, setHovered] = useState(null);
    const dispatch = useDispatch();
    const selections = useSelector(state => state.connectionSelections);

    const customSegmentStyle = {
        transition: '0.3s',
        WebkitTransition: '0.3s',
        MozTransition: '0.3s'
    }

    useEffect(() => {
        if (selections.length === 0) {
            setSelected([]);
        }
    }, [selections]);

    return (
        <PieChart
            data={props.data}
            lineWidth={20}
            paddingAngle={5}
            radius={80}
            rounded
            segmentsShift={35}
            onMouseOver={(e, index) => {
                if (selected.length < 2) {
                    setHovered(index);
                }
            }}
            onMouseOut={() => {
                setHovered(null);
            }}
            segmentsStyle={(index) => {
                return selected.includes(index) || index === hovered
                    ? { ...customSegmentStyle, strokeWidth: 35 }
                    : customSegmentStyle;
            }}
            onClick={(e, index) => {
                if (selected.length < 2) {
                    setSelected([...selected, index]);
                }
                const selection =
                {
                    connectionName: props.data[index].title,
                    deviceId: e.target.parentNode.parentNode.getAttribute('deviceid'),
                    connectionType: props.data[index].type
                }
                if (selections.length < 2) {
                    dispatch(connectionSelections([...selections, selection]));
                }
            }}
        />
    )
}

DonutChart.propTypes = {
    data: PropTypes.object
}

export default DonutChart;