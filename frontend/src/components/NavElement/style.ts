import { makeStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: 400,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: 400,
    zIndex: 0,
    left: '80px',
    backgroundColor: theme.palette.primary.dark,
    [theme.breakpoints.down('md')]: {
      width: 300,
    },
  },
  content: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    paddingTop: '70px',
    padding: theme.spacing(1),
  },
}));

export default useStyle;
