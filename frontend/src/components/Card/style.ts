import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 547,
    height: 328,
    background: theme.palette.primary.dark,
    borderTop: `4px solid ${theme.palette.primary.light}`,
    borderLeft: `4px solid ${theme.palette.primary.light}`,
    borderRight: `4px solid ${theme.palette.primary.light}`,
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  },
  content: {
    width: '100%',
  },
  media: {
    height: 0,
    paddingTop: '26%',
    [theme.breakpoints.down('md')]: {
      paddingTop: '30%',
    }
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 5,
    textAlign: 'center',
    color: theme.palette.primary.contrastText,
  }
}))
