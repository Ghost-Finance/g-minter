import { makeStyles, createStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingLeft: 0,
      paddingRight: 0
    },
    column: {
      minHeight: '0'
    },
    columnFixed: {
      top: '60px',
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
      height: 'calc(100vh - 10px)'
    },
    item: {
      padding: theme.spacing(1),
    },
  })
)
