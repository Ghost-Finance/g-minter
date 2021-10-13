import { makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '85vh',
    overflowX: 'hidden',
    overflowY: 'hidden',
    [theme.breakpoints.up(1800)]: {
      height: '90vh',
    },
  },
  box: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'flex-end',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    overflowY: 'hidden',
    marginLeft: '70px',
    height: '100%',

    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      float: 'none',
    },
    [theme.breakpoints.up(1800)]: {
      height: '100%',
    },
  },
  bottomBox: {
    margin: '0 auto',
    width: '200px',
    height: '100px',
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '400px 400px 0 0',
  },
}));
