import React from 'react';
import theme from '../../theme';
import useStyles from './styles';
import hamburger from '../../assets/hamburger-menu.png';

export default (): React.ReactElement => {

    const classes = useStyles(theme);
    
    return(
        <div className={classes.root}>
            <img src={hamburger} className={classes.image} />
        </div>
    )
}
