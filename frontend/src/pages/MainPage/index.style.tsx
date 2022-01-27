import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
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
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
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
    },
    marginLogo: {
      marginLeft: '70px',
    },
  })
);
