import { Badge, Button, Typography } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import useStyles from './styles';
import theme from '../../../theme';
import hooks from '../../../hooks/walletConnect';

type T = {
  onClick?: Function;
};

const ConnectWallet = ({ onClick }: T): React.ReactElement => {
  const classes = useStyles(theme);
  const { connectWalletMetaMask, wallet } = hooks();

  const handleClick = () => {
    if (wallet.loadingWallet) return;
    connectWalletMetaMask();
  };

  return (
    <Button onClick={handleClick} className={classes.root}>
      <Badge className={classes.badge} />
      <Typography variant="caption" className={classes.label}>
        {wallet?.account || 'Connect your wallet'}
      </Typography>
    </Button>
  );
};

export default React.memo(ConnectWallet);
