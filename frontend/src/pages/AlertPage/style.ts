import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: theme.palette.primary.contrastText,
      left: '30%',
      width: '100%',
      marginTop: 20,
    },
    paperContent: {
      display: 'flex',
      padding: '50px 50px 0px 50px',
      // position: 'absolute',
      alignItems: 'flex-start',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh',
    },
    cardForm: {
      marginTop: 20,
      width: 'calc(60%)',
    },
    contentCard: {
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'center',
      width: '100%',
    },
    link: {
      textDecoration: 'none',
    },
    help: {
      color: '#444',
    },
    buttonCancel: {
      color: theme.palette.primary.contrastText,
      fontSize: 14,
      fontWeight: 'bold',
      backgroundColor: `${theme.palette.primary.light} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.light} !important`,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      marginTop: '65px',
      marginBottom: '35px',
      fontFamily: 'Inter',
      fontSize: '36px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '44px',
      letterSpacing: '0em',
      textAlign: 'left',
      [theme.breakpoints.down(1800)]: {
        marginTop: '30px',
      },
    },
    subTitle: {
      marginBottom: '85px',
      color: theme.palette.secondary.dark,
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '22px',
      [theme.breakpoints.down(1800)]: {
        marginBottom: '35px',
      },
    },
    icon: {
      marginTop: '25px',
      [theme.breakpoints.down(1800)]: {
        marginTop: '0px',
      },
    },
    topBox: {
      margin: '0 auto',
      width: '325px !important',
      maxWidth: '325px',
      height: '41px',
      backgroundColor: '#171717',
      borderRadius: '0 0 40px 40px',
    },
    bottomBox: {
      marginTop: '90px',
      width: '100% !important',
      height: '90px',
      backgroundColor: theme.palette.primary.dark,
      [theme.breakpoints.up(1800)]: {
        marginTop: '260px',
      },
      [theme.breakpoints.down(1800)]: {
        marginTop: '67px',
      },
    },
    bottomBoxYellow: {
      width: '100% !important',
      height: '6px',
      backgroundColor: theme.palette.warning.main,
    },
    textYellow: {
      color: theme.palette.warning.main,
    },
  })
);

export default useStyle;
