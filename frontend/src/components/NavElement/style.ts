import { makeStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    width: '25%',
  },
  drawerPaper: {
    zIndex: 100,
    left: '80px',
    width: '25%',
    backgroundColor: theme.palette.primary.dark,
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      left: 0,
      width: '100vw',
    },
  },
  drawerPaperWithoutBackground: {
    //  width: '100%',
    zIndex: 100,
    left: 0,
    backgroundColor: 'transparent',
    border: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'static !important',
      overflowY: 'visible !important',
      flexDirection: 'row !important',
    },
  },
  content: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    paddingTop: '48px',
    padding: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      paddingTop: '22px',
    },
  },
}));

export default useStyle;
