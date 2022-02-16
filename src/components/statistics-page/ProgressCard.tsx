import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { InsertChart } from '@mui/icons-material';
import { useRouter } from 'next/router';

type ProgressCardProps = {
  title: string;
  progress: number;
};
const ProgressCard: React.FC<ProgressCardProps> = ({ title, progress }) => {
  const router = useRouter();
  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {progress.toLocaleString(router.locale, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}{' '}
              %
            </Typography>
          </Box>
          <Avatar
            sx={{
              backgroundColor: 'secondary.main',
              height: 56,
              width: 56,
            }}
          >
            <InsertChart />
          </Avatar>
        </Stack>
        <Box pt={1}>
          <LinearProgress
            value={progress}
            variant="determinate"
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
