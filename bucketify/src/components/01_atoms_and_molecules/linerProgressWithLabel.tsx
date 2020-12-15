import React from 'react';

import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

type LinearProgressWithLabelProps = LinearProgressProps & {
  children?: never;
  value: number;
  processedCount: number;
  allCount: number;
};

export const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} color="secondary" />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2">{`${props.processedCount}/${props.allCount}`}</Typography>
      </Box>
    </Box>
  );
};
