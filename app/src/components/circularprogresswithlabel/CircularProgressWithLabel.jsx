import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyle = makeStyles({
  circularText: {
    WebkitUserSelect: 'none',
  }
})

const CircularProgressWithLabel = (props) => {
  const classes = useStyle();

  return (
    <Box position="relative" display="inline-flex" margin={2}>
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography className={classes.circularText} variant="caption" component="div" color="textSecondary">{`${Math.round(
          (props.value) / (10 / 2.9),
        )}`}</Typography>
      </Box>
    </Box>
  );
};

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default CircularProgressWithLabel;