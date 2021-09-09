import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: theme.palette.primary.contrastText,
      left: '30%',
      width: '100%',
      height: '100%',
      marginTop: 20,
    },
    paperContent: {
      display: 'flex',
      padding: 50,
      // position: 'absolute',
      alignItems: 'flex-end',
    },
    cardForm: {
      marginTop: 20,
      width: 'calc(60%)',
      padding: 50,
      backgroundColor: theme.palette.primary.light,
      border: 1,
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
    buttonCancel: {
      color: theme.palette.primary.contrastText,
      fontSize: 14,
      fontWeight: 'bold',
      backgroundColor: `${theme.palette.primary.light} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.light} !important`,
      },
    },
  })
);

export default useStyle;
