import { Badge, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';
import theme from '../../../theme';
const ConnectWallet = (): React.ReactElement => {
    const classes = useStyles(theme);
    const loading = true;
    return(
        <ListItem className={`${classes.root} ${loading ? classes.rootLoading : ''}`}>
            <Badge className={`${classes.badge} ${loading ? classes.badgeLoading : ''}`} />
            <Typography variant="caption" className={`${classes.label} ${loading ? classes.labelLoading : ''}`}>Connect your wallet</Typography>
        </ListItem>
    )
}

export default React.memo(ConnectWallet)