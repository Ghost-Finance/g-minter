import React from 'react';
import { Box } from '@material-ui/core';
import useStyles from './styles';
import theme from '../../theme';

const AlertLeftBar = () => {
  const classes = useStyles(theme);
  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.bottomBox}>&nbsp;</div>
      </div>
    </Box>
  );
};

export default AlertLeftBar;
