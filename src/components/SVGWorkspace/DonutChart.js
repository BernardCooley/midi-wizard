import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import PropTypes from 'prop-types';


const DonutChart = props => {
    return (
        <PieChart
            data={props.data}
            lineWidth={20}
            paddingAngle={5}
            radius={80}
            labelPosition={90}
        />
    )
}

DonutChart.propTypes = {
    data: PropTypes.object
}

export default DonutChart;