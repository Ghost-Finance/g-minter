import { Badge, Button, Typography } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import useStyles from './styles';
import theme from '../../../theme';

type T = {
  onClick?: Function;
};

const ConnectWallet = ({ onClick }: T): React.ReactElement => {
  const classes = useStyles(theme);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Button onClick={handleClick} className={classes.root}>
      <Badge className={classes.badge} />
      <Typography variant="caption" className={classes.label}>
        Connect your wallet
      </Typography>
    </Button>
  );
};

export default React.memo(ConnectWallet);
