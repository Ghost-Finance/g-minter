import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 547,
    height: 328,
    background: theme.palette.primary.dark,
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  },
  media: {
    backgroundPosition: 'bottom',
    width: '100%',
    height: '100%',
  },
}))
