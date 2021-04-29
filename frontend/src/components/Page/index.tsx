import React from 'react'
import {
  Container,
  Grid,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import GhostRatio from '../GhostRatio'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      paddingLeft: 0,
      paddingRight: 0
    },
    column: {
      top: '70px',
      minHeight: '0'
    },
    columnFixed: {
      top: '70px',
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
      height: 'calc(100vh - 10px)'
    },
    item: {
      paddingTop: '70px',
      padding: theme.spacing(1)
    }
  })
)

interface Props {
  account: string
  networkName: string
}

const Page = ({ account, networkName }: Props) => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Grid className={classes.column} xs={4}>
        <Grid item className={classes.item}>
          <GhostRatio />
        </Grid>
      </Grid>
      <Grid className={classes.columnFixed} xs={8}>
        <Grid item className={classes.item}></Grid>
      </Grid>
    </Container>
  )
}

export default Page
