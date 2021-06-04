import { makeStyles, Theme } from '@material-ui/core'

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: 400,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: 400,
    backgroundColor: theme.palette.primary.light,
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
  appbar: {
    width: 50,
    backgroundColor: theme.palette.primary.light,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  mobileButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  }
}))

export default useStyle
