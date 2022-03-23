import React, { useState, createContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Box, Theme, withStyles, createStyles } from '@material-ui/core';
import AlertPage from '../AlertPage';
import useStyles from '../style';
import ButtonForm from '../../components/Button/ButtonForm';
import ConnectWallet from '../../components/Button/ConnectWallet';
import useRedirect from '../../hooks/useRedirect';

export interface ContentProps {
  showCancel?: boolean;
  backgroundImage?: string;
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

export const ContentPage = (props: ContentProps) => {
  const { redirect, redirectHome, setRedirect, setRedirectHome } =
    useRedirect();
  const [action, setCurrentAction] = useState('');
  const classes = useStyles();

  const ContentWithBackground = withStyles((theme: Theme) =>
    createStyles({
      root: {
        top: 0,
        left: 0,
        ...(props.backgroundImage && {
          backgroundImage: `url(${props.backgroundImage})`,
        }),
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'fixed',
        width: '100%',
        height: '300px',
        '&::before': {
          content: '""',
          left: 0,
          top: 0,
          position: 'fixed',
          width: '100%',
          opacity: '0.5',
          backgroundColor: 'rgba(51, 51, 51, 0.9)',
          height: '300px',
          pointerEvents: 'none',
          zIndex: 1,
          [theme.breakpoints.down('sm')]: {
            height: '100px',
          },
        },
        [theme.breakpoints.down('sm')]: {
          zIndex: '200',
        },
      },
    })
  )(Box);

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
            {<ContentWithBackground component="div" />}
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
