import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    width: '80px',
    minWidth: '80px',
    paddingTop: '48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: '28px',
    height: '16px',
    position: 'fixed',
  },
}));
