import React from 'react'
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'
import { MintCardIcon, BurnCardIcon, RewardCardIcon, SynthCardIcon } from '../../components/Icons'
import GhostRatio from '../../components/GhostRatio'
import Gcard from '../../components/Gcard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
      padding: theme.spacing(1),
    },
  })
)

interface Props {
  account?: string
  networkName?: string
}

const Main = ({ account, networkName }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item className={classes.column} xs={12} md={4} sm={4}>
          <div className={classes.item}>
            <GhostRatio />
          </div>
        </Grid>
        <Grid item className={classes.columnFixed} xs={12} md={8} sm={8}>
          <div className={classes.item}>
            <Gcard title="Mint gDAI" image={<MintCardIcon/>} />

            <Gcard title="Mint and Burn" image={<BurnCardIcon/>} />

            <Gcard title="Claim Rewards" image={<RewardCardIcon/>} />

            <Gcard title="Stake Synths" image={<SynthCardIcon/>} />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Main
