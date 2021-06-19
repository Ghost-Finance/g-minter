import React, { useState } from 'react';
import useStyles from './styles';
import theme from '../../../theme';
import { Drawer, Grid } from '@material-ui/core';
import ConnectWallet from '../../../components/Button/ConnectWallet';

export default () => {
  const [opened, setOpened] = useState(false);
  const classes = useStyles(theme);

  const toggleDrawer = () => {
    setOpened(!opened);
  };

  const handleConnectClick = () => {
    toggleDrawer();
  };

  return (
    <Grid className={classes.root}>
      <ConnectWallet onClick={handleConnectClick} />
      <Drawer anchor={'right'} open={opened} onClose={toggleDrawer}></Drawer>
    </Grid>
  );
};
