import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexFlow: 'row',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        flexFlow: 'column',
      },
    },
    pageActived: {
      display: 'flex',
      width: '100%',
      height: '100vh',
      backgroundColor: theme.palette.primary.light,
    },
    pageActivedTop: {
      width: '100%',
      height: 300,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundColor: theme.palette.primary.dark,
    },
    main: {
      flexGrow: 1,
      padding: '0 10%',
      [theme.breakpoints.down('md')]: {
        padding: '0 5%',
      },
    },
    content: {
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    text: {
      color: theme.palette.primary.contrastText,
      fontSize: '1.125rem',
      lineHeight: 2,
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
      },
    },
    column: {
      minHeight: '0',
    },
    columnFixed: {
      top: 150,
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
      height: '100%',
    },
    center: {
      width: '100%',
      maxWidth: '580px',
      [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
      },
    },
    item: {
      marginTop: theme.spacing(20),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1),
      },
    },
    walletGrid: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    },
    walletContainer: {
      [theme.breakpoints.down('md')]: {
        width: '100%',
        maxWidth: '100%',
      },
    },
    marginLogo: {
      marginLeft: '70px',
    },
  })
);
