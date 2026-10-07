import {
    Box
} from '@mui/material';

import {
    LineChart
} from '@mui/x-charts/LineChart';

import './SalesChart.css';

function SalesChart() {

    return (

        <Box className="sales-chart">

            <LineChart

                colors={[
                    '#111111',
                    '#888888'
                ]}

                xAxis={[
                    {
                        scaleType: 'point',
                        data: [
                            'Abr',
                            'May',
                            'Jun',
                            'Jul',
                            'Ago',
                            'Sep'
                        ]
                    }
                ]}

                series={[
                    {
                        data: [
                            42,
                            58,
                            47,
                            71,
                            54,
                            82
                        ],
                        label: 'Ingresos',
                        curve: 'natural'
                    },
                    {
                        data: [
                            30,
                            42,
                            38,
                            51,
                            44,
                            58
                        ],
                        label: 'Egresos',
                        curve: 'natural'
                    }
                ]}

                height={245}

                margin={{
                    left: 45,
                    right: 20,
                    top: 20,
                    bottom: 30
                }}

                grid={{
                    horizontal: true
                }}

            />

        </Box>

    );
}

export default SalesChart;