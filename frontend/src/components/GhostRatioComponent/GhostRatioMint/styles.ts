import { makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '28px',
    width: '100%',
    overflowX: 'hidden',
  },
  box: {
    display: 'flex',
    flexFlow: 'column',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    padding: theme.spacing(2, 7),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      float: 'none',
      padding: theme.spacing(2, 5),
    },
  },
  content: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    // flexFlow: 'column',
    padding: '25px',
    [theme.breakpoints.down('md')]: {
      padding: '0 25px 5px',
    },
  },
}));
