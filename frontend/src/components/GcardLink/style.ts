import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 547,
    maxHeight: 328,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  card: {
    width: '100%',
    height: '100%',
    background: theme.palette.primary.dark,
    boxSizing: 'border-box',
    marginBottom: 12,
  },
  media: {
    backgroundPosition: 'bottom',
    width: '100%',
    height: '100%',
    paddingTop: '1%',
  },
}))

export default useStyles