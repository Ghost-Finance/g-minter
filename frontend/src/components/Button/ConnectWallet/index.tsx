import { Badge, Button, Typography } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import useStyles from './styles';
import theme from '../../../theme';
import hooks from '../../../hooks/walletConnect';
import { Link } from 'react-router-dom';

const ConnectWallet = (): React.ReactElement => {
  const classes = useStyles(theme);
  const { wallet } = hooks();

  const handleLink = (location: any) => {
    if (wallet.connected) {
      return {};
    }
    return {
      ...location,
      pathname: '/wallet-connect',
    };
  };

  return (
    <Link to={handleLink} className={classes.link}>
      <Button className={classes.root}>
        <Badge className={classes.badge} />
        <Typography variant="caption" className={classes.label}>
          {wallet?.account || 'Connect your wallet'}
        </Typography>
      </Button>
    </Link>
  );
};

export default React.memo(ConnectWallet);
