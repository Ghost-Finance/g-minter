import React from 'react';
import useStyles from './styles';
import Main from '../main';
import AppMenu from '../AppMenu';

export default (): React.ReactElement => {

    const classes = useStyles();

    return(
      <div className={classes.root}>
        <AppMenu />
        <Main />
      </div>
    )
}
