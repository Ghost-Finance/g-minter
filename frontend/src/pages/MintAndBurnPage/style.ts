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
    containerTop: {
      display: 'flex',
      width: '63%',
      justifyContent: 'space-between',
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
