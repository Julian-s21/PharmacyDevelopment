
import {
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';

import {
    TrendingDownRounded,
    TrendingUpRounded
} from '@mui/icons-material';

import './StatCard.css';

function StatCard({
    title,
    value,
    percentage,
    description,
    icon,
    positive = true,
    delay = 0
}) {

    return (
        <Card
            className="stat-card"
            sx={{
                animationDelay: `${delay}ms`
            }}
        >

            <CardContent className="stat-card-content">

                <Box className="stat-card-top">

                    <Box>

                        <Typography className="stat-title">
                            {title}
                        </Typography>

                        <Typography className="stat-value">
                            {value}
                        </Typography>

                    </Box>

                    <Box className="stat-icon">
                        {icon}
                    </Box>

                </Box>

                <Box className="stat-footer">

                    <Box
                        className={
                            positive
                                ? 'stat-trend stat-trend-positive'
                                : 'stat-trend stat-trend-negative'
                        }
                    >

                        {positive
                            ? <TrendingUpRounded />
                            : <TrendingDownRounded />
                        }

                        <span>
                            {percentage}
                        </span>

                    </Box>

                    <Typography className="stat-description">
                        {description}
                    </Typography>

                </Box>

            </CardContent>

        </Card>
    );
}

export default StatCard;