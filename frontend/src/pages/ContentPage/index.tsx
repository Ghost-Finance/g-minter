import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import useStyles from '../style';
import ButtonForm from '../../components/Button/ButtonForm';
import ConnectWallet from '../../components/Button/ConnectWallet';

export interface Props {
  children: React.ReactNode;
}

const ContentPage = (props: Props) => {
  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const classes = useStyles();

  return (
    <div className="modal side-left">
      {redirect ? (
        <Redirect
          to={{
            pathname: '/alert',
          }}
        />
      ) : null}

      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}
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
      </Grid>
    </div>
  );
};

export default ContentPage;
