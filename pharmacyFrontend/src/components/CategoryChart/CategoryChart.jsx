import {
    Box
} from '@mui/material';

import {
    PieChart
} from '@mui/x-charts/PieChart';

import './CategoryChart.css';

function CategoryChart() {

    return (

        <Box className="category-chart">

            <PieChart
                series={[
                    {
                        data: [
                            {
                                id: 0,
                                value: 35,
                                label: 'Analgésicos'
                            },
                            {
                                id: 1,
                                value: 25,
                                label: 'Antibióticos'
                            },
                            {
                                id: 2,
                                value: 20,
                                label: 'Vitaminas'
                            },
                            {
                                id: 3,
                                value: 20,
                                label: 'Otros'
                            }
                        ],
                        innerRadius: 55,
                        outerRadius: 90,
                        paddingAngle: 2
                    }
                ]}

                colors={[
                    '#111111',
                    '#444444',
                    '#777777',
                    '#AAAAAA'
                ]}

                width={330}

                height={270}

                margin={{
                    left: 15,
                    right: 15
                }}

                slotProps={{
                    legend: {
                        direction: 'column',
                        position: {
                            vertical: 'bottom',
                            horizontal: 'middle'
                        }
                    }
                }}
            />

        </Box>

    );
}

export default CategoryChart;