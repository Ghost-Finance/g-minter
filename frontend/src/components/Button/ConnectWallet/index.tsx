import { Badge, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';
import theme from '../../../theme';
const ConnectWallet = (): React.ReactElement => {
    const classes = useStyles(theme);
    return(
        <ListItem button className={classes.root}>
            <Badge className={classes.badge} />
            <Typography variant="caption" className={classes.label}>Connect your wallet</Typography>
        </ListItem>
    )
}

export default React.memo(ConnectWallet)