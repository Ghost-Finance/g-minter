import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import useStyles from '../style';
import ButtonForm from '../../components/Button/ButtonForm';
import ConnectWallet from '../../components/Button/ConnectWallet';

export interface Props {
  children: React.ReactNode;
}

const ContentPage = (props: Props) => {
  const classes = useStyles();
  const [btnDisabled, setBtnDisabled] = useState(true);

  return (
    <div className="modal side-left">
      <Grid container direction="column" className={classes.root}>
        <div className={classes.containerTop}>
          <Grid item>
            <Link to="/" className={classes.link}>
              <ButtonForm text="Cancel" className={classes.buttonCancel} />
            </Link>
          </Grid>

          <Grid item>
            <ConnectWallet />
          </Grid>
        </div>

        <div className={classes.topBox}>&nbsp;</div>
        {props.children}
        <div className={btnDisabled ? classes.disabled : classes.active}>
          &nbsp;
        </div>
      </Grid>
    </div>
  );
};

export default ContentPage;
