import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import AlertPage from '../AlertPage';
import useStyles from '../style';
import ButtonForm from '../../components/Button/ButtonForm';
import ConnectWallet from '../../components/Button/ConnectWallet';
import useRedirect from '../../hooks/useRedirect';
export interface Props {
  showCancel?: boolean;
  children: React.ReactNode;
}

export const ContextPage = createContext({
  redirect: false,
  redirectHome: false,
  action: '',
  setRedirect: (value: any) => {},
  setRedirectHome: (value: any) => {},
  setCurrentAction: (value: any) => {},
});

export const ContentPage = (props: Props) => {
  const { redirect, redirectHome, setRedirect, setRedirectHome } =
    useRedirect();
  const [action, setCurrentAction] = useState('');
  const classes = useStyles();

  return (
    <ContextPage.Provider
      value={{
        redirect,
        redirectHome,
        action,
        setRedirect,
        setRedirectHome,
        setCurrentAction,
      }}
    >
      {redirect ? (
        <AlertPage open={true} />
      ) : (
        <div className="modal side-left">
          {redirectHome ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : null}
          <Grid
            container
            direction="column"
            justify="flex-start"
            spacing={4}
            className={classes.root}
          >
            {props.showCancel && (
              <Grid
                container
                direction="row"
                item
                xs={8}
                sm
                spacing={2}
                className={classes.contentCard}
              >
                <Grid item xs={6}>
                  <Link to="/" className={classes.link}>
                    <ButtonForm
                      text="Cancel"
                      className={classes.buttonCancel}
                    />
                  </Link>
                </Grid>
                <Grid item xs={2}>
                  <ConnectWallet />
                </Grid>
              </Grid>
            )}
            <Grid
              container
              direction="column"
              item
              xs={8}
              sm
              spacing={2}
              className={classes.contentCard}
            >
              {props.children}
            </Grid>
          </Grid>
        </div>
      )}
    </ContextPage.Provider>
  );
};
