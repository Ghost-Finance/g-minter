import { Badge, Button, Typography } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import useStyles from './index.style';
import theme from '../../../theme.style';
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

  const { account } = wallet;
  return (
    <Link to={handleLink} className={classes.link}>
      <Button className={classes.root}>
        <Typography
          variant="caption"
          className={`${classes.label} ${account ? classes.ellipse : ''}`}
        >
          {account
            ? [account?.slice(0, 5), account?.slice(-5)].join('...')
            : 'Connect your wallet'}
        </Typography>
      </Button>
    </Link>
  );
};

export default React.memo(ConnectWallet);
